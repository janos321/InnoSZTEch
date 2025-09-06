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
        return "Only start it when it is completely full, and use a lower temperature program. Cold water washing can save a lot!";
      case 'PC':
        return "Turn it off when not in use, and use energy-saving mode. Modern PCs can also consume a lot of electricity.";
      case 'Tűzhely':
        return "Whenever possible, use a lid on the stovetop, and take advantage of the still-hot pots after cooking.";
      case 'Nyomtató':
        return "Turn it off when not in use, and avoid leaving it on standby.";
      default:
        return "Continuously monitor your consumption, and try to unplug rarely used devices as well.";
    }
  }
}