import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService, House, ElectricDevice } from '../../core/services/house.service';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-house-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './house-details.component.html',
  styleUrls: ['./house-details.component.scss']
})
export class HouseDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  house: House | undefined;
  houseName: string | null = null;
  selectedDevice: string = 'Válassz eszközt';
  currentWattage: number = 0;
  deviceOptions = [
    { name: 'Mosógép', wattage: 2500 },
    { name: 'PC', wattage: 200 },
    { name: 'Nyomtató', wattage: 50 },
    { name: 'Tűzhely', wattage: 2000 }
  ];
  private chart: Chart | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private houseService: HouseService
  ) { }

  ngOnInit(): void {
    this.houseName = this.route.snapshot.paramMap.get('houseName');
    if (this.houseName) {
      this.house = this.houseService.getHouseByName(this.houseName);
      if (this.house) {
        this.currentWattage = this.house.currentWattage;
      }
    }
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  addDevice(): void {
    if (this.selectedDevice && this.selectedDevice !== 'Válassz eszközt' && this.house) {
      const deviceData = this.deviceOptions.find(d => d.name === this.selectedDevice);
      if (deviceData) {
        const newDevice: ElectricDevice = {
          id: Date.now().toString() + Math.random().toString(),
          name: deviceData.name,
          wattage: deviceData.wattage,
          active: false
        };
        this.houseService.addDevice(this.house.name, newDevice);
        this.currentWattage = this.house.currentWattage;
        this.updateChart();
        this.selectedDevice = 'Válassz eszközt';
      }
    }
  }
  
  toggleDevice(device: ElectricDevice): void {
    if (this.house) {
      this.houseService.toggleDevice(this.house.name, device.id);
      this.currentWattage = this.house.currentWattage;
      this.updateChart();
    }
  }

  initializeChart(): void {
    const ctx = document.getElementById('energyChart') as HTMLCanvasElement;
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Saját fogyasztás (W)', 'Európai átlag (W)'],
          datasets: [{
            label: 'Energiafogyasztás',
            data: [this.currentWattage, this.currentWattage * 0.9],
            backgroundColor: ['#4CAF50', '#3498db']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }
  
  updateChart(): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = [this.currentWattage, this.currentWattage * 0.9];
      this.chart.update();
    }
  }
}
