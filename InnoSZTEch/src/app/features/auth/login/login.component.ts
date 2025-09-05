import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.auth.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          console.log('Sikeres belépés', res);
          if (res.token) {
            this.auth.saveToken(res.token);
          }
        },
        error: err => console.error('Hiba:', err)
      });
  }
  
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
