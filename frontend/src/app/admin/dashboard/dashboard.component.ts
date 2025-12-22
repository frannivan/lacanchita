import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="px-4 py-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Dashboard Administrativo</h1>
      
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div class="text-gray-500 text-sm font-medium">Torneos Activos</div>
          <div class="mt-2 text-3xl font-bold text-gray-900">2</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500">
          <div class="text-gray-500 text-sm font-medium">Partidos Hoy</div>
          <div class="mt-2 text-3xl font-bold text-gray-900">5</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div class="text-gray-500 text-sm font-medium">Pagos Pendientes</div>
          <div class="mt-2 text-3xl font-bold text-gray-900">$1,200</div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <h2 class="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a routerLink="/admin/partidos" class="p-4 bg-emerald-600 rounded-lg text-white hover:bg-emerald-700 transition flex items-center justify-center font-medium shadow-md">
          📅 Programar Partido
        </a>
        <a routerLink="/admin/pagos" class="p-4 bg-emerald-600 rounded-lg text-white hover:bg-emerald-700 transition flex items-center justify-center font-medium shadow-md">
          💰 Registrar Pago
        </a>
        <a routerLink="/admin/torneos" class="p-4 bg-emerald-600 rounded-lg text-white hover:bg-emerald-700 transition flex items-center justify-center font-medium shadow-md">
          🏆 Nuevo Torneo
        </a>
        <a routerLink="/admin/equipos" class="p-4 bg-emerald-600 rounded-lg text-white hover:bg-emerald-700 transition flex items-center justify-center font-medium shadow-md">
          👕 Registrar Equipo
        </a>
      </div>
    </div>
  `
})
export class DashboardComponent {
    // In real app, fetch stats from API
}
