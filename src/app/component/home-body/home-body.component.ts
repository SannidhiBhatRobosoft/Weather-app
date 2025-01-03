import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedService } from '../../services/shared.service';
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
  constructor(private datePipe: DatePipe, private sharedService: SharedService) {}

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
        item.region === tempData.region 
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
  favorate:boolean=false;
  favlist:any={};
  ngOnInit(): void {
   this.data = JSON.parse(localStorage.getItem('weatherData') || '{}');
  
   this.favlist = JSON.parse(localStorage.getItem('favourite') || '{}');
   this.favorate = this.isFavourite(this.data.location?.name);
  // if(this.favorate){
  //   this.flag=true
  // }
    this.currentTemperature = this.data.current.temp_c;
    this.formattedTime =
      this.datePipe.transform(
        this.data.location.localtime,
        'EEE, d MMM yyyy h:mm a'
      ) || '';

      this.sharedService.currentData.subscribe((data) => {
        
        this.data=data
      });
   
   
  }
  isFavourite(locationName: string): boolean {
   
    return this.favlist.some(
      (fav:any) => {
        fav.location?.name === locationName
        // console.log("checking");
        // console.log(fav.location.name);
        // console.log(locationName);
      }
    );
  }
  setTemperatureInCelsius() {
    // Set the temperature initially in Celsius
    this.currentTemperature = this.data.current.temp_c;
    this.currentUnit = 'C';
  }

  setTemperatureInFahrenheit() {
    // Convert temperature to Fahrenheit
    this.currentTemperature = parseFloat(((this.data.current.temp_c * 9) / 5 + 32).toFixed(2));

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
