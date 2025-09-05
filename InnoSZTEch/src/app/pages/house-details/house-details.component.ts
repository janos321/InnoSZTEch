import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService, House } from '../../core/services/house.service'; // Add this import

@Component({
  selector: 'app-house-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './house-details.component.html',
  styleUrls: ['./house-details.component.scss']
})
export class HouseDetailsComponent implements OnInit {
  house: House | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router for navigation
    private houseService: HouseService // Inject the new service
  ) { }

  ngOnInit(): void {
    const houseName = this.route.snapshot.paramMap.get('houseName');
    if (houseName) {
      this.house = this.houseService.getHouseByName(houseName);
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}