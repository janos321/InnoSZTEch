import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill all fields';
      this.success = '';
      return;
    }

    const registered = this.auth.register(this.name, this.email, this.password);

    if (registered) {
      this.success = 'Registration successful! You can now login.';
      this.error = '';
      setTimeout(() => this.router.navigate(['/login']), 1500);
    } else {
      this.error = 'Email already exists!';
      this.success = '';
    }
  }
goToLogin() {
    this.router.navigate(['/login']);
  }

}
