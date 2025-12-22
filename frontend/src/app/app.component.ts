import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent],
    template: `
    <app-navbar></app-navbar>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-outlet></router-outlet>
    </main>
  `,
    styles: []
})
export class AppComponent {
    title = 'frontend';
}
