import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-canchas',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Canchas</h1>
        <button (click)="showForm = true" class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">+ Nueva Cancha</button>
      </div>

      <!-- Create Form -->
      <div *ngIf="showForm" class="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <h3 class="font-bold text-lg mb-4">{{ editingId ? 'Editar Cancha' : 'Registrar Cancha' }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input [(ngModel)]="newCancha.nombre" placeholder="Nombre" class="p-2 border rounded">
            <input [(ngModel)]="newCancha.ubicacion" placeholder="Ubicación" class="p-2 border rounded">
        </div>
        <div class="mt-4 flex space-x-2">
            <button (click)="saveCancha()" class="px-4 py-2 bg-emerald-600 text-white rounded">{{ editingId ? 'Actualizar' : 'Guardar' }}</button>
            <button (click)="cancelEdit()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancelar</button>
        </div>
      </div>

      <!-- List -->
      <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let cancha of canchas">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-bold text-gray-900">{{ cancha.nombre }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ cancha.ubicacion }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                         <span [class]="cancha.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                               class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                            {{ cancha.activa ? 'Activa' : 'Inactiva' }}
                         </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {{ cancha.fechaCreacion || '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button (click)="editCancha(cancha)" class="text-indigo-600 hover:text-indigo-900">Editar</button>
                        <button (click)="deleteCancha(cancha.id)" class="text-red-600 hover:text-red-900">Eliminar</button>
                    </td>
                </tr>
                <tr *ngIf="canchas.length === 0">
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500 italic">No hay canchas registradas.</td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  `
})
export class CanchasComponent implements OnInit {
    api = inject(ApiService);
    cdr = inject(ChangeDetectorRef);
    canchas: any[] = [];
    showForm = false;
    newCancha = { nombre: '', ubicacion: '' };
    editingId: number | null = null;

    ngOnInit() {
        this.loadCanchas();
    }

    loadCanchas() {
        this.api.get<any[]>('admin/canchas').subscribe(data => {
            this.canchas = data;
            this.cdr.detectChanges();
        });
    }

    saveCancha() {
        if (this.editingId) {
            this.api.put(`admin/canchas/${this.editingId}`, this.newCancha).subscribe(() => {
                this.loadCanchas();
                this.cancelEdit();
            });
        } else {
            this.api.post('admin/canchas', this.newCancha).subscribe(() => {
                this.loadCanchas();
                this.cancelEdit();
            });
        }
    }

    editCancha(cancha: any) {
        this.newCancha = { ...cancha };
        this.editingId = cancha.id;
        this.showForm = true;
    }

    cancelEdit() {
        this.showForm = false;
        this.newCancha = { nombre: '', ubicacion: '' };
        this.editingId = null;
    }

    deleteCancha(id: number) {
        if (confirm('¿Eliminar cancha?')) {
            this.api.delete(`admin/canchas/${id}`).subscribe(() => {
                this.loadCanchas();
            });
        }
    }

}
