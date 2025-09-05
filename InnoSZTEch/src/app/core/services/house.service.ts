import { Injectable } from '@angular/core';

export interface ElectricDevice {
  id: string; 
  name: string;
  wattage: number;
  active: boolean;
}

export interface House {
  area: number;
  address: string;
  name: string;
  currentWattage: number;
  devices: ElectricDevice[];
}

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private houses: House[] = [
    { area: 120, address: 'Kossuth Lajos utca 1.', name: 'Családi ház', currentWattage: 0, devices: [] }
  ];

  totalEnergyKWh: number = 0;
  private intervalId: any;

  constructor() {
    this.startEnergyCounter();
  }

  getAllHouses(): House[] {
    return this.houses;
  }

  getHouseByName(name: string): House | undefined {
    return this.houses.find(house => house.name === name);
  }

  addHouse(newHouse: House) {
    this.houses.push({ ...newHouse, currentWattage: 0, devices: [] });
  }

  addDevice(houseName: string, device: ElectricDevice) {
    const house = this.getHouseByName(houseName);
    if (house) {
      house.devices.push(device);
      this.updateHouseWattage(house);
    }
  }

  toggleDevice(houseName: string, deviceId: string) {
    const house = this.getHouseByName(houseName);
    if (house) {
      const device = house.devices.find(d => d.id === deviceId);
      if (device) {
        device.active = !device.active;
        this.updateHouseWattage(house);
      }
    }
  }

  private updateHouseWattage(house: House) {
    house.currentWattage = house.devices.reduce((total, device) => {
      return total + (device.active ? device.wattage : 0);
    }, 0);
  }

  private startEnergyCounter() {
    const intervalSeconds = 1;
    this.intervalId = setInterval(() => {
      this.houses.forEach(house => {
        house.devices.forEach(device => {
          if (device.active) {
            const kWh = (device.wattage * intervalSeconds) / (1000 * 3600);
            this.totalEnergyKWh += kWh;
          }
        });
      });
    }, intervalSeconds * 1000);
  }

  getTotalEnergyKWh(): number {
    return this.totalEnergyKWh;
  }
}