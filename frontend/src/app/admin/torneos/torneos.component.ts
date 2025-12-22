import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-torneos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Torneos</h1>
        <button (click)="showForm = true" class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">+ Nuevo Torneo</button>
      </div>

      <!-- Form -->
      <div *ngIf="showForm" class="bg-white p-6 rounded-lg mb-6 border border-gray-200 shadow-sm">
        <h3 class="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
            {{ editingId ? 'Editar Torneo' : 'Nuevo Torneo' }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col">
                <label class="text-sm font-semibold text-gray-700 mb-1">Nombre del Torneo</label>
                <input [(ngModel)]="newTorneo.nombre" placeholder="Ej. Torneo Verano 2025" class="p-2 border border-gray-300 rounded focus:border-emerald-500 outline-none">
            </div>
            <div class="flex flex-col">
                <label class="text-sm font-semibold text-gray-700 mb-1">Categoría</label>
                <input [(ngModel)]="newTorneo.categoria" placeholder="Ej. Libre, Varonil" class="p-2 border border-gray-300 rounded focus:border-emerald-500 outline-none">
            </div>
            <div class="flex flex-col">
                <label class="text-sm font-semibold text-gray-700 mb-1">Fecha Inicio</label>
                <input type="date" [(ngModel)]="newTorneo.fechaInicio" class="p-2 border border-gray-300 rounded focus:border-emerald-500 outline-none">
            </div>
            <div class="flex flex-col">
                <label class="text-sm font-semibold text-gray-700 mb-1">Fecha Fin</label>
                <input type="date" [(ngModel)]="newTorneo.fechaFin" class="p-2 border border-gray-300 rounded focus:border-emerald-500 outline-none">
            </div>
        </div>
        <div class="mt-6 flex justify-end space-x-2">
             <button (click)="cancelEdit()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancelar</button>
             <button (click)="saveTorneo()" class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">{{ editingId ? 'Actualizar' : 'Guardar' }}</button>
        </div>
      </div>

      <!-- List -->
      <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let t of torneos">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-bold text-gray-900">{{ t.nombre }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {{ t.categoria }}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                         <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                               [class.bg-green-100]="t.estado === 'ACTIVO'"
                               [class.text-green-800]="t.estado === 'ACTIVO'"
                               [class.bg-yellow-100]="t.estado === 'PROGRAMADO'"
                               [class.text-yellow-800]="t.estado === 'PROGRAMADO'"
                               [class.bg-gray-100]="t.estado === 'FINALIZADO'"
                               [class.text-gray-800]="t.estado === 'FINALIZADO'">
                            {{ t.estado }}
                         </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div><span class="font-bold">Inicio:</span> {{ t.fechaInicio }}</div>
                        <div *ngIf="t.fechaFin"><span class="font-bold">Fin:</span> {{ t.fechaFin }}</div>
                    </td>
                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ t.fechaCreacion || '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button (click)="editTorneo(t)" class="text-indigo-600 hover:text-indigo-900">Editar</button>
                        <button (click)="deleteTorneo(t.id)" class="text-red-600 hover:text-red-900">Eliminar</button>
                    </td>
                </tr>
                <tr *ngIf="torneos.length === 0">
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500 italic">No hay torneos registrados.</td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  `
})
export class TorneosComponent implements OnInit {
  api = inject(ApiService);
  cdr = inject(ChangeDetectorRef);
  torneos: any[] = [];
  showForm = false;
  newTorneo = { nombre: '', categoria: '', fechaInicio: '', fechaFin: '' };
  editingId: number | null = null;

  ngOnInit() {
    this.loadTorneos();
  }

  loadTorneos() {
    this.api.get<any[]>('public/torneos').subscribe(data => {
      this.torneos = data;
      this.cdr.detectChanges();
    });
  }

  saveTorneo() {
    if (this.editingId) {
      this.api.put(`admin/torneos/${this.editingId}`, this.newTorneo).subscribe(() => {
        this.finishSave();
      });
    } else {
      this.api.post('admin/torneos', this.newTorneo).subscribe(() => {
        this.finishSave();
      });
    }
  }

  finishSave() {
    this.loadTorneos();
    this.showForm = false;
    this.newTorneo = { nombre: '', categoria: '', fechaInicio: '', fechaFin: '' };
    this.editingId = null;
  }

  editTorneo(t: any) {
    this.newTorneo = { ...t };
    this.editingId = t.id;
    this.showForm = true;
  }

  deleteTorneo(id: number) {
    if (confirm('¿Estás seguro de eliminar este torneo?')) {
      this.api.delete(`admin/torneos/${id}`).subscribe(() => {
        this.loadTorneos();
      });
    }
  }

  cancelEdit() {
    this.showForm = false;
    this.newTorneo = { nombre: '', categoria: '', fechaInicio: '', fechaFin: '' };
    this.editingId = null;
  }

}
