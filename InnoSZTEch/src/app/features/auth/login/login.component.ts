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

  submit() {
    if (this.auth.login(this.email, this.password)) {
      this.error = '';
      this.router.navigate(['/home']);
    } else {
      this.error = 'Invalid email or password';
    }
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
