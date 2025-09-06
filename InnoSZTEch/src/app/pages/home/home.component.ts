import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { HouseListComponent } from './house-list/house-list.component';
import { HouseFormComponent } from './house-form/house-form.component';
import { House, HouseService } from '../../core/services/house.service'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HouseListComponent, HouseFormComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  houses: House[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private houseService: HouseService 
  ) {
    this.houses = this.houseService.getAllHouses();
  }

  onHouseAdded(newHouse: House) {
    this.houseService.addHouse(newHouse);
    this.houses = this.houseService.getAllHouses();
  }

  goToProfil() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}