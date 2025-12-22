import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Bandeja de Mensajes</h1>
      
      <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remitente</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asunto</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contenido</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let m of mensajes" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ m.fecha | date:'medium' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                              [class.bg-blue-100]="m.tipo === 'CONTACTO'"
                              [class.text-blue-800]="m.tipo === 'CONTACTO'"
                              [class.bg-yellow-100]="m.tipo === 'QUEJA'"
                              [class.text-yellow-800]="m.tipo === 'QUEJA'"
                              [class.bg-purple-100]="m.tipo === 'SUGERENCIA'"
                              [class.text-purple-800]="m.tipo === 'SUGERENCIA'">
                            {{ m.tipo }}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{ m.nombre }}</div>
                        <div class="text-sm text-gray-500">{{ m.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {{ m.asunto }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 max-w-ws whitespace-normal">
                        {{ m.contenido }}
                    </td>
                </tr>
                <tr *ngIf="mensajes.length === 0">
                    <td colspan="5" class="px-6 py-8 text-center text-gray-500 italic">
                        No hay mensajes recibidos. <br>
                        <span class="text-xs text-gray-400">(Base de datos retornó 0 registros)</span>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  `
})
export class MessagesComponent implements OnInit {
    api = inject(ApiService);
    mensajes: any[] = [];

    ngOnInit() {
        console.log('MessagesComponent: Initializing...');
        this.api.get<any[]>('admin/mensajes').subscribe({
            next: (data) => {
                console.log('MessagesComponent: Data received', data);
                this.mensajes = data;
            },
            error: (err) => {
                console.error('MessagesComponent: Error fetching messages', err);
            }
        });
    }
}
