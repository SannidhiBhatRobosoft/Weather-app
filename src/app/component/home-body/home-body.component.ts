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
  constructor(
    private datePipe: DatePipe,
    private sharedService: SharedService
  ) {}

  handleClick() {
    const favouriteList = JSON.parse(localStorage.getItem('favourite') || '[]');
    const recentList = JSON.parse(localStorage.getItem('recentSearch') || '[]');
    let tempData = {
      name: this.data.location.name,
      region: this.data.location.region,
      localtime: this.data.location.localtime,
      text: this.data.current.condition.text,
      icon: this.data.current.condition.icon,
      temp_c: this.data.current.temp_c,
      flag: this.data.flag ? false : true,
    };

    // Check if the location already exists in the list
    const favexistsIndex = favouriteList.findIndex(
      (item: any) =>
        item.name === tempData.name && item.region === tempData.region
    );
    const recexistsIndex = recentList.findIndex(
      (item: any) =>
        item.name === tempData.name && item.region === tempData.region
    );

    if (favexistsIndex !== -1) {
      favouriteList.splice(favexistsIndex, 1);
    } else {
      favouriteList.push(tempData);
    }
    if(recexistsIndex!==-1){
      recentList[recexistsIndex].flag=!recentList[recexistsIndex].flag;
    }

    localStorage.setItem('favourite', JSON.stringify(favouriteList));
    localStorage.setItem('recentSearch', JSON.stringify(recentList));

    this.data.flag = !this.data.flag;
    localStorage.setItem('weatherData', JSON.stringify(this.data)); 
  }

  data: any = {};
  currentTemperature: number = 0;
  currentUnit: string = 'C';
  isCelsiusSelected: boolean = true;
  formattedTime: string = '';

  favlist: any = {};
  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('weatherData') || '{}');
    let s = this.data.location?.name;
    this.favlist = JSON.parse(localStorage.getItem('favourite') || '[]');
    let isPresent = this.favlist.some((favItem: any) => favItem.name === s);

    if (isPresent) this.flag = true;

    this.currentTemperature = this.data.current.temp_c;
    this.formattedTime =
      this.datePipe.transform(
        this.data.location.localtime,
        'EEE, d MMM yyyy h:mm a'
      ) || '';

    this.sharedService.currentData.subscribe((data) => {
      this.data = data;
      let s = this.data.location?.name;
      this.favlist = JSON.parse(localStorage.getItem('favourite') || '[]');
      let isPresent = this.favlist.some((favItem: any) => favItem.name === s);
      if (isPresent) this.flag = true;
    });
  }
  isDataInFavlist(): boolean {
    return this.favlist.some(
      (favItem: any) => favItem.location?.name === this.data.location?.name
    );
  }
  setTemperatureInCelsius() {
   
    this.currentTemperature = this.data.current.temp_c;
    
    this.currentUnit = 'C';
  }

  setTemperatureInFahrenheit() {
    // Convert temperature to Fahrenheit
    this.currentTemperature = parseFloat(
      ((this.data.current.temp_c * 9) / 5 + 32).toFixed(1)
    );

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
