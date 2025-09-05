import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
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
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const credentials = {
      email: this.email.trim(),
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response: LoginResponse) => {
        this.loading = false;
        
        if (response.ok && response.user) {
          this.success = 'Login successful! Redirecting...';
          
          setTimeout(() => {
            this.router.navigate(['/register']); 
          }, 1000);
        } else {
          this.error = response.error || 'Login failed';
        }
      },
      error: (error) => {
        this.loading = false;
        
        if (error.status === 0) {
          this.error = 'Cannot connect to server. Please try again later.';
        } else if (error.error?.error) {
          this.error = error.error.error;
        } else {
          this.error = 'Login failed. Please try again.';
        }
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}