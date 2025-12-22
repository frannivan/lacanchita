import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-noticias-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Gestión de Noticias</h1>

        <!-- Formulario -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h2 class="text-lg font-bold text-gray-700 mb-4">Publicar Nueva Noticia</h2>
            <div class="grid gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input [(ngModel)]="nuevaNoticia.titulo" class="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Título de la noticia">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Imagen URL (Opcional)</label>
                    <input [(ngModel)]="nuevaNoticia.imagenUrl" class="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://ejemplo.com/imagen.jpg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                    <textarea [(ngModel)]="nuevaNoticia.contenido" rows="4" class="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Escribe el contenido de la noticia..."></textarea>
                </div>
                <div class="flex justify-end">
                    <button (click)="publicar()" [disabled]="!nuevaNoticia.titulo || !nuevaNoticia.contenido" 
                            class="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors">
                        Publicar Noticia
                    </button>
                </div>
            </div>
        </div>

        <!-- Lista -->
        <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 class="font-bold text-gray-700">Noticias Publicadas</h3>
                <span class="text-sm text-gray-500">{{ noticias.length }} noticias</span>
            </div>
            
            <div *ngIf="noticias.length === 0" class="p-8 text-center text-gray-500">
                No hay noticias publicadas.
            </div>

            <div *ngFor="let n of noticias" class="border-b border-gray-100 p-6 hover:bg-gray-50 transition-colors flex justify-between items-start">
                <div class="flex-1 pr-4">
                    <div class="flex items-center mb-1">
                        <span class="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">ID: {{n.id}}</span>
                        <h4 class="text-lg font-bold text-gray-900">{{ n.titulo }}</h4>
                    </div>
                    <p class="text-gray-600 text-sm line-clamp-2 mb-2">{{ n.contenido }}</p>
                    <div class="text-xs text-gray-400">Publicado: {{ n.fechaPublicacion }}</div>
                    <div *ngIf="n.imagenUrl" class="mt-2 text-xs text-blue-500 truncate max-w-md">IMG: {{ n.imagenUrl }}</div>
                </div>
                <button (click)="eliminar(n.id)" class="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors" title="Eliminar noticia">
                    🗑️
                </button>
            </div>
        </div>
    </div>
  `
})
export class NoticiasComponent {
    api = inject(ApiService);
    noticias: any[] = [];
    nuevaNoticia = { titulo: '', contenido: '', imagenUrl: '' };

    ngOnInit() {
        this.cargarNoticias();
    }

    cargarNoticias() {
        // We can reuse public endpoint to list them, or add admin endpoint list. 
        // For admin management, list all is fine.
        this.api.get<any[]>('public/noticias').subscribe(data => this.noticias = data);
    }

    publicar() {
        if (!this.nuevaNoticia.titulo || !this.nuevaNoticia.contenido) return;

        this.api.post('admin/noticias', this.nuevaNoticia).subscribe({
            next: () => {
                this.nuevaNoticia = { titulo: '', contenido: '', imagenUrl: '' };
                this.cargarNoticias();
                alert('Noticia publicada correctamente');
            },
            error: (e) => alert('Error al publicar noticia')
        });
    }

    eliminar(id: number) {
        if (confirm('¿Estás seguro de eliminar esta noticia?')) {
            this.api.delete(`admin/noticias/${id}`).subscribe({
                next: () => this.cargarNoticias(),
                error: (e) => alert('Error al eliminar noticia')
            });
        }
    }
}
