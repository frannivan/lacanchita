import { Component, inject, ChangeDetectorRef } from '@angular/core'; // Added ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../core/services/api.service';
import { timeout, finalize } from 'rxjs/operators'; // Added finalize

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <!-- ... template same as before ... -->
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <!-- Hero Header -->
        <div class="bg-gray-900 text-white py-20 relative overflow-hidden">
             <div class="absolute inset-0 bg-gradient-to-r from-gray-900 to-emerald-900 opacity-90"></div>
             <!-- Optional BG Image if available -->
             <div class="container mx-auto px-4 relative z-10 text-center">
                <h1 class="text-4xl md:text-5xl font-black mb-4">DESCUBRE LA CANCHITA</h1>
                <p class="text-xl text-emerald-100 max-w-2xl mx-auto">Más que un complejo deportivo, somos una comunidad apasionada por el fútbol.</p>
             </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-4 py-8 -mt-10 relative z-20 flex-grow">
            <div class="bg-white rounded-xl shadow-xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">
                
                <!-- Sidebar Tabs (Desktop) / Top Tabs (Mobile) -->
                <div class="bg-gray-100 md:w-1/4 flex md:flex-col border-b md:border-b-0 md:border-r border-gray-200">
                    <button (click)="activeTab = 'about'" 
                            [class.bg-white]="activeTab === 'about'" 
                            [class.text-emerald-600]="activeTab === 'about'"
                            [class.border-l-4]="activeTab === 'about'"
                            [class.border-emerald-500]="activeTab === 'about'"
                            class="flex-1 md:flex-none p-6 text-left font-bold text-gray-600 hover:bg-gray-50 transition-all focus:outline-none flex items-center">
                        <span class="mr-3 text-xl">🏢</span> Quiénes Somos
                    </button>
                    <button (click)="activeTab = 'contact'" 
                            [class.bg-white]="activeTab === 'contact'" 
                            [class.text-emerald-600]="activeTab === 'contact'"
                            [class.border-l-4]="activeTab === 'contact'"
                            [class.border-emerald-500]="activeTab === 'contact'"
                            class="flex-1 md:flex-none p-6 text-left font-bold text-gray-600 hover:bg-gray-50 transition-all focus:outline-none flex items-center">
                        <span class="mr-3 text-xl">✉️</span> Contacto
                    </button>
                    <button (click)="activeTab = 'complaints'" 
                            [class.bg-white]="activeTab === 'complaints'" 
                            [class.text-emerald-600]="activeTab === 'complaints'"
                            [class.border-l-4]="activeTab === 'complaints'"
                            [class.border-emerald-500]="activeTab === 'complaints'"
                            class="flex-1 md:flex-none p-6 text-left font-bold text-gray-600 hover:bg-gray-50 transition-all focus:outline-none flex items-center">
                        <span class="mr-3 text-xl">📢</span> Quejas y Sugerencias
                    </button>
                </div>

                <!-- Content Area -->
                <div class="md:w-3/4 p-8 md:p-12">
                    
                    <!-- ABOUT US TAB -->
                    <div *ngIf="activeTab === 'about'" class="space-y-8 animate-fadeIn">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-800 mb-4 border-b pb-2 border-emerald-500 inline-block">Nuestra Historia</h2>
                            <p class="text-gray-600 leading-relaxed text-lg">
                                Fundada en 2020, <strong>La Canchita</strong> nació con el sueño de ofrecer espacios deportivos de calidad mundial para todos. Empezamos con una sola cancha de tierra y hoy contamos con 3 campos profesionales, iluminación LED y vestidores de primera.
                            </p>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-8">
                            <div class="bg-gray-50 p-6 rounded-lg border-l-4 border-emerald-500">
                                <h3 class="text-xl font-bold text-gray-800 mb-2">Misión</h3>
                                <p class="text-gray-600">Promover el deporte y la sana convivencia a través de instalaciones seguras y torneos competitivos que fortalezcan el tejido social.</p>
                            </div>
                            <div class="bg-gray-50 p-6 rounded-lg border-l-4 border-emerald-500">
                                <h3 class="text-xl font-bold text-gray-800 mb-2">Visión</h3>
                                <p class="text-gray-600">Ser el complejo deportivo líder en la región, reconocido por nuestra innovación, calidad de servicio y compromiso con el desarrollo del talento joven.</p>
                            </div>
                        </div>

                        <div>
                             <h3 class="text-xl font-bold text-gray-800 mb-4">Nuestros Valores</h3>
                             <ul class="grid grid-cols-2 gap-4">
                                <li class="flex items-center text-gray-700"><span class="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span>Juego Limpio</li>
                                <li class="flex items-center text-gray-700"><span class="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span>Pasión</li>
                                <li class="flex items-center text-gray-700"><span class="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span>Respeto</li>
                                <li class="flex items-center text-gray-700"><span class="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span>Comunidad</li>
                             </ul>
                        </div>
                    </div>

                    <!-- CONTACT/COMPLAINTS FORM -->
                    <div *ngIf="activeTab === 'contact' || activeTab === 'complaints'" class="animate-fadeIn">
                        <!-- ... header ... -->
                        <div class="mb-8">
                            <h2 class="text-3xl font-bold text-gray-800 mb-2">
                                {{ activeTab === 'contact' ? 'Envíanos un Mensaje' : 'Buzón de Quejas y Sugerencias' }}
                            </h2>
                            <p class="text-gray-500">
                                {{ activeTab === 'contact' ? '¿Tienes dudas sobre torneos o reservaciones? Escríbenos.' : 'Tu opinión nos ayuda a mejorar. Cuéntanos tu experiencia.' }}
                            </p>
                        </div>

                        <form (ngSubmit)="sendMessage()" class="space-y-6 max-w-lg">
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                                    <input [(ngModel)]="formData.nombre" name="nombre" type="text" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Tu nombre">
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                    <input [(ngModel)]="formData.email" name="email" type="email" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="tupost@email.com">
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1">Asunto</label>
                                <input [(ngModel)]="formData.asunto" name="asunto" type="text" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Resumen breve">
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1">Mensaje</label>
                                <textarea [(ngModel)]="formData.contenido" name="contenido" rows="5" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Escribe aquí..."></textarea>
                            </div>
                            <!-- Status Message -->
                            <div *ngIf="statusMessage" class="p-4 rounded-lg text-center font-bold"
                                 [class.bg-green-100]="!isError" [class.text-green-700]="!isError"
                                 [class.bg-red-100]="isError" [class.text-red-700]="isError">
                                {{ statusMessage }}
                            </div>

                            <button type="submit" 
                                    [disabled]="loading"
                                    class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex justify-center items-center">
                                <span *ngIf="!loading">ENVIAR MENSAJE</span>
                                <span *ngIf="loading" class="flex items-center">
                                    <span class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                                    Enviando...
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    styles: [`
    .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ContactComponent {
    activeTab: 'about' | 'contact' | 'complaints' = 'about';
    api = inject(ApiService);
    cdr = inject(ChangeDetectorRef); // Correct injection
    loading = false;
    statusMessage = '';
    isError = false;

    formData = {
        nombre: '',
        email: '',
        asunto: '',
        contenido: ''
    };

    sendMessage() {
        if (!this.formData.nombre || !this.formData.email || !this.formData.contenido) {
            this.statusMessage = 'Por favor completa los campos requeridos.';
            this.isError = true;
            return;
        }

        this.loading = true;
        this.statusMessage = '';
        this.cdr.detectChanges(); // Force update

        let tipo = 'CONTACTO';
        if (this.activeTab === 'complaints') {
            tipo = 'QUEJA';
        }

        const payload = {
            ...this.formData,
            tipo: tipo
        };

        this.api.post('public/contacto', payload)
            .pipe(
                timeout(5000),
                finalize(() => {
                    this.loading = false;
                    this.cdr.detectChanges(); // Force Check on Complete
                })
            )
            .subscribe({
                next: (response) => {
                    console.log('Frontend: Contact success response:', response);
                    this.statusMessage = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo.';
                    this.isError = false;
                    this.formData = { nombre: '', email: '', asunto: '', contenido: '' };
                },
                error: (err) => {
                    console.error('Frontend: Contact error:', err);
                    this.statusMessage = 'Hubo un error al enviar el mensaje. Verifica que el Backend esté corriendo.';
                    this.isError = true;
                }
            });
    }
}
