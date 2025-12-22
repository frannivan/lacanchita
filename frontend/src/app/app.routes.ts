import { Routes } from '@angular/router';
import { TournamentListComponent } from './public/tournament-list/tournament-list.component';
import { TournamentDetailComponent } from './public/tournament-detail/tournament-detail.component';
import { UpcomingMatchesComponent } from './public/upcoming-matches/upcoming-matches.component';
import { LoginComponent } from './admin/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CanchasComponent } from './admin/canchas/canchas.component';
import { TorneosComponent } from './admin/torneos/torneos.component';
import { EquiposComponent } from './admin/equipos/equipos.component';
import { PartidosComponent } from './admin/partidos/partidos.component';
import { PagosComponent } from './admin/pagos/pagos.component';
import { NoticiasComponent } from './admin/noticias/noticias.component';
import { HomeComponent } from './public/home/home.component';
import { GalleryComponent } from './public/gallery/gallery.component';
import { authGuard } from './core/guards/auth.guard';
import { ContactComponent } from './public/contact/contact.component';
import { MessagesComponent } from './admin/messages/messages.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', redirectTo: '/', pathMatch: 'full' },
    { path: 'contacto', component: ContactComponent }, // New Public Route

    // Public Routes
    { path: 'torneos', component: TournamentListComponent },
    { path: 'torneos/:id', component: TournamentDetailComponent },
    { path: 'partidos/proximos', component: UpcomingMatchesComponent },
    { path: 'partido/:id', loadComponent: () => import('./public/match-detail/match-detail.component').then(m => m.MatchDetailComponent) },
    { path: 'galeria', component: GalleryComponent },

    // Admin Routes
    { path: 'admin/login', component: LoginComponent },
    {
        path: 'admin',
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'canchas', component: CanchasComponent },
            { path: 'torneos', component: TorneosComponent },
            { path: 'equipos', component: EquiposComponent },
            { path: 'partidos', component: PartidosComponent },
            { path: 'pagos', component: PagosComponent },
            { path: 'noticias', component: NoticiasComponent },
            { path: 'mensajes', component: MessagesComponent }, // New Admin Route
        ]
    }
];
