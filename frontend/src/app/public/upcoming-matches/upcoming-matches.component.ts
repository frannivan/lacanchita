import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { SoccerFieldWrapperComponent } from '../../shared/components/soccer-field-wrapper/soccer-field-wrapper.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-upcoming-matches',
    standalone: true,
    imports: [CommonModule, SoccerFieldWrapperComponent, FormsModule],
    template: `
    <app-soccer-field-wrapper title="Próximos Partidos">
      
      <!-- Filters -->
      <div class="bg-white/95 backdrop-blur rounded-xl shadow-lg p-6 mb-8 border border-white/20">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Buscar Equipo</label>
                  <input [(ngModel)]="filters.team" (ngModelChange)="applyFilters()" type="text" placeholder="Nombre del equipo..." class="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-gray-800 font-bold">
              </div>
              <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Filtrar por Torneo</label>
                  <select [(ngModel)]="filters.tournament" (ngModelChange)="applyFilters()" class="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-gray-800">
                      <option value="">Todos los Torneos</option>
                      <option *ngFor="let t of tournaments" [value]="t">{{ t }}</option>
                  </select>
              </div>
              <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Filtrar por Cancha</label>
                  <select [(ngModel)]="filters.cancha" (ngModelChange)="applyFilters()" class="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-gray-800">
                      <option value="">Todas las Canchas</option>
                      <option *ngFor="let c of canchas" [value]="c">{{ c }}</option>
                  </select>
              </div>
              <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha</label>
                  <input [(ngModel)]="filters.date" (ngModelChange)="applyFilters()" type="date" class="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-gray-800">
                  <div class="flex gap-2 mt-2">
                       <button (click)="setToday()" class="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200">Hoy</button>
                       <button (click)="clearDate()" class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200">Limpiar</button>
                  </div>
              </div>
          </div>
      </div>

      <!-- Table Container -->
      <div class="overflow-x-auto rounded-xl shadow-2xl border border-white/20">
          <table class="w-full bg-white/95 backdrop-blur text-sm text-left">
              <thead class="text-xs text-white uppercase bg-gradient-to-r from-emerald-800 to-emerald-600">
                  <tr>
                      <th class="px-6 py-4">Torneo</th>
                      <th class="px-6 py-4">Fecha / Hora</th>
                      <th class="px-6 py-4 text-center">Local</th>
                      <th class="px-6 py-4 text-center">vs</th>
                      <th class="px-6 py-4 text-center">Visitante</th>
                      <th class="px-6 py-4 text-right">Cancha</th>
                      <th class="px-6 py-4 text-center">Acciones</th>
                  </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                   <tr *ngFor="let match of filteredMatches" class="hover:bg-emerald-50/50 transition-colors">
                      <td class="px-6 py-4 font-bold text-emerald-800">
                          {{ match.torneoNombre }}
                          <div class="text-[10px] text-gray-500 font-normal uppercase mt-0.5">{{ match.categoria }}</div>
                      </td>
                      <td class="px-6 py-4">
                          <div class="font-bold text-gray-900">{{ match.fecha }}</div>
                          <div class="text-emerald-600 font-mono">{{ match.hora }}</div>
                      </td>
                      <td class="px-6 py-4 text-right font-bold text-gray-800 text-base">
                          {{ match.equipoLocal }}
                      </td>
                      <td class="px-6 py-4 text-center">
                          <span class="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">VS</span>
                      </td>
                      <td class="px-6 py-4 text-left font-bold text-gray-800 text-base">
                          {{ match.equipoVisitante }}
                      </td>
                      <td class="px-6 py-4 text-right font-medium text-gray-600 uppercase tracking-wide">
                          {{ match.canchaNombre }}
                      </td>
                      <td class="px-6 py-4 text-center">
                           <div class="flex justify-center gap-2">
                              <!-- WhatsApp Share -->
                              <button (click)="shareWhatsApp(match)" class="text-green-500 hover:text-green-700 transition-colors p-2 rounded-full hover:bg-green-100" title="Compartir en WhatsApp">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                 </svg>
                              </button>

                              <!-- Facebook Share -->
                              <button (click)="shareMatch(match)" class="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-100" title="Compartir en Facebook">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                     <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.196 0-5.192 1.583-5.192 4.615v3.385z"/>
                                 </svg>
                              </button>
                           </div>
                      </td>
                   </tr>
                   
                   <tr *ngIf="filteredMatches.length === 0 && !loading">
                      <td colspan="7" class="px-6 py-12 text-center text-gray-500 text-lg">
                          No se encontraron partidos con los filtros seleccionados.
                      </td>
                   </tr>
              </tbody>
          </table>
      </div>

      <div *ngIf="loading" class="text-center text-white text-xl animate-pulse py-10">Cargando partidos...</div>
    </app-soccer-field-wrapper>
  `
})
export class UpcomingMatchesComponent {
    api = inject(ApiService);
    cdr = inject(ChangeDetectorRef);

    allMatches: any[] = [];
    filteredMatches: any[] = [];
    loading = true;

    // Filter Lists
    tournaments: string[] = [];
    canchas: string[] = [];

    filters = {
        team: '',
        tournament: '',
        cancha: '',
        date: ''
    };

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.api.get<any[]>('public/torneos').subscribe({
            next: (torneos) => {
                if (torneos.length === 0) {
                    this.loading = false;
                    this.cdr.detectChanges();
                    return;
                }

                let loadedCount = 0;
                torneos.forEach(t => {
                    this.api.get<any[]>(`public/torneos/${t.id}/partidos/proximos`).subscribe({
                        next: (matches) => {
                            if (matches && matches.length > 0) {
                                // Add to flat list
                                this.allMatches.push(...matches);
                            }
                            loadedCount++;
                            if (loadedCount === torneos.length) {
                                this.finalizeLoading();
                            }
                        },
                        error: () => {
                            loadedCount++;
                            if (loadedCount === torneos.length) {
                                this.finalizeLoading();
                            }
                        }
                    });
                });
            },
            error: () => {
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    finalizeLoading() {
        // Extract unique options for dropdowns
        this.tournaments = [...new Set(this.allMatches.map(m => m.torneoNombre))];
        this.canchas = [...new Set(this.allMatches.map(m => m.canchaNombre))];

        // Initial filter
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
    }

    applyFilters() {
        this.filteredMatches = this.allMatches.filter(match => {
            const teamFilter = this.filters.team ? this.filters.team.toLowerCase() : '';
            const local = match.equipoLocal ? match.equipoLocal.toLowerCase() : '';
            const visitante = match.equipoVisitante ? match.equipoVisitante.toLowerCase() : '';

            const teamMatch = !this.filters.team ||
                local.includes(teamFilter) ||
                visitante.includes(teamFilter);

            const tournamentMatch = !this.filters.tournament || match.torneoNombre === this.filters.tournament;

            const canchaMatch = !this.filters.cancha || match.canchaNombre === this.filters.cancha;

            const dateMatch = !this.filters.date || match.fecha === this.filters.date;

            return teamMatch && tournamentMatch && canchaMatch && dateMatch;
        });

        // Sort by Date/Time
        this.filteredMatches.sort((a, b) => {
            const dateA = new Date((a.fecha || '') + 'T' + (a.hora || '00:00'));
            const dateB = new Date((b.fecha || '') + 'T' + (b.hora || '00:00'));
            return dateA.getTime() - dateB.getTime();
        });
    }

    setToday() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        this.filters.date = `${yyyy}-${mm}-${dd}`;
        this.applyFilters();
    }

    clearDate() {
        this.filters.date = '';
        this.applyFilters();
        this.cdr.detectChanges(); // Ensure UI updates
    }

    shareMatch(match: any) {
        const torneo = match.torneoNombre || 'Torneo';
        const categoria = match.categoria || 'General';
        const cancha = match.canchaNombre || 'Por definir';
        const fecha = match.fecha || 'Fecha pendiente';
        const hora = match.hora || 'Hora pendiente';
        const local = match.equipoLocal || 'Local';
        const visitante = match.equipoVisitante || 'Visitante';
        const hashtag = torneo.replace(/\s+/g, '');

        // Use backend proxy URL for Facebook to get OG metadata
        const backendUrl = `${window.location.origin}/api/public/partidos/${match.id}/share`;
        const directUrl = `${window.location.origin}/partido/${match.id}`; // For WhatsApp text

        const text = `⚽ *¡Próximo Partido!* ⚽\n\n🏆 *Torneo:* ${torneo} (${categoria})\n🏟️ *Cancha:* ${cancha}\n📅 *Fecha:* ${fecha}\n⏰ *Hora:* ${hora}\n\n🔥 *Encuentro:*\n${local} 🆚 ${visitante}\n\n🔗 *Info:* ${directUrl}\n\n#LaCanchita #Futbol #${hashtag}`;

        // 1. Copy to Clipboard (Best for details)
        this.copyToClipboard(text);

        // 2. Open Facebook Sharer
        // Use backend URL for rich preview
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(backendUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    }

    shareWhatsApp(match: any) {
        const torneo = match.torneoNombre || 'Torneo';
        const categoria = match.categoria || 'General';
        const cancha = match.canchaNombre || 'Por definir';
        const fecha = match.fecha || 'Fecha pendiente';
        const hora = match.hora || 'Hora pendiente';
        const local = match.equipoLocal || 'Local';
        const visitante = match.equipoVisitante || 'Visitante';
        const hashtag = torneo.replace(/\s+/g, '');

        // Use dedicated match page URL
        const urlToShare = `${window.location.origin}/partido/${match.id}`;

        const text = `⚽ *¡Próximo Partido!* ⚽\n\n🏆 *Torneo:* ${torneo} (${categoria})\n🏟️ *Cancha:* ${cancha}\n📅 *Fecha:* ${fecha}\n⏰ *Hora:* ${hora}\n\n🔥 *Encuentro:*\n${local} 🆚 ${visitante}\n\n🔗 *Info:* ${urlToShare}\n\n#LaCanchita #Futbol #${hashtag}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    }

    copyToClipboard(text: string) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                // Success
            }).catch(err => {
                this.fallbackCopyTextToClipboard(text);
            });
        } else {
            this.fallbackCopyTextToClipboard(text);
        }
    }

    fallbackCopyTextToClipboard(text: string) {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Ensure it's not visible but part of the DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                alert('¡Detalles del partido copiados! Pégalos en Facebook para compartir.');
            } else {
                alert('No se pudo copiar el texto. Por favor copia manualmente.');
                console.error('Fallback copy failed.');
            }
        } catch (err) {
            console.error('Fallback copy error', err);
            alert('Error al copiar. Por favor intenta manualmente.');
        }

        document.body.removeChild(textArea);
    }
}
