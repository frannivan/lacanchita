import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SoccerFieldWrapperComponent } from '../../shared/components/soccer-field-wrapper/soccer-field-wrapper.component';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SoccerFieldWrapperComponent],
  template: `
    <app-soccer-field-wrapper title="Torneos Activos">
        <div *ngIf="loading" class="text-center py-20 text-white text-xl animate-pulse">Cargando torneos...</div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let torneo of torneos" class="bg-white/95 backdrop-blur rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300 overflow-hidden border-2 border-white/20 group">
                <!-- Card Header (Simple Green Gradient) -->
                <div class="bg-gradient-to-r from-emerald-600 to-green-600 p-5 relative overflow-hidden">
                        <div class="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-bl-full"></div>
                        <h2 class="text-2xl font-bold text-white mb-1 relative z-10">{{ torneo.nombre }}</h2>
                        <span class="inline-block px-3 py-1 bg-black/20 text-white text-xs font-semibold rounded-full relative z-10 border border-white/20">
                        {{ torneo.categoria }}
                        </span>
                </div>

                <div class="p-6">
                    <div class="flex items-center text-gray-600 mb-6">
                        <span class="text-lg">📅 Inicio: <span class="font-semibold text-gray-800">{{ torneo.fechaInicio }}</span></span>
                    </div>
                    <a [routerLink]="['/torneos', torneo.id]" class="block w-full text-center py-3 px-4 rounded-lg shadow-md text-white bg-gray-900 hover:bg-gray-800 font-bold transition-colors">
                        Ver Detalles
                    </a>
                </div>
            </div>
        </div>
        
        <div *ngIf="!loading && torneos.length === 0" class="text-center py-20 text-white/80 text-lg bg-black/20 rounded-xl backdrop-blur-sm mt-8">
            No hay torneos activos en este momento.
        </div>
    </app-soccer-field-wrapper>
  `
})
export class TournamentListComponent implements OnInit {
  api = inject(ApiService);
  cdr = inject(ChangeDetectorRef);
  torneos: any[] = [];
  loading = true;

  ngOnInit() {
    console.log('TournamentListComponent: Iniciando carga de torneos...');
    console.log('TournamentListComponent: Environment API URL:', this.api.getApiUrl());

    this.api.get<any[]>('public/torneos').subscribe({
      next: (data) => {
        console.log('TournamentListComponent: Datos recibidos:', data);
        this.torneos = data;
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('TournamentListComponent: Error al cargar torneos:', error);
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection even on error
      }
    });
  }
}
