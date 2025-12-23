import { Component, inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { RouterModule } from '@angular/router';
import { InteractiveBallComponent } from '../../shared/components/interactive-ball/interactive-ball.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, InteractiveBallComponent],
    template: `
    <div class="min-h-screen bg-gray-900 font-sans relative">
      <!-- Hero Section with Interactive Game -->
      <div class="relative min-h-[600px] overflow-hidden group flex flex-col md:block">
        
        <!-- Mobile: Game Container (Order 2) -->
        <div class="block md:absolute md:inset-0 h-[400px] md:h-full w-full order-2 md:order-none relative bg-gray-900">
             <!-- Contrast Overlay (Gradient) - Background -->
            <div class="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-emerald-900/60 pointer-events-none z-0"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none z-0"></div>

            <!-- Game Layer -->
            <app-interactive-ball class="absolute inset-0 z-10"></app-interactive-ball>
        </div>

        <!-- Content Layer (Mobile: Order 1) -->
        <div class="relative z-20 container mx-auto px-4 flex flex-col justify-center items-start pt-20 pb-8 md:pb-0 md:h-full md:absolute md:inset-0 pointer-events-none order-1 md:order-none">
          <h1 class="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
            LA <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">CANCHITA</span>
          </h1>
          <p class="text-lg md:text-xl text-gray-200 max-w-2xl font-light mb-8 drop-shadow-lg text-shadow">
            Tu complejo deportivo de primer nivel. Torneos, partidos y la mejor comunidad de fútbol.
          </p>
          <div class="flex gap-4 pointer-events-auto">
              <button [routerLink]="['/torneos']" class="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2">
                <span>🏆</span> Ver Torneos
              </button>
               <button [routerLink]="['/partidos/proximos']" class="px-8 py-4 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-md text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg border border-gray-700">
                📅 Partidos
              </button>
          </div>
        </div>
      </div>

      <!-- Gallery Carousel Section -->
      <div class="bg-black py-12 border-b border-gray-800 overflow-hidden">
          <!-- Header (Contained) -->
          <div class="container mx-auto px-4 mb-8">
              <div class="flex items-center justify-between">
                  <h2 class="text-3xl font-bold text-white tracking-wide border-l-4 border-emerald-500 pl-4">
                      Galería <span class="text-gray-400 font-light">Destacada</span>
                  </h2>
              </div>
          </div>

          <!-- Carousel Container (Full Width) -->
          <div class="relative w-full group">
              
              <!-- Left Button -->
              <button (click)="scrollCarousel(-1)" class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-3 bg-black/80 hover:bg-emerald-600 text-white rounded-full backdrop-blur-md transition-colors shadow-xl border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
              </button>

              <!-- Scroll Area -->
              <div #carouselContainer class="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar px-4 md:px-8 w-full">
                  <div *ngFor="let photo of galleryPhotos" 
                       class="min-w-[250px] md:min-w-[320px] flex-shrink-0 bg-gray-900 rounded-xl shadow-lg overflow-hidden snap-center hover:shadow-2xl hover:shadow-emerald-900/30 transition-all duration-300 group/card border border-gray-800 flex flex-col">
                      
                      <!-- Image Area -->
                      <div class="h-48 relative overflow-hidden">
                          <img [src]="photo.url" [alt]="photo.title" 
                               class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 opacity-90 group-hover/card:opacity-100">
                          
                          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                      </div>

                      <!-- Content Area -->
                      <div class="p-5 flex-1 flex flex-col bg-gray-800">
                          <span class="text-[10px] font-bold text-emerald-500 mb-1 uppercase tracking-wider">{{ photo.category }}</span>
                          <h3 class="text-lg font-bold mb-1 text-white group-hover/card:text-emerald-400 transition-colors">{{ photo.title }}</h3>
                          <div class="w-full h-1 bg-gray-700 rounded-full mt-auto overflow-hidden">
                              <div class="h-full bg-emerald-500 w-0 group-hover/card:w-full transition-all duration-700 ease-out"></div>
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Right Button -->
              <button (click)="scrollCarousel(1)" class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-3 bg-black/80 hover:bg-emerald-600 text-white rounded-full backdrop-blur-md transition-colors shadow-xl border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
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

    // Gallery Carousel Data
    galleryPhotos = [
        {
            url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop',
            title: 'Gran Final 2024',
            category: 'Partidos'
        },
        {
            url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1000&auto=format&fit=crop',
            title: 'Nuestras Familias',
            category: 'Comunidad'
        },
        {
            url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1000&auto=format&fit=crop',
            title: 'Pequeños Campeones',
            category: 'Infantil'
        },
        {
            url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000&auto=format&fit=crop',
            title: 'Celebración en Equipo',
            category: 'Momentos'
        }
    ];
    // No more carousel state needed for horizontal scroll
    @ViewChild('carouselContainer') carouselContainer!: ElementRef;

    scrollCarousel(direction: number) {
        if (!this.carouselContainer) return;

        const container = this.carouselContainer.nativeElement;
        // Dynamic scroll amount: scroll one "page" or card width roughly
        const scrollAmount = container.clientWidth * 0.8;

        container.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }

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
