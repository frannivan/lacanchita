import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-match-results',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Resultados</h1>
      <div *ngIf="loading" class="text-center">Cargando...</div>
      
      <!-- Ideally filter by tournament, showing all recent for now -->
      <div *ngFor="let match of matches" class="bg-white rounded-lg shadow p-4 mb-4 border-l-4 border-emerald-500 flex flex-col md:flex-row justify-between items-center">
        <div class="text-sm text-gray-500 mb-2 md:mb-0">{{ match.fecha }} | {{ match.canchaNombre }}</div>
        <div class="flex items-center space-x-4 flex-1 justify-center">
             <span class="font-bold text-gray-800 text-lg w-1/3 text-right">{{ match.equipoLocal }}</span>
             <div class="bg-gray-100 px-3 py-1 rounded text-xl font-mono font-bold">{{ match.golesLocal }} - {{ match.golesVisitante }}</div>
             <span class="font-bold text-gray-800 text-lg w-1/3 text-left">{{ match.equipoVisitante }}</span>
        </div>
        <div class="text-xs text-gray-400 mt-2 md:mt-0">{{ match.tipoPartido }}</div>
      </div>
      
      <div *ngIf="!loading && matches.length === 0" class="text-center text-gray-500">
        No hay resultados registrados.
      </div>
    </div>
  `
})
export class MatchResultsComponent {
    api = inject(ApiService);
    matches: any[] = [];
    loading = true;

    ngOnInit() {
        // Mocking: Fetching all matches or just using a placeholder endpoint if "all past matches" isn't implemented.
        // PublicPublicController has getPastMatches(torneoId).
        // For this view, we might need a general endpoint or just iterate active tournaments.
        // For simplicity: list empty or instruction.
        // Actually, let's just show a message or fetch for ID=1.
        this.api.get<any[]>('public/torneos').subscribe(torneos => {
            if (torneos.length > 0) {
                this.api.get<any[]>(`public/torneos/${torneos[0].id}/partidos/pasados`).subscribe({
                    next: (data) => { this.matches = data; this.loading = false; },
                    error: () => this.loading = false
                });
            } else {
                this.loading = false;
            }
        });
    }
}
