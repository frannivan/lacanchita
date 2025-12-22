import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-soccer-field-wrapper',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="relative min-h-screen bg-green-600 overflow-hidden font-sans">
        <!-- PITCH MARKS CONTAINER -->
        <div class="absolute inset-0 pointer-events-none opacity-40">
            <!-- Grass Stripes -->
            <div class="absolute inset-0" 
                 style="background: repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.05) 40px, rgba(0,0,0,0.05) 80px);">
            </div>
            
            <!-- Side Lines (Border) -->
            <div class="absolute inset-4 border-2 border-white/70 rounded-lg"></div>
            
            <!-- Center Line -->
            <div class="absolute top-1/2 left-4 right-4 h-0.5 bg-white/70 transform -translate-y-1/2"></div>
            
            <!-- Center Circle -->
            <div class="absolute top-1/2 left-1/2 w-48 h-48 border-2 border-white/70 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div class="w-2 h-2 bg-white/70 rounded-full"></div>
            </div>

            <!-- Top Penalty Area -->
            <div class="absolute top-4 left-1/2 transform -translate-x-1/2 w-1/3 h-48 border-l-2 border-r-2 border-b-2 border-white/70 rounded-b-lg"></div>
            <!-- Top Goal Area -->
            <div class="absolute top-4 left-1/2 transform -translate-x-1/2 w-1/6 h-20 border-l-2 border-r-2 border-b-2 border-white/70 rounded-b-lg"></div>

            <!-- Bottom Penalty Area -->
            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1/3 h-48 border-l-2 border-r-2 border-t-2 border-white/70 rounded-t-lg"></div>
             <!-- Bottom Goal Area -->
            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1/6 h-20 border-l-2 border-r-2 border-t-2 border-white/70 rounded-t-lg"></div>
            
            <!-- Corner Arcs -->
            <div class="absolute top-4 left-4 w-12 h-12 border-b-2 border-r-2 border-white/70 rounded-br-full"></div>
            <div class="absolute top-4 right-4 w-12 h-12 border-b-2 border-l-2 border-white/70 rounded-bl-full"></div>
            <div class="absolute bottom-4 left-4 w-12 h-12 border-t-2 border-r-2 border-white/70 rounded-tr-full"></div>
            <div class="absolute bottom-4 right-4 w-12 h-12 border-t-2 border-l-2 border-white/70 rounded-tl-full"></div>
        </div>

        <div class="relative z-10 px-4 py-8 container mx-auto">
            <h1 *ngIf="title" class="text-5xl font-black text-white mb-10 text-center uppercase tracking-tighter drop-shadow-lg" 
                style="text-shadow: 2px 2px 0px #000;">
                {{ title }}
            </h1>
            
            <ng-content></ng-content>
        </div>
    </div>
  `
})
export class SoccerFieldWrapperComponent {
    @Input() title: string = '';
}
