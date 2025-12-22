import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SoccerFieldWrapperComponent } from '../../shared/components/soccer-field-wrapper/soccer-field-wrapper.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-match-detail',
    standalone: true,
    imports: [CommonModule, SoccerFieldWrapperComponent, RouterModule],
    template: `
    <app-soccer-field-wrapper [title]="pageTitle">
      <div class="flex justify-center items-center min-h-[60vh] p-4">
        
        <div *ngIf="loading" class="text-white text-xl animate-pulse">
            Cargando datos del partido...
        </div>

        <div *ngIf="!loading && match" class="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full border border-white/20 relative">
            
            <!-- Header -->
            <div class="bg-gradient-to-r from-emerald-800 to-emerald-600 p-6 text-center relative overflow-hidden">
                <div class="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                <h2 class="text-2xl font-bold text-white relative z-10">{{ match.torneoNombre }}</h2>
                <div class="text-emerald-100 uppercase tracking-widest text-sm font-semibold mt-1 relative z-10">{{ match.categoria }}</div>
            </div>

            <!-- Content -->
            <div class="p-8">
                <!-- Teams -->
                <div class="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
                    <div class="text-center flex-1">
                        <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
                            🏠
                        </div>
                        <h3 class="text-xl font-black text-gray-800 leading-tight">{{ match.equipoLocal }}</h3>
                        <div class="text-xs text-gray-500 font-bold uppercase mt-1">Local</div>
                    </div>

                    <div class="flex flex-col items-center">
                        <div class="text-4xl font-black text-gray-300">VS</div>
                        <div *ngIf="match.estado === 'JUGADO'" class="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold mt-2">
                            {{ match.golesLocal }} - {{ match.golesVisitante }}
                        </div>
                        <div *ngIf="match.estado !== 'JUGADO'" class="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold mt-2 uppercase">
                            {{ match.fecha }}
                        </div>
                    </div>

                    <div class="text-center flex-1">
                        <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
                            ✈️
                        </div>
                        <h3 class="text-xl font-black text-gray-800 leading-tight">{{ match.equipoVisitante }}</h3>
                        <div class="text-xs text-gray-500 font-bold uppercase mt-1">Visitante</div>
                    </div>
                </div>

                <!-- Info Grid -->
                <div class="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div class="text-center">
                        <div class="text-xs text-gray-500 uppercase font-bold mb-1">Cancha</div>
                        <div class="font-bold text-gray-800 flex items-center justify-center gap-1">
                            🏟️ {{ match.canchaNombre }}
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="text-xs text-gray-500 uppercase font-bold mb-1">Hora</div>
                        <div class="font-bold text-gray-800 flex items-center justify-center gap-1">
                            ⏰ {{ match.hora }}
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="mt-8 flex flex-col gap-3">
                     <button (click)="shareWhatsApp()" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Compartir en WhatsApp
                     </button>

                     <button (click)="shareFacebook()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                        Compartir en Facebook
                     </button>
                    <button [routerLink]="['/partidos/proximos']" class="text-sm text-gray-400 hover:text-gray-600 font-bold py-2 text-center">
                        ← Ver todos los partidos
                    </button>
                </div>

            </div>
        </div>

        <div *ngIf="!loading && !match" class="text-center text-white p-8 bg-white/10 rounded-xl backdrop-blur">
            <h3 class="text-xl font-bold mb-2">Partido no encontrado</h3>
            <p class="text-emerald-100 mb-4">El partido que buscas no existe o ha sido eliminado.</p>
            <button [routerLink]="['/']" class="bg-white text-emerald-800 px-6 py-2 rounded-full font-bold hover:bg-emerald-50">
                Ir al Inicio
            </button>
        </div>

      </div>
    </app-soccer-field-wrapper>
  `
})
export class MatchDetailComponent implements OnInit {
    route = inject(ActivatedRoute);
    router = inject(Router);
    api = inject(ApiService);
    titleService = inject(Title);
    metaService = inject(Meta);
    cdr = inject(ChangeDetectorRef);

    match: any = null;
    loading = true;
    pageTitle = 'Detalles del Partido';

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.loadMatch(id);
            } else {
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadMatch(id: number) {
        this.api.get<any>(`public/partidos/${id}`).subscribe({
            next: (data) => {
                console.log('Match data received:', data);
                this.match = data;
                this.loading = false;
                this.pageTitle = `${data.equipoLocal} vs ${data.equipoVisitante}`;
                this.titleService.setTitle(`${data.equipoLocal} vs ${data.equipoVisitante} - La Canchita`);

                // Set Open Graph Tags for Facebook
                try {
                    this.metaService.updateTag({ property: 'og:title', content: `${data.equipoLocal} vs ${data.equipoVisitante} - La Canchita` });
                    this.metaService.updateTag({ property: 'og:description', content: `Torneo: ${data.torneoNombre} | Fecha: ${data.fecha} ${data.hora} | Cancha: ${data.canchaNombre}` });
                    this.metaService.updateTag({ property: 'og:url', content: window.location.href });
                    this.metaService.updateTag({ property: 'og:type', content: 'website' });
                } catch (e) {
                    console.error('Error setting meta tags:', e);
                }

                // Force UI Update
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading match:', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    shareWhatsApp() {
        if (!this.match) return;

        const m = this.match;
        const hashtag = m.torneoNombre.replace(/\s+/g, '');
        const currentUrl = window.location.href;

        const text = `⚽ *¡Partidazo en La Canchita!* ⚽\n\n${m.equipoLocal} 🆚 ${m.equipoVisitante}\n\n🏆 ${m.torneoNombre}\n📅 ${m.fecha} ⏰ ${m.hora}\n🏟️ ${m.canchaNombre}\n\n🔗 Ver detalles: ${currentUrl}\n\n#Futbol #LaCanchita #${hashtag}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    }

    shareFacebook() {
        if (!this.match) return;

        // Use backend proxy URL for Facebook to get OG metadata (Rich Preview)
        const backendUrl = `${window.location.origin}/api/public/partidos/${this.match.id}/share`;

        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(backendUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    }
}
