import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { SoccerFieldWrapperComponent } from '../../shared/components/soccer-field-wrapper/soccer-field-wrapper.component';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule, SoccerFieldWrapperComponent],
  template: `
    <app-soccer-field-wrapper title="Gestión de Pagos">
      
      <!-- Top Actions -->
      <div class="flex justify-end mb-6">
          <button (click)="showForm = !showForm" 
                  class="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-lg shadow-lg hover:from-emerald-500 hover:to-emerald-400 border border-white/20 transform hover:-translate-y-0.5 transition-all">
             {{ showForm ? 'Ocultar Formulario' : '+ Nuevo Pago' }}
          </button>
      </div>
      
      <!-- Register Form (Glassmorphism) -->
      <div *ngIf="showForm" class="mb-8 p-6 bg-white/95 backdrop-blur rounded-xl shadow-2xl border border-white/20 animate-fade-in-down">
        <h3 class="font-bold text-xl mb-6 text-emerald-800 border-b border-emerald-100 pb-2">Registrar Nuevo Pago</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Equipo</label>
                <select [(ngModel)]="payment.equipoId" class="w-full p-3 rounded-lg border border-emerald-200 bg-emerald-50 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-700">
                    <option [ngValue]="null" disabled>Seleccione un equipo</option>
                    <option *ngFor="let e of equipos" [value]="e.id">{{ e.nombre }}</option>
                </select>
             </div>
             <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Monto ($)</label>
                <input [(ngModel)]="payment.monto" type="number" placeholder="0.00" class="w-full p-3 rounded-lg border border-emerald-200 bg-emerald-50 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-700">
             </div>
             <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Concepto</label>
                <input [(ngModel)]="payment.descripcion" placeholder="Ej: Inscripción" class="w-full p-3 rounded-lg border border-emerald-200 bg-emerald-50 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-700">
             </div>
        </div>
        <div class="mt-6 flex justify-end">
             <button (click)="registerPayment()" 
                     [disabled]="!payment.equipoId || !payment.monto"
                     [class.opacity-50]="!payment.equipoId || !payment.monto"
                     class="px-8 py-3 bg-emerald-800 text-white rounded-lg font-bold shadow hover:bg-emerald-700 transition-colors uppercase tracking-wide">
                 Registrar Pago
             </button>
        </div>
      </div>

      <!-- Payments Table (Glassmorphism) -->
      <div class="overflow-hidden rounded-xl shadow-2xl border border-white/20">
        <table class="w-full bg-white/95 backdrop-blur">
            <thead class="bg-gradient-to-r from-emerald-900 to-emerald-700 text-white">
                <tr>
                    <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">ID</th>
                    <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Equipo</th>
                    <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Monto</th>
                    <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Concepto</th>
                    <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Fecha Pago</th>
                    <th class="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider w-24">
                         Acciones
                    </th>
                </tr>
                <!-- Inline Filters Row (Integrated) -->
                <tr class="bg-emerald-800/50">
                    <td class="px-6 py-2"></td>
                    <td class="px-6 py-2">
                         <input type="text" [(ngModel)]="filters.equipo" (ngModelChange)="applyFilters()" 
                                placeholder="Filtrar Equipo..." 
                                class="w-full h-8 px-2 rounded bg-white/90 border-none text-xs text-gray-800 font-bold placeholder-gray-400 focus:ring-2 focus:ring-emerald-400">
                    </td>
                    <td class="px-6 py-2"></td>
                    <td class="px-6 py-2">
                         <input type="text" [(ngModel)]="filters.concepto" (ngModelChange)="applyFilters()" 
                                placeholder="Filtrar Concepto..." 
                                class="w-full h-8 px-2 rounded bg-white/90 border-none text-xs text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-emerald-400">
                    </td>
                    <td class="px-6 py-2">
                         <input type="date" [(ngModel)]="filters.fecha" (ngModelChange)="applyFilters()" 
                                class="w-full h-8 px-2 rounded bg-white/90 border-none text-xs text-gray-800 font-bold focus:ring-2 focus:ring-emerald-400">
                    </td>
                    <td class="px-6 py-2 text-center">
                        <button (click)="clearFilters()" *ngIf="filters.equipo || filters.fecha || filters.concepto"
                                class="w-8 h-8 flex items-center justify-center bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors mx-auto" title="Limpiar Filtros">
                            ✕
                        </button>
                    </td>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                <tr *ngFor="let p of filteredPagos" class="hover:bg-emerald-50/50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{{ p.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-bold text-gray-800">{{ p.equipoNombre || 'Equipo ' + (p.equipoId || '-') }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            $ {{ p.monto }}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {{ p.descripcion }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {{ p.fechaPago }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <!-- Placeholder for future actions -->
                        <span class="text-xs text-gray-400">--</span>
                    </td>
                </tr>
                <tr *ngIf="filteredPagos.length === 0">
                    <td colspan="6" class="px-6 py-12 text-center text-gray-500 italic bg-gray-50/50">
                        No se encontraron pagos con los filtros seleccionados.
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </app-soccer-field-wrapper>
  `
})
export class PagosComponent implements OnInit {
  api = inject(ApiService);
  cdr = inject(ChangeDetectorRef);

  // Data Source
  allPagos: any[] = [];
  filteredPagos: any[] = [];
  equipos: any[] = [];

  // UI State
  showForm = false;
  payment: { equipoId: number | null; monto: number | null; descripcion: string } = {
    equipoId: null,
    monto: null,
    descripcion: ''
  };

  // Filters State
  filters = {
    equipo: '',
    fecha: '',
    concepto: ''
  };

  ngOnInit() {
    this.loadPagos();
    this.loadEquipos();
  }

  loadPagos() {
    this.api.get<any[]>('admin/pagos').subscribe(data => {
      this.allPagos = data;
      // Sort by Date Descending
      this.allPagos.sort((a, b) => b.id - a.id);
      this.applyFilters(); // Initial filter apply
    });
  }

  loadEquipos() {
    this.api.get<any[]>('admin/equipos').subscribe(data => {
      this.equipos = data;
      this.cdr.detectChanges();
    });
  }

  applyFilters() {
    this.filteredPagos = this.allPagos.filter(p => {
      // 1. Team Filter (Text Search on Team Name)
      const teamName = p.equipoNombre ? p.equipoNombre.toLowerCase() : '';
      const filterTeam = this.filters.equipo ? this.filters.equipo.toLowerCase() : '';
      const matchTeam = !filterTeam || teamName.includes(filterTeam);

      // 2. Date Filter (Exact Match YYYY-MM-DD)
      const date = p.fechaPago ? p.fechaPago.toString() : '';
      const matchDate = !this.filters.fecha || date === this.filters.fecha;

      // 3. Concept Filter (Text Search)
      const concept = p.descripcion ? p.descripcion.toLowerCase() : '';
      const filterConcept = this.filters.concepto ? this.filters.concepto.toLowerCase() : '';
      const matchConcept = !filterConcept || concept.includes(filterConcept);

      return matchTeam && matchDate && matchConcept;
    });
    this.cdr.detectChanges();
  }

  clearFilters() {
    this.filters = { equipo: '', fecha: '', concepto: '' };
    this.applyFilters();
  }

  registerPayment() {
    if (!this.payment.equipoId || !this.payment.monto) return;

    // Explicit check to satisfy TypeScript and runtime safety
    const montoVal = this.payment.monto;
    const descVal = this.payment.descripcion || '';

    // Create query string safely
    const queryString = `monto=${montoVal}&descripcion=${encodeURIComponent(descVal)}`;

    this.api.post(`admin/equipos/${this.payment.equipoId}/pagos?${queryString}`, {})
      .subscribe({
        next: () => {
          alert('Pago registrado correctamente');
          this.payment = { equipoId: null, monto: null, descripcion: '' };
          this.loadPagos();
          // cdr called inside loadPagos -> applyFilters
        },
        error: (err: any) => {
          console.error('Error registrando pago:', err);
          const msg = err.error ? (err.error.message || JSON.stringify(err.error)) : err.message;
          alert('Error al registrar el pago: ' + msg);
        }
      });
  }
}
