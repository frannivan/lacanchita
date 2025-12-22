import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-900 font-sans relative">
      <!-- Hero Section with Background -->
      <!-- Since image generation failed, using a modern gradient that implies a sports vibe -->
      <div class="relative h-[500px] overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-gray-900 to-emerald-900"></div>
        <div class="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2546&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

        <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start pt-20">
          <h1 class="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-xl">
            LA <span class="text-emerald-500">CANCHITA</span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-200 max-w-2xl font-light mb-8 drop-shadow-md">
            Tu complejo deportivo de primer nivel. Torneos, partidos y la mejor comunidad de fútbol.
          </p>
          <button [routerLink]="['/torneos']" class="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg">
            Ver Torneos Activos
          </button>
        </div>
      </div>

      <!-- News Section -->
      <div class="container mx-auto px-4 py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div class="flex items-center mb-12">
            <h2 class="text-4xl font-extrabold text-white border-l-8 border-emerald-500 pl-6 tracking-wide drop-shadow-lg">
                Noticias y <span class="text-emerald-400">Anuncios</span>
            </h2>
        </div>

        <div *ngIf="loading" class="text-center py-24">
            <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
            <p class="text-emerald-400 font-medium tracking-wide animate-pulse">Cargando las últimas novedades...</p>
        </div>

        <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div *ngFor="let n of noticias" class="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-900/40 transition-all duration-300 hover:-translate-y-2 group border border-gray-700/50">
                <div class="h-56 bg-gray-700 relative overflow-hidden">
                    <img *ngIf="n.imagenUrl" [src]="n.imagenUrl" (error)="n.imagenUrl = null" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100">
                    <div *ngIf="!n.imagenUrl" class="w-full h-full flex items-center justify-center bg-gray-700 text-gray-600 bg-[size:20px_20px] bg-[radial-gradient(#374151_1px,transparent_1px)]">
                        <span class="text-5xl opacity-40 grayscale group-hover:grayscale-0 transition-all">📢</span>
                    </div>
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                    
                    <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <span class="bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-emerald-500/30">
                            {{ formatTime(n.fechaPublicacion) }}
                        </span>
                    </div>
                </div>
                
                <div class="p-8 flex flex-col h-full">
                    <h3 class="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-emerald-400 transition-colors">{{ n.titulo }}</h3>
                    <p class="text-gray-400 text-base leading-relaxed mb-6 line-clamp-3">{{ n.contenido }}</p>
                    <div class="mt-auto pt-6 border-t border-gray-700/50">
                        <button class="text-emerald-500 font-bold text-sm tracking-uppercase hover:text-emerald-300 transition-all flex items-center group/btn">
                            LEER MÁS 
                            <span class="ml-2 transform group-hover/btn:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div *ngIf="!loading && noticias.length === 0" class="text-center py-20 text-gray-500 bg-gray-800/50 rounded-xl border border-gray-800">
            <p class="text-xl">No hay noticias publicadas recientemente.</p>
        </div>
      </div>
      
      <!-- Footer Simple -->
      <footer class="bg-gray-950 text-gray-500 py-8 border-t border-gray-900">
        <div class="container mx-auto px-4 text-center">
            <p>&copy; 2025 La Canchita. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `
})
export class HomeComponent {
    api = inject(ApiService);
    cdr = inject(ChangeDetectorRef);
    noticias: any[] = [];
    loading = true;

    ngOnInit() {
        this.api.get<any[]>('public/noticias').subscribe({
            next: (data) => {
                this.noticias = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (e: any) => {
                console.error(e);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    formatTime(dateStr: string): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    }
}
