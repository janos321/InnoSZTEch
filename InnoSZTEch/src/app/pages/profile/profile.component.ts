import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: User | null = null;

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getCurrentUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  goToFooldal() {
    this.router.navigate(['/home']);
  }
}
