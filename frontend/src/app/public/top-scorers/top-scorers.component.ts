import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-top-scorers',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Goleadores</h1>
      
      <div *ngIf="loading" class="text-center">Cargando...</div>
      
      <div class="overflow-x-auto bg-white rounded-lg shadow" *ngIf="!loading && scorers.length > 0">
        <table class="min-w-full divide-y divide-gray-200">
           <thead class="bg-gray-50">
             <tr>
               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jugador</th>
               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
               <th class="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Goles</th>
             </tr>
           </thead>
           <tbody class="bg-white divide-y divide-gray-200">
             <tr *ngFor="let player of scorers; let i = index">
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ i+1 }}</td>
               <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ player.jugador }}</td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ player.equipo }}</td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-emerald-600">{{ player.goles }}</td>
             </tr>
           </tbody>
        </table>
      </div>
      
       <div *ngIf="!loading && scorers.length === 0" class="text-center text-gray-500 py-10">
        No hay datos de goleo disponibles.
      </div>
    </div>
  `
})
export class TopScorersComponent {
    api = inject(ApiService);
    scorers: any[] = [];
    loading = true;

    ngOnInit() {
        // Similar to matches, fetch for first active tournament
        this.api.get<any[]>('public/torneos').subscribe(torneos => {
            if (torneos.length > 0) {
                this.api.get<any[]>(`public/torneos/${torneos[0].id}/goleo`).subscribe({
                    next: (data) => { this.scorers = data; this.loading = false; },
                    error: () => this.loading = false
                });
            } else {
                this.loading = false;
            }
        });
    }
}
