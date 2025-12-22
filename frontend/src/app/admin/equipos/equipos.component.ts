import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-equipos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="px-4 py-6">
       <h1 class="text-2xl font-bold text-gray-800 mb-6">Equipos y Jugadores</h1>
       
       <!-- Simple MVP: Select Torneo -> Create Team / View Teams -> Add Player -->
       <div class="mb-6">
         <label class="block text-sm font-medium text-gray-700">Seleccionar Torneo</label>
         <select [(ngModel)]="selectedTorneoId" (change)="onTorneoChange()" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white border">
            <option [ngValue]="null">-- Selecciona --</option>
            <option *ngFor="let t of torneos" [value]="t.id">{{t.nombre}}</option>
         </select>
       </div>

       <div *ngIf="selectedTorneoId">
         <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Equipos</h2>
            <button (click)="showTeamForm = true" class="px-3 py-1 bg-emerald-600 text-white rounded text-sm">+ Nuevo Equipo</button>
         </div>
         
         <!-- New Team Form -->
         <div *ngIf="showTeamForm" class="bg-gray-50 p-4 rounded mb-4">
            <input [(ngModel)]="newTeam.nombre" placeholder="Nombre Equipo" class="mr-2 p-1 border rounded">
            <input [(ngModel)]="newTeam.directorTecnico" placeholder="Director Técnico" class="mr-2 p-1 border rounded">
            <button (click)="saveTeam()" class="bg-emerald-600 text-white px-3 py-1 rounded">Guardar</button>
         </div>

         <!-- Teams List -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div *ngFor="let team of teams" class="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-lg">{{ team.nombre }}</h3>
                    <p class="text-sm text-gray-500">DT: {{ team.directorTecnico || 'N/A' }}</p>
                </div>
                <button (click)="selectTeam(team)" class="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
                   Ver / Gestionar Plantilla
                </button>
            </div>
          </div>
       </div>
       
       <!-- Player Modal/Form -->
       <div *ngIf="showPlayerForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-xl">Plantilla: {{selectedTeamForPlayer?.nombre}}</h3>
                <button (click)="showPlayerForm = false" class="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <!-- Existing Players List -->
            <div class="mb-6">
                <h4 class="font-bold text-sm text-gray-600 uppercase mb-2">Jugadores Registrados</h4>
                <ul class="divide-y divide-gray-100">
                    <li *ngFor="let p of selectedTeamForPlayer?.players" class="py-2 flex justify-between items-center">
                        <span class="font-medium">#{{p.numero}} {{p.nombre}} <span class="text-xs text-gray-500">({{p.posicion}})</span></span>
                        <button (click)="deletePlayer(p.id)" class="text-red-500 hover:text-red-700 text-xs">Eliminar</button>
                    </li>
                    <li *ngIf="!selectedTeamForPlayer?.players?.length" class="text-gray-400 italic text-sm">Sin jugadores registrados.</li>
                </ul>
            </div>

            <div class="border-t pt-4">
                <h4 class="font-bold text-sm text-gray-600 uppercase mb-2">Agregar Nuevo Jugador</h4>
                <div class="space-y-3">
                    <input [(ngModel)]="newPlayer.nombre" placeholder="Nombre Completo" class="w-full p-2 border rounded">
                    <div class="flex space-x-2">
                        <input [(ngModel)]="newPlayer.numero" type="number" placeholder="Número (#)" class="w-1/3 p-2 border rounded">
                        <input [(ngModel)]="newPlayer.posicion" placeholder="Posición (Delantero, Portero...)" class="w-2/3 p-2 border rounded">
                    </div>
                </div>
                <div class="mt-4 flex justify-end space-x-2">
                    <button (click)="savePlayer()" class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Guardar Jugador</button>
                    <button (click)="showPlayerForm = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cerrar</button>
                </div>
            </div>
          </div>
       </div>

    </div>
  `
})
export class EquiposComponent implements OnInit {
    api = inject(ApiService);
    cdr = inject(ChangeDetectorRef);
    torneos: any[] = [];
    selectedTorneoId: number | null = null;

    teams: any[] = [];

    showTeamForm = false;
    newTeam = { nombre: '', directorTecnico: '' };

    showPlayerForm = false;
    selectedTeamForPlayer: any = null;
    newPlayer = { nombre: '', numero: null, posicion: '' };

    ngOnInit() {
        this.api.get<any[]>('public/torneos').subscribe(data => {
            this.torneos = data;
            this.cdr.detectChanges();
        });
    }

    onTorneoChange() {
        if (!this.selectedTorneoId) {
            this.teams = [];
            return;
        }
        // Admin reuse public endpoint for convenience (or create admin endpoint if security requires)
        this.api.get<any[]>(`public/torneos/${this.selectedTorneoId}/equipos`).subscribe(data => {
            this.teams = data.map(t => ({ ...t, players: [] })); // Init players array
            this.cdr.detectChanges();
        });
    }

    saveTeam() {
        if (!this.selectedTorneoId) return;
        const params = { nombre: this.newTeam.nombre, directorTecnico: this.newTeam.directorTecnico };
        this.api.post(`admin/torneos/${this.selectedTorneoId}/equipos?nombre=${this.newTeam.nombre}&directorTecnico=${this.newTeam.directorTecnico}`, {}).subscribe((res: any) => {
            this.teams.push({ ...res, players: [] });
            this.showTeamForm = false;
            this.newTeam = { nombre: '', directorTecnico: '' };
            this.cdr.detectChanges();
        });
    }

    selectTeam(team: any) {
        this.selectedTeamForPlayer = team;
        this.showPlayerForm = true;
        // Load Real Players
        this.api.get<any[]>(`admin/equipos/${team.id}/jugadores`).subscribe(players => {
            this.selectedTeamForPlayer.players = players;
            this.cdr.detectChanges();
        });
    }

    savePlayer() {
        if (!this.selectedTeamForPlayer) return;
        const params = `nombre=${this.newPlayer.nombre}&numero=${this.newPlayer.numero}&posicion=${this.newPlayer.posicion}`;
        // Note: Backend endpoint expects Query Params based on my Controller implementation
        this.api.post(`admin/equipos/${this.selectedTeamForPlayer.id}/jugadores?${params}`, {}).subscribe(res => {
            if (!this.selectedTeamForPlayer.players) this.selectedTeamForPlayer.players = [];
            this.selectedTeamForPlayer.players.push(res);
            this.showPlayerForm = false;
            this.newPlayer = { nombre: '', numero: null, posicion: '' };
            this.cdr.detectChanges();
        });
    }

    deletePlayer(playerId: number) {
        if (confirm('¿Eliminar jugador?')) {
            this.api.delete(`admin/jugadores/${playerId}`).subscribe(() => {
                this.selectedTeamForPlayer.players = this.selectedTeamForPlayer.players.filter((p: any) => p.id !== playerId);
                this.cdr.detectChanges();
            });
        }
    }
}
