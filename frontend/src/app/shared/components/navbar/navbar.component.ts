import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="bg-emerald-600 text-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <a routerLink="/" class="text-xl font-bold font-mono">⚽ La Canchita</a>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <a routerLink="/" routerLinkActive="bg-emerald-700" [routerLinkActiveOptions]="{exact: true}" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Inicio</a>
                <a routerLink="/partidos/proximos" routerLinkActive="bg-emerald-700" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Próximos Partidos</a>
                <ng-container *ngIf="!auth.isAuthenticated()">
                    <a routerLink="/galeria" routerLinkActive="bg-emerald-700" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Galería</a>
                    <a routerLink="/contacto" routerLinkActive="bg-emerald-700" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Contacto</a>
                </ng-container>
                <!-- Admin Links -->
                <ng-container *ngIf="auth.isAuthenticated()">
                   <a routerLink="/admin/dashboard" routerLinkActive="bg-emerald-700" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Dashboard</a>
                   <a routerLink="/admin/canchas" routerLinkActive="bg-emerald-700" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Canchas</a>
                   <a routerLink="/admin/torneos" routerLinkActive="bg-emerald-700" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Gestión Torneos</a>
                   <a routerLink="/admin/partidos" routerLinkActive="bg-emerald-700" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Gestión Partidos</a>
                   <a routerLink="/admin/noticias" routerLinkActive="bg-emerald-700" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Noticias</a>
                   <a routerLink="/admin/pagos" routerLinkActive="bg-emerald-700" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Pagos</a>
                   <a routerLink="/admin/mensajes" routerLinkActive="bg-emerald-700" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Mensajes</a>
                </ng-container>
              </div>
            </div>
          </div>
          <div>
            <ng-container *ngIf="auth.isAuthenticated(); else loginBtn">
              <button (click)="auth.logout()" class="px-3 py-2 rounded-md text-sm font-medium bg-emerald-800 hover:bg-emerald-900">Salir</button>
            </ng-container>
            <ng-template #loginBtn>
              <a routerLink="/admin/login" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Admin Login</a>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
}
