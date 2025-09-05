import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-house-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './house-form.component.html',
  styleUrls: ['./house-form.component.scss']
})
export class HouseFormComponent {
  @Output() houseAdded = new EventEmitter<any>();

  houseName: string = '';
  houseAddress: string = '';
   houseArea: number | null = null;

  submit() {
    if (this.houseName && this.houseAddress && this.houseArea) {
      const newHouse = {
        name: this.houseName,
        address: this.houseAddress,
        area: this.houseArea
      };
      this.houseAdded.emit(newHouse);
      this.houseName = '';
      this.houseAddress = '';
      this.houseArea = 0;
    }
  }
}