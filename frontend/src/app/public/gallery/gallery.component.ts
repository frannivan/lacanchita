import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoccerFieldWrapperComponent } from '../../shared/components/soccer-field-wrapper/soccer-field-wrapper.component';

@Component({
    selector: 'app-gallery',
    standalone: true,
    imports: [CommonModule, SoccerFieldWrapperComponent],
    template: `
    <app-soccer-field-wrapper title="Galería de Momentos">
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Loop through photos -->
            <div *ngFor="let photo of photos" class="group relative overflow-hidden rounded-xl shadow-xl bg-white aspect-[4/3] cursor-pointer">
                <img [src]="photo.url" [alt]="photo.title" 
                     class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                
                <!-- Overlay on hover -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span class="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-1">{{ photo.category }}</span>
                    <h3 class="text-white text-xl font-bold">{{ photo.title }}</h3>
                </div>
            </div>
        </div>

        <div class="mt-12 text-center">
            <p class="text-white/80 text-lg">¿Tienes fotos de los partidos? ¡Compártelas con nosotros!</p>
            <button class="mt-4 px-6 py-3 bg-white text-emerald-800 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                Enviar mis fotos
            </button>
        </div>

    </app-soccer-field-wrapper>
  `
})
export class GalleryComponent {
    photos = [
        {
            url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop',
            title: 'Gran Final 2024',
            category: 'Partidos'
        },
        {
            url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1000&auto=format&fit=crop',
            title: 'Nuestras Familias en la Grada',
            category: 'Familias'
        },
        {
            url: 'images/goal.png',
            title: 'Gol de la Victoria',
            category: 'Destacados'
        },
        {
            url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1000&auto=format&fit=crop',
            title: 'Pequeños Campeones',
            category: 'Infantil'
        },
        {
            url: 'images/passion.png',
            title: 'Pasión en la Cancha',
            category: 'Torneo'
        },
        {
            url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000&auto=format&fit=crop',
            title: 'Celebración en Equipo',
            category: 'Momentos'
        }
    ];
}