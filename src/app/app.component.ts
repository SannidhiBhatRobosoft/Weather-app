import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './component/header/header.component';
import { HomeTopComponent } from './component/home-top/home-top.component';
import { HomeBodyComponent } from './component/home-body/home-body.component';
import { FooterComponent } from './component/footer/footer.component';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HomeTopComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @Output() weatherUpdated: EventEmitter<string> = new EventEmitter<string>();
  title = 'weather-app';
  data: any = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) {}

  private apiUrl = 'https://weatherapi-com.p.rapidapi.com/current.json';
  private headers = new HttpHeaders({
    'X-RapidAPI-Key': 'af3431978amshc69811be2a6a5cep1e62abjsnbf2a965a707d',
    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
  });

  getCurrentWeather(location: string): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: this.headers,
      params: { q: location },
    });
  }
  onSearchSelection(item: any) {
    this.handleSelectedItem(item);
  }
  handleSelectedItem(item: any) {
    const cityName = item && item.name ? item.name : 'Udupi'; // Check if item.name exists, else use 'Udupi'
    this.fetchWeatherData(cityName);
    this.getfulldata(cityName);
  }

  ngOnInit(): void {
    this.getLocation();
   
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => this.showPosition(position));
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  showPosition(position: any) {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    
    localStorage.setItem('location', JSON.stringify(location));
    
    this.fetchWeatherData(`${ position.coords.latitude},${ position.coords.longitude}` || 'Bangalore');
  }
  getfulldata(location: string) {
    this.getCurrentWeather(location).subscribe(
      (res) => {
        this.data = res;

        const recentList = JSON.parse(
          localStorage.getItem('recentSearch') || '[]'
        );
        const favList = JSON.parse(localStorage.getItem('favourite') || '[]');
        let tempData = {
          name: res.location.name,
          region: res.location.region,
          localtime: res.location.localtime,
          text: res.current.condition.text,
          icon: res.current.condition.icon,
          temp_c: res.current.temp_c,
          flag: favList.some(
            (favItem: any) =>
              favItem.name === res.location.name &&
              favItem.region === res.location.region
          ),
        };

        const exists = recentList.some(
          (recentItem: any) =>
            recentItem.name === tempData.name &&
            recentItem.region === tempData.region
        );
        if (!exists) {
          recentList.push(tempData);
          localStorage.setItem('recentSearch', JSON.stringify(recentList));
        }
      },
      (error) => {
        console.error(error); // Log errors
      }
    );
  }

  private fetchWeatherData(location: string) {
    this.getCurrentWeather(location).subscribe(
      (res) => {
        this.data = res;
        const recentList = JSON.parse(
          localStorage.getItem('favourite') || '[]'
        );
        const recentIndex = recentList.some(
          (recentItem: any) =>
            recentItem.name === res.location.name &&
            recentItem.region === res.location.region
        );
        this.data.flag = recentIndex;
        this.sharedService.updateData(this.data);
        localStorage.setItem('weatherData', JSON.stringify(this.data));
      },
      (error) => {
        console.error(error); // Log errors
      }
    );
  }
}
