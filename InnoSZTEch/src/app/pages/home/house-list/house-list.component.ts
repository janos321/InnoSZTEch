import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Új import

@Component({
  selector: 'app-house-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.scss']
})
export class HouseListComponent {
  @Input() houses: any[] = [];

  constructor(private router: Router) { } // Injektáljuk a Router-t

  goToDetails(house: any) {
    this.router.navigate(['/house-details', house.name]);
  }
}