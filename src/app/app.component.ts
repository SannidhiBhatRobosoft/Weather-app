import { Component,  EventEmitter, OnInit, Output} from '@angular/core';
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
  imports: [
    RouterOutlet,
    HeaderComponent,
    HomeTopComponent,
    HomeBodyComponent,
    FooterComponent,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @Output() weatherUpdated: EventEmitter<string> = new EventEmitter<string>();
  title = 'weather-app';
  data: any = {};
 
  constructor(private http: HttpClient,private router:Router,private sharedService: SharedService) {}


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
    const recentList = JSON.parse(localStorage.getItem('recentSearch') || '[]');
    
    let tempData = {
      name: item.name,
      region: item.region,
      localtime: item.localtime,
      text: item.text,
      icon: item.icon,
      temp_c: item.temp_c,
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
    const cityName = item && item.name ? item.name : 'Udupi'; // Check if item.name exists, else use 'Udupi'
    
    this.fetchWeatherData(cityName);
   
  }

  ngOnInit(cityName: string = 'Udupi'): void {
    this.fetchWeatherData(cityName);
  }

  private fetchWeatherData(location: string) {
    this.getCurrentWeather(location).subscribe(
      (res) => {
        this.data = res; 
        this.sharedService.updateData(res);
        localStorage.setItem('weatherData', JSON.stringify(res)); // Store in localStorage
      },
      (error) => {
        console.error(error); // Log errors
      }
    );
  }
}
