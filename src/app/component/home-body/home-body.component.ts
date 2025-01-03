import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule, DatePipe } from '@angular/common';
@Component({
  selector: 'app-home-body',
  standalone: true,
  imports: [FooterComponent, CommonModule],
  templateUrl: './home-body.component.html',
  styleUrl: './home-body.component.css',
  providers: [DatePipe],
})
export class HomeBodyComponent implements OnInit {
  flag: boolean = false;
  constructor(private datePipe: DatePipe) {}

  handleClick() {
    const favouriteList = JSON.parse(localStorage.getItem('favourite') || '[]');
    let tempData = {
      name: this.data.location.name,
      region: this.data.location.region,
      localtime: this.data.location.localtime,
      text: this.data.current.condition.text,
      icon: this.data.current.condition.icon,
      temp_c: this.data.current.temp_c,
    };

    const exists = favouriteList.some(
      (item: any) =>
        item.name === tempData.name &&
        item.region === tempData.region &&
        item.localtime === tempData.localtime
    );

    if (!exists) {
      favouriteList.push(tempData);
      localStorage.setItem('favourite', JSON.stringify(favouriteList));
    }

    this.flag = !this.flag;
  }
  data: any = {};
  currentTemperature: number = 0;
  currentUnit: string = 'C';
  isCelsiusSelected: boolean = true;
  formattedTime: string = '';
  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('weatherData') || '{}');
    this.currentTemperature = this.data.current.temp_c;
    this.formattedTime =
      this.datePipe.transform(
        this.data.location.localtime,
        'EEE, d MMM yyyy h:mm a'
      ) || '';
  }
  setTemperatureInCelsius() {
    // Set the temperature initially in Celsius
    this.currentTemperature = this.data.current.temp_c;
    this.currentUnit = 'C';
  }

  setTemperatureInFahrenheit() {
    // Convert temperature to Fahrenheit
    this.currentTemperature = (this.data.current.temp_c * 9) / 5 + 32;
    this.currentUnit = 'F';
  }

  convertToCelsius() {
    this.isCelsiusSelected = true;
    this.setTemperatureInCelsius();
  }

  convertToFahrenheit() {
    this.isCelsiusSelected = false;
    this.setTemperatureInFahrenheit();
  }
}
