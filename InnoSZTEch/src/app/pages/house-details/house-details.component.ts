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
  totalEnergyKWh: number = 0;
  mostConsumingDeviceName: string = 'Nincs adat';

  deviceOptions = [
    { name: 'Mosógép', wattage: 2500 },
    { name: 'PC', wattage: 200 },
    { name: 'Nyomtató', wattage: 50 },
    { name: 'Tűzhely', wattage: 2000 }
  ];

  private chart: any;
  private pieChart: any;
  private wattageUpdateInterval: any;

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
        this.updateMostConsumingDevice();
      }
    }
  }

  ngAfterViewInit(): void {
    this.initializeCharts();
  }

  ngOnDestroy(): void {
    if (this.wattageUpdateInterval) {
      clearInterval(this.wattageUpdateInterval);
    }
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
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
        this.updateCharts();
        this.updateMostConsumingDevice();
        this.selectedDevice = 'Válassz eszközt';
      }
    }
  }

  toggleDevice(device: ElectricDevice): void {
    if (this.house) {
      this.houseService.toggleDevice(this.house.name, device.id);
      this.currentWattage = this.house.currentWattage;
      this.updateCharts();
      this.updateMostConsumingDevice();
    }
  }

  initializeCharts(): void {
    const ctxBar = document.getElementById('energyChart') as HTMLCanvasElement;
    if (ctxBar) {
      this.chart = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: ['Saját fogyasztás (Wh)', 'Európai átlag (W)'],
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

    const ctxPie = document.getElementById('pieChart') as HTMLCanvasElement;
    if (ctxPie) {
      const activeDevices = this.house?.devices.filter(d => d.active) || [];
      const data = activeDevices.map(d => d.wattage);
      const labels = activeDevices.map(d => d.name);

      this.pieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Eszközök fogyasztása',
            data: data,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    this.wattageUpdateInterval = setInterval(() => {
      this.totalEnergyKWh = this.houseService.getTotalEnergyKWh();
      this.updateCharts();
    }, 1000);
  }

  updateCharts(): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = [this.currentWattage, this.currentWattage * 0.9];
      this.chart.update();
    }
    if (this.pieChart && this.house) {
      const activeDevices = this.house.devices.filter(d => d.active);
      const data = activeDevices.map(d => d.wattage);
      const labels = activeDevices.map(d => d.name);

      this.pieChart.data.labels = labels;
      this.pieChart.data.datasets[0].data = data;
      this.pieChart.update();
    }
  }

  private getMostConsumingDevice(): ElectricDevice | undefined {
    if (!this.house || this.house.devices.length === 0) {
      return undefined;
    }
    return this.house.devices.reduce((prev, current) => {
      return (prev.wattage > current.wattage) ? prev : current;
    });
  }

  private updateMostConsumingDevice(): void {
    const mostConsuming = this.getMostConsumingDevice();
    this.mostConsumingDeviceName = mostConsuming ? mostConsuming.name : 'Nincs adat';
  }

  getEnergySavingTips(deviceName: string): string {
    switch (deviceName) {
      case 'Mosógép':
        return 'Csak akkor indítsa el, ha teljesen tele van, és használjon alacsonyabb hőfokú programot. A hidegvizes mosás sokat spórolhat!';
      case 'PC':
        return 'Kapcsolja ki, ha nem használja, és használjon energiatakarékos üzemmódot. A modern PC-k is sok áramot fogyaszthatnak.';
      case 'Tűzhely':
        return 'Lehetőség szerint fedővel használja a főzőlapot, és használja ki a főzés végeztével a még forró edényeket.';
      case 'Nyomtató':
        return 'Kapcsolja ki, ha nem használja, és kerülje a készenléti állapotban hagyást.';
      default:
        return 'Folyamatosan figyelje a fogyasztását, és próbálja meg a ritkán használt eszközöket kikapcsolni a konnektorból is.';
    }
  }
}