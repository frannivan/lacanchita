import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-partidos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Gestión de Partidos</h1>
      
      <!-- Global Tournament Selector -->
      <div class="mb-6">
           <label class="block text-lg font-bold text-gray-700 mb-2">Seleccionar Torneo</label>
           <select [(ngModel)]="schedule.torneoId" (change)="onTournamentChange()" class="w-full p-3 border rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 text-lg">
              <option [ngValue]="null" disabled>-- Seleccionar Torneo --</option>
              <option *ngFor="let t of torneos" [value]="t.id">{{ t.nombre }}</option>
           </select>
      </div>

      <!-- Selection & Scheduling Section -->
      <div *ngIf="schedule.torneoId" class="mb-8 p-4 bg-white rounded shadow border border-emerald-100">
        <h2 class="text-lg font-bold text-emerald-800 mb-4 cursor-pointer flex justify-between items-center" (click)="toggleScheduleForm()">
            <span>Programar Nuevo Partido</span>
            <span>{{ showScheduleForm ? '▼' : '▶' }}</span>
        </h2>
        
        <div *ngIf="showScheduleForm" class="mt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Teams -->
                <div>
                     <label class="block text-sm font-medium text-gray-700 mb-1">Equipo Local</label>
                     <select [(ngModel)]="schedule.localId" class="w-full p-2 border rounded border-gray-300">
                        <option [ngValue]="null">Seleccionar Local</option>
                        <option *ngFor="let team of equipos" [value]="team.id" [disabled]="team.id === schedule.visitanteId">{{ team.nombre }}</option>
                     </select>
                </div>
                <div>
                     <label class="block text-sm font-medium text-gray-700 mb-1">Equipo Visitante</label>
                     <select [(ngModel)]="schedule.visitanteId" class="w-full p-2 border rounded border-gray-300">
                        <option [ngValue]="null">Seleccionar Visitante</option>
                        <option *ngFor="let team of equipos" [value]="team.id" [disabled]="team.id === schedule.localId">{{ team.nombre }}</option>
                     </select>
                </div>
                <!-- Details -->
                <div>
                     <label class="block text-sm font-medium text-gray-700 mb-1">Cancha</label>
                     <select [(ngModel)]="schedule.canchaId" class="w-full p-2 border rounded border-gray-300">
                        <option [ngValue]="null">Seleccionar Cancha</option>
                        <option *ngFor="let c of canchas" [value]="c.id">{{ c.nombre }}</option>
                     </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                    <input [(ngModel)]="schedule.fecha" type="date" class="w-full p-2 border rounded border-gray-300">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                    <input [(ngModel)]="schedule.hora" type="time" class="w-full p-2 border rounded border-gray-300">
                </div>
                <div>
                     <label class="block text-sm font-medium text-gray-700 mb-1">Árbitro</label>
                     <input [(ngModel)]="schedule.arbitro" placeholder="Nombre del Árbitro" class="w-full p-2 border rounded border-gray-300">
                </div>
                <div>
                     <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Partido</label>
                     <div class="flex space-x-2">
                         <select [(ngModel)]="schedule.tipo" class="w-full p-2 border rounded border-gray-300">
                            <option value="JORNADA">Jornada Regular</option>
                            <option value="OCTAVOS">Octavos</option>
                            <option value="CUARTOS">Cuartos</option>
                            <option value="SEMIFINAL">Semifinal</option>
                            <option value="FINAL">Final</option>
                         </select>
                         <input *ngIf="schedule.tipo === 'JORNADA'" 
                                type="number" 
                                [(ngModel)]="schedule.jornadaNumero" 
                                placeholder="#" 
                                class="w-20 p-2 border rounded border-gray-300"
                                min="1">
                     </div>
                </div>
            </div>
            
            <div class="mt-6 flex justify-end">
                <button (click)="scheduleMatch()" 
                        [disabled]="!isValidSchedule()"
                        [class.opacity-50]="!isValidSchedule()"
                        class="px-6 py-2 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 transition-colors">
                    Programar Partido
                </button>
            </div>
        </div>
      </div>

      <!-- Match Management Accordion -->
      <div *ngIf="schedule.torneoId" class="space-y-4">
        <!-- Upcoming Matches -->
        <div class="border rounded shadow bg-white overflow-hidden">
            <button class="w-full px-4 py-3 bg-gray-50 flex justify-between items-center font-bold text-gray-700 hover:bg-gray-100"
                    (click)="toggleSection('upcoming')">
                <span>Próximos Partidos ({{ upcomingMatches.length }})</span>
                <span>{{ activeSection === 'upcoming' ? '▼' : '▶' }}</span>
            </button>
            
            <div *ngIf="activeSection === 'upcoming'" class="p-4 space-y-4">
                <div *ngIf="upcomingMatches.length === 0" class="text-gray-500 italic text-center py-4">No hay partidos programados.</div>
                
                <div *ngFor="let match of upcomingMatches" class="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-xs font-bold px-2 py-0.5 rounded"
                                  [ngClass]="match.estado === 'POSPUESTO' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'">
                                {{ match.estado }}
                            </span>
                            <span class="text-sm text-gray-500">{{ match.fecha }} {{ match.hora }} | {{ match.canchaNombre }}</span>
                        </div>
                        <div class="font-bold text-lg text-gray-800">
                            {{ match.equipoLocal }} vs {{ match.equipoVisitante }}
                        </div>
                        <div class="text-sm text-gray-600">Árb: {{ match.arbitro || 'No asignado' }} | {{ match.tipoPartido }}</div>
                    </div>
                    
                    <div class="flex space-x-2 mt-4 md:mt-0">
                        <button (click)="openPostpone(match)" class="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600">Posponer</button>
                        <button (click)="cancelMatch(match)" class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">Cancelar</button>
                        <button (click)="deleteMatch(match)" class="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">🗑</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Past Matches -->
        <div class="border rounded shadow bg-white overflow-hidden">
            <button class="w-full px-4 py-3 bg-gray-50 flex justify-between items-center font-bold text-gray-700 hover:bg-gray-100"
                    (click)="toggleSection('past')">
                <span>Partidos Pasados ({{ pastMatches.length }}) <span *ngIf="getOverdueCount() > 0" class="text-red-500 font-bold text-xl ml-1">*</span></span>
                <span>{{ activeSection === 'past' ? '▼' : '▶' }}</span>
            </button>
            
            <div *ngIf="activeSection === 'past'" class="p-4 space-y-4">
                <div *ngIf="pastMatches.length === 0" class="text-gray-500 italic text-center py-4">No hay partidos pasados.</div>

                <div *ngFor="let match of pastMatches" 
                     class="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center shadow-sm relative"
                     [ngClass]="{'border-red-400 bg-red-50': isOverdue(match), 'bg-white': !isOverdue(match), 'opacity-75 bg-gray-100': match.estado === 'CANCELADO'}">
                    
                    <div class="flex-1">
                         <div class="flex items-center space-x-2 mb-2">
                            <span class="text-xs font-bold px-2 py-0.5 rounded"
                                  [ngClass]="{
                                    'bg-green-100 text-green-800': match.estado === 'JUGADO',
                                    'bg-red-100 text-red-800': match.estado === 'CANCELADO',
                                    'bg-red-500 text-white': isOverdue(match) && match.estado !== 'CANCELADO'
                                  }">
                                {{ isOverdue(match) && match.estado !== 'CANCELADO' ? 'PENDIENTE (SIN RESULTADO)' : match.estado }}
                                <span *ngIf="isOverdue(match)" class="text-red-500 font-bold ml-1 text-lg">*</span>
                            </span>
                            <span class="text-sm text-gray-500">{{ match.fecha }} | {{ match.canchaNombre }}</span>
                        </div>
                        <div class="font-bold text-lg text-gray-800 flex items-center space-x-3">
                            <span>{{ match.equipoLocal }}</span>
                            <span class="bg-gray-200 px-2 py-0.5 rounded text-sm" *ngIf="match.estado === 'JUGADO'">
                                {{ match.golesLocal }} - {{ match.golesVisitante }}
                            </span>
                            <span>{{ match.equipoVisitante }}</span>
                        </div>
                    </div>

                    <div class="flex space-x-2 mt-4 md:mt-0" *ngIf="match.estado !== 'CANCELADO'">
                        <button (click)="openResultModal(match)" class="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700">
                            {{ match.estado === 'JUGADO' ? 'Editar Resultado' : 'Cargar Resultado' }}
                        </button>
                        <button (click)="openPostpone(match)" class="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600">Posponer</button>
                         <button (click)="deleteMatch(match)" class="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">🗑</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    
      <!-- Modals (Simple implementation using conditional rendering) -->
      
      <!-- Postpone Modal -->
      <div *ngIf="postponeTarget" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded shadow-lg w-96">
              <h3 class="text-lg font-bold mb-4">Posponer Partido</h3>
              <p class="mb-4 text-sm text-gray-600">Selecciona nueva fecha y hora para {{ postponeTarget.equipoLocal }} vs {{ postponeTarget.equipoVisitante }}</p>
              
              <label class="block text-sm mb-1">Nueva Fecha</label>
              <input type="date" [(ngModel)]="postponeData.fecha" class="w-full p-2 border rounded mb-3">
              
              <label class="block text-sm mb-1">Nueva Hora</label>
              <input type="time" [(ngModel)]="postponeData.hora" class="w-full p-2 border rounded mb-4">
              
              <div class="flex justify-end space-x-2">
                  <button (click)="postponeTarget = null" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                  <button (click)="confirmPostpone()" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Guardar Cambios</button>
              </div>
          </div>
      </div>

        <!-- Result Modal -->
      <div *ngIf="resultTarget" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div class="bg-white p-6 rounded shadow-lg w-full max-w-4xl my-10">
              <h3 class="text-lg font-bold mb-4 text-center">Cargar Resultado e Incidencias</h3>
              <p class="mb-6 text-sm text-gray-600 text-center">{{ resultTarget.equipoLocal }} vs {{ resultTarget.equipoVisitante }}</p>
              
              <!-- Score Inputs -->
              <div class="flex justify-center items-center space-x-8 mb-8">
                  <div class="text-center">
                      <label class="block text-sm font-bold mb-2 text-blue-800">{{ resultTarget.equipoLocal }}</label>
                      <input type="number" [(ngModel)]="resultData.golesLocal" class="w-24 p-3 border rounded text-center text-3xl font-bold bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <span class="text-4xl font-bold text-gray-300">-</span>
                  <div class="text-center">
                      <label class="block text-sm font-bold mb-2 text-blue-800">{{ resultTarget.equipoVisitante }}</label>
                      <input type="number" [(ngModel)]="resultData.golesVisitante" class="w-24 p-3 border rounded text-center text-3xl font-bold bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
                  </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
                <!-- Local Players -->
                <div>
                    <h4 class="font-bold text-center mb-4 text-gray-700">Goleadores {{ resultTarget.equipoLocal }}</h4>
                    <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
                        <div *ngFor="let p of resultPlayers.local" class="flex justify-between items-center p-2 border rounded hover:bg-gray-50">
                            <span class="text-sm truncate w-2/3">{{ p.numero }} - {{ p.nombre }}</span>
                            <div class="flex items-center space-x-2">
                                <button (click)="updateGoal(p.id, -1)" class="w-6 h-6 bg-gray-200 rounded text-gray-600 hover:bg-gray-300">-</button>
                                <span class="font-bold w-4 text-center">{{ getGoals(p.id) }}</span>
                                <button (click)="updateGoal(p.id, 1)" class="w-6 h-6 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">+</button>
                            </div>
                        </div>
                         <div *ngIf="resultPlayers.local.length === 0" class="text-sm text-gray-400 text-center">Cargando jugadores...</div>
                    </div>
                </div>
                
                <!-- Visitor Players -->
                <div>
                    <h4 class="font-bold text-center mb-4 text-gray-700">Goleadores {{ resultTarget.equipoVisitante }}</h4>
                    <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
                        <div *ngFor="let p of resultPlayers.visitor" class="flex justify-between items-center p-2 border rounded hover:bg-gray-50">
                            <span class="text-sm truncate w-2/3">{{ p.numero }} - {{ p.nombre }}</span>
                            <div class="flex items-center space-x-2">
                                <button (click)="updateGoal(p.id, -1)" class="w-6 h-6 bg-gray-200 rounded text-gray-600 hover:bg-gray-300">-</button>
                                <span class="font-bold w-4 text-center">{{ getGoals(p.id) }}</span>
                                <button (click)="updateGoal(p.id, 1)" class="w-6 h-6 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">+</button>
                            </div>
                        </div>
                        <div *ngIf="resultPlayers.visitor.length === 0" class="text-sm text-gray-400 text-center">Cargando jugadores...</div>
                    </div>
                </div>
              </div>
              
              <div class="flex justify-end space-x-3 mt-8 pt-4 border-t">
                  <button (click)="resultTarget = null" class="px-6 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 font-medium">Cancelar</button>
                  <button (click)="confirmResult()" class="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-medium shadow-sm">Guardar Resultado Completo</button>
              </div>
          </div>
      </div>
      
    </div>
  `
})
export class PartidosComponent implements OnInit {
    api = inject(ApiService);
    cdr = inject(ChangeDetectorRef);
    torneos: any[] = [];
    canchas: any[] = [];
    equipos: any[] = [];

    // Accordion State
    showScheduleForm = true;
    activeSection: 'upcoming' | 'past' | null = 'upcoming';

    // Match Lists
    upcomingMatches: any[] = [];
    pastMatches: any[] = [];

    // Scheduling Form
    schedule = {
        torneoId: null,
        localId: null,
        visitanteId: null,
        canchaId: null,
        fecha: '',
        hora: '',
        arbitro: '',
        tipo: 'JORNADA',
        jornadaNumero: null
    };

    // Modal Statics
    postponeTarget: any = null;
    postponeData = { fecha: '', hora: '' };

    resultTarget: any = null;
    resultData = { golesLocal: 0, golesVisitante: 0 };
    resultPlayers: { local: any[], visitor: any[] } = { local: [], visitor: [] };
    scorerMap: { [key: number]: number } = {};

    ngOnInit() {
        this.loadInitialData();
    }

    loadInitialData() {
        this.api.get<any[]>('public/torneos').subscribe({
            next: (data) => {
                this.torneos = data;
                this.cdr.detectChanges();
            }
        });
        this.api.get<any[]>('admin/canchas').subscribe({
            next: data => { this.canchas = data; this.cdr.detectChanges(); }
        });
    }

    onTournamentChange() {
        this.upcomingMatches = [];
        this.pastMatches = [];
        if (!this.schedule.torneoId) {
            this.equipos = [];
            return;
        }

        // Load Teams for dropdowns
        this.api.get<any[]>(`public/torneos/${this.schedule.torneoId}/equipos`).subscribe({
            next: data => { this.equipos = data; this.cdr.detectChanges(); }
        });

        // Load All Matches for Accordion
        this.loadMatches();
    }

    loadMatches() {
        if (!this.schedule.torneoId) return;
        this.api.get<any[]>(`admin/torneos/${this.schedule.torneoId}/partidos`).subscribe({
            next: (matches) => {
                const today = new Date().toISOString().split('T')[0];

                this.upcomingMatches = matches.filter(m =>
                    (m.estado === 'PROGRAMADO' && m.fecha >= today) || m.estado === 'POSPUESTO'
                );

                this.pastMatches = matches.filter(m =>
                    m.estado === 'JUGADO' || m.estado === 'CANCELADO' || (m.estado === 'PROGRAMADO' && m.fecha < today)
                );

                // Sort upcoming by date asc
                this.upcomingMatches.sort((a, b) => a.fecha.localeCompare(b.fecha));
                // Sort past by date desc
                this.pastMatches.sort((a, b) => b.fecha.localeCompare(a.fecha));

                this.cdr.detectChanges();
            },
            error: (e) => console.error('Error loading matches', e)
        });
    }

    isValidSchedule() {
        const p = this.schedule;
        const validBasic = p.torneoId && p.localId && p.visitanteId && p.canchaId && p.fecha && p.hora && p.tipo;
        if (p.tipo === 'JORNADA') {
            return validBasic && p.jornadaNumero;
        }
        return validBasic;
    }

    scheduleMatch() {
        if (!this.isValidSchedule()) return;
        const p = this.schedule;

        let tipoFinal = p.tipo;
        if (p.tipo === 'JORNADA' && p.jornadaNumero) {
            tipoFinal = `JORNADA ${p.jornadaNumero}`;
        }

        const params = `torneoId=${p.torneoId}&localId=${p.localId}&visitanteId=${p.visitanteId}&canchaId=${p.canchaId}&fecha=${p.fecha}&hora=${p.hora}&arbitro=${p.arbitro}&tipo=${tipoFinal}`;

        this.api.post(`admin/partidos/programar?${params}`, {}).subscribe({
            next: () => {
                const localName = this.equipos.find(t => t.id == p.localId)?.nombre || 'Local';
                const visitorName = this.equipos.find(t => t.id == p.visitanteId)?.nombre || 'Visitante';
                alert(`Se generó partido de ${localName} vs ${visitorName}`);

                // Keep context (Tournament, Date, Time, Venue, Ref, Type/Jornada)
                // Clear ONLY teams to allow rapid entry of next match in same day/jornada
                this.schedule.localId = null;
                this.schedule.visitanteId = null;

                this.loadMatches();
            },
            error: () => alert('Error al programar')
        });
    }

    // UI Helpers
    toggleScheduleForm() { this.showScheduleForm = !this.showScheduleForm; }
    toggleSection(section: 'upcoming' | 'past') { this.activeSection = this.activeSection === section ? null : section; }
    isOverdue(match: any): boolean {
        const today = new Date().toISOString().split('T')[0];
        return match.fecha < today && match.estado === 'PROGRAMADO';
    }

    getOverdueCount(): number {
        return this.pastMatches ? this.pastMatches.filter(m => this.isOverdue(m)).length : 0;
    }

    // Actions
    deleteMatch(match: any) {
        if (confirm(`¿Estás seguro de eliminar el partido ${match.equipoLocal} vs ${match.equipoVisitante}?`)) {
            this.api.delete(`admin/partidos/${match.id}`).subscribe({
                next: () => { this.loadMatches(); alert('Partido eliminado'); },
                error: () => alert('Error al eliminar')
            });
        }
    }

    cancelMatch(match: any) {
        if (confirm(`¿Cancelar partido ${match.equipoLocal} vs ${match.equipoVisitante}?`)) {
            this.api.post(`admin/partidos/${match.id}/cancelar`, {}).subscribe({
                next: () => { this.loadMatches(); alert('Partido cancelado'); },
                error: () => alert('Error al cancelar')
            });
        }
    }

    openPostpone(match: any) {
        this.postponeTarget = match;
        this.postponeData = { fecha: match.fecha, hora: match.hora };
    }

    confirmPostpone() {
        if (!this.postponeTarget) return;
        const params = `fecha=${this.postponeData.fecha}&hora=${this.postponeData.hora}`;
        this.api.post(`admin/partidos/${this.postponeTarget.id}/posponer?${params}`, {}).subscribe({
            next: () => { this.postponeTarget = null; this.loadMatches(); alert('Partido pospuesto'); },
            error: () => alert('Error al posponer')
        });
    }

    openResultModal(match: any) {
        this.resultTarget = match;
        this.resultData = {
            golesLocal: match.golesLocal || 0,
            golesVisitante: match.golesVisitante || 0
        };
        this.scorerMap = {};
        this.resultPlayers = { local: [], visitor: [] };

        // Fetch Players
        this.api.get<any>(`admin/partidos/${match.id}/jugadores`).subscribe({
            next: (data) => {
                this.resultPlayers.local = data.localPlayers;
                this.resultPlayers.visitor = data.visitorPlayers;
                this.cdr.detectChanges();
            },
            error: (e) => console.error('Error fetching players', e)
        });
    }

    getGoals(playerId: number): number {
        return this.scorerMap[playerId] || 0;
    }

    updateGoal(playerId: number, delta: number) {
        const current = this.scorerMap[playerId] || 0;
        const newVal = current + delta;
        if (newVal >= 0) {
            this.scorerMap[playerId] = newVal;
        }
    }

    confirmResult() {
        if (!this.resultTarget) return;

        const goalsList = Object.keys(this.scorerMap).map(pid => ({
            jugadorId: Number(pid),
            cantidad: this.scorerMap[Number(pid)],
            minuto: 90 // Default/dummy minute
        })).filter(g => g.cantidad > 0);

        const payload = {
            golesLocal: this.resultData.golesLocal,
            golesVisitante: this.resultData.golesVisitante,
            goles: goalsList
        };

        this.api.post(`admin/partidos/${this.resultTarget.id}/resultado`, payload).subscribe({
            next: () => {
                this.resultTarget = null;
                this.loadMatches();
                alert('Resultado guardado');
            },
            error: () => alert('Error al guardar resultado')
        });
    }
}
