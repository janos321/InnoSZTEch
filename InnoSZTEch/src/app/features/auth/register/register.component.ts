import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, RegisterResponse } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./register.component.scss'] 
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  error: string = '';
  success: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  submit(): void {
    if (!this.email || !this.password) {
      this.error = 'Email and password are required';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.register(this.email.trim(), this.password, this.name.trim() || undefined)
      .subscribe({
        next: (response: RegisterResponse) => {
          this.loading = false;
          
          if (response.ok) {
            this.success = 'Registration successful! Redirecting to login...';
            
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.error = response.error || 'Registration failed';
          }
        },
        error: (error) => {
          this.loading = false;
          
          if (error.status === 0) {
            this.error = 'Cannot connect to server. Please try again later.';
          } else if (error.error?.error) {
            this.error = error.error.error;
          } else {
            this.error = 'Registration failed. Please try again.';
          }
        }
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}