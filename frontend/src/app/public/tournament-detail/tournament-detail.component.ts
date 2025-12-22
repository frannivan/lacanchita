import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-4 py-6" *ngIf="torneoId">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Detalles del Torneo</h1>
        <button (click)="loadData()" class="text-sm text-emerald-600 hover:text-emerald-800">Actualizar</button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 mb-6">
        <button (click)="activeTab = 'tabla'" [class.border-emerald-500]="activeTab === 'tabla'" [class.text-emerald-600]="activeTab === 'tabla'" class="py-2 px-4 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:text-emerald-600">Tabla General</button>
        <button (click)="activeTab = 'partidos'" [class.border-emerald-500]="activeTab === 'partidos'" [class.text-emerald-600]="activeTab === 'partidos'" class="py-2 px-4 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:text-emerald-600">Resultados</button>
        <button (click)="activeTab = 'goleo'" [class.border-emerald-500]="activeTab === 'goleo'" [class.text-emerald-600]="activeTab === 'goleo'" class="py-2 px-4 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:text-emerald-600">Goleo</button>
      </div>

      <!-- Tabla General -->
      <div *ngIf="activeTab === 'tabla'" class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-10">Pos</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
              <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Partidos Jugados">PJ</th>
              <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Ganados">G</th>
              <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Empatados">E</th>
              <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Perdidos">P</th>
              <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Goles a Favor">GF</th>
              <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Goles en Contra">GC</th>
              <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Diferencia de Goles">DG</th>
              <th class="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider" title="Puntos">Pts</th>
              <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Últimos 5</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let row of standings; let i = index" [class.bg-emerald-50]="i < 4">
              <td class="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ i + 1 }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                 <!-- Placeholder logo if needed, explicit requirement was just to match structure text-wise -->
                 {{ row.equipo }}
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ row.juegosJugados }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ row.ganados }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ row.empatados }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ row.perdidos }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ row.golesFavor }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ row.golesContra }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ row.diferenciaGoles }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-900">{{ row.puntos }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-center">
                 <div class="flex items-center justify-center space-x-1">
                   <div *ngFor="let result of row.ultimos5" 
                        class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                        [style.background-color]="result === 'G' ? '#22c55e' : (result === 'E' ? '#9ca3af' : '#ef4444')">
                     <span *ngIf="result === 'G'">✓</span>
                     <span *ngIf="result === 'E'">-</span>
                     <span *ngIf="result === 'P'">✕</span>
                   </div>
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resultados (Past Matches) -->
      <div *ngIf="activeTab === 'partidos'" class="space-y-4">
        <div *ngFor="let match of matches" class="bg-white rounded-lg shadow p-4 border-l-4 border-emerald-500 flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm text-gray-500 mb-2 md:mb-0">{{ match.fecha }} | {{ match.canchaNombre }}</div>
          <div class="flex items-center space-x-4 flex-1 justify-center">
             <span class="font-bold text-gray-800 text-lg w-1/3 text-right">
               {{ match.equipoLocal }}
             </span>
             <div class="bg-gray-100 px-3 py-1 rounded text-xl font-mono font-bold">
               <span [style.color]="match.golesLocal > match.golesVisitante ? '#22c55e' : (match.golesLocal < match.golesVisitante ? '#ef4444' : '#6b7280')">{{ match.golesLocal }}</span>
               -
               <span [style.color]="match.golesVisitante > match.golesLocal ? '#22c55e' : (match.golesVisitante < match.golesLocal ? '#ef4444' : '#6b7280')">{{ match.golesVisitante }}</span>
             </div>
             <span class="font-bold text-gray-800 text-lg w-1/3 text-left">
               {{ match.equipoVisitante }}
             </span>
          </div>
          <div class="text-xs text-gray-400 mt-2 md:mt-0">{{ match.tipoPartido }}</div>
        </div>
      </div>

      <!-- Goleo -->
      <div *ngIf="activeTab === 'goleo'" class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
           <thead class="bg-gray-50">
             <tr>
               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jugador</th>
               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
               <th class="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Goles</th>
             </tr>
           </thead>
           <tbody class="bg-white divide-y divide-gray-200">
             <tr *ngFor="let player of scorers">
               <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ player.jugador }}</td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ player.equipo }}</td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-emerald-600">{{ player.goles }}</td>
             </tr>
           </tbody>
        </table>
      </div>
    </div>
  `
})
export class TournamentDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  api = inject(ApiService);
  cdr = inject(ChangeDetectorRef);

  torneoId: string | null = null;
  activeTab = 'tabla';

  standings: any[] = [];
  matches: any[] = [];
  scorers: any[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.torneoId = params.get('id');
      if (this.torneoId) this.loadData();
    });
  }

  loadData() {
    if (!this.torneoId) return;

    this.api.get<any[]>(`public/torneos/${this.torneoId}/tabla`).subscribe({
      next: (data) => {
        this.standings = data;
        this.cdr.detectChanges();
      },
      error: () => this.cdr.detectChanges()
    });

    this.api.get<any[]>(`public/torneos/${this.torneoId}/partidos/pasados`).subscribe({
      next: (data) => {
        this.matches = data;
        this.cdr.detectChanges();
      },
      error: () => this.cdr.detectChanges()
    });

    this.api.get<any[]>(`public/torneos/${this.torneoId}/goleo`).subscribe({
      next: (data) => {
        this.scorers = data;
        this.cdr.detectChanges();
      },
      error: () => this.cdr.detectChanges()
    });
  }
}
