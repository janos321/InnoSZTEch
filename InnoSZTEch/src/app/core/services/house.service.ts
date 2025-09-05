import { Injectable } from '@angular/core';

export interface House {
  area: number;
  address: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private houses: House[] = [
    { area: 120, address: 'Kossuth Lajos utca 1.', name: 'Családi ház' }
  ];

  constructor() { }

  getAllHouses(): House[] {
    return this.houses;
  }

  getHouseByName(name: string): House | undefined {
    return this.houses.find(house => house.name === name);
  }

  addHouse(newHouse: House) {
    this.houses.push(newHouse);
  }
}