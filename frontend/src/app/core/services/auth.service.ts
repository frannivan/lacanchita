import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenKey = 'auth_token';
    // Use signal for reactive auth state
    isAuthenticated = signal<boolean>(!!localStorage.getItem(this.tokenKey));
    role = signal<string | null>(null); // Simplified, ideally decode token

    constructor(private api: ApiService, private router: Router) {
        // Basic check on init
        if (this.isAuthenticated()) {
            // Decode role if possible or fetch profile. For now, assuming if token exists we are logged in.
        }
    }

    login(credentials: { username: string, password: string }) {
        return this.api.post<{ token: string, role: string }>('auth/login', credentials).pipe(
            tap(response => {
                localStorage.setItem(this.tokenKey, response.token);
                this.isAuthenticated.set(true);
                this.role.set(response.role);
                this.router.navigate(['/admin/dashboard']);
            })
        );
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        this.isAuthenticated.set(false);
        this.role.set(null);
        this.router.navigate(['/admin/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }
}
