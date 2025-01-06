import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DialogueboxComponent } from '../dialoguebox/dialoguebox.component';
import { SharedService } from '../../services/shared.service';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-recent-search',
  standalone: true,
  imports: [CommonModule, DialogueboxComponent,HttpClientModule],
  templateUrl: './recent-search.component.html',
  styleUrl: './recent-search.component.css',
})
export class RecentSearchComponent implements OnInit {
  showPrompt = false;
  data: any = [];
  flag:boolean=false
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
  openDialogueboc() {
    this.showPrompt = true;
  }
  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('recentSearch') || '[]').reverse();
  }
  handleClick(index: number,event :Event) {
    event.stopPropagation();
    const item = this.data[index];
    const favlist = JSON.parse(localStorage.getItem('favourite') || '[]');
    const weatherData = JSON.parse(localStorage.getItem('weatherData') || '[]');
    const isPresent = favlist.some((favItem: any) => favItem.name === item.name);
    if(weatherData.location.name===item.name && weatherData.location.region===item.region){
      weatherData.flag=!weatherData.flag;
      localStorage.setItem('weatherData', JSON.stringify(weatherData));
      this.sharedService.updateData(weatherData);
    }
    if (isPresent) {
      this.data[index].flag = false;
      const item = this.data[index];
      const updatedFavlist = favlist.filter((favItem: any) => favItem.name !== item.name);
      localStorage.setItem('favourite', JSON.stringify(updatedFavlist));
    } else {
      this.data[index].flag = true;
      const item = this.data[index];
      item.flag = true;
      favlist.push(item);
      localStorage.setItem('favourite', JSON.stringify(favlist));
    }
    
    localStorage.setItem('recentSearch', JSON.stringify(this.data));
   
  }
  
  roundNumber(number:number){
    return Math.round(number)
  }

  handleResponse(response: boolean) {
    this.showPrompt = false;
    if (response) {
      localStorage.removeItem('recentSearch');
      this.data = [];
    }
  }
  handlePlaceClick(index: number) {
    this.fetchWeatherData(this.data[index].name);
    this.router.navigate(['/home']);

  }
  getCurrentWeather(location: string): Observable<any> {
      return this.http.get(this.apiUrl, {
        headers: this.headers,
        params: { q: location },
      });
    }
    private fetchWeatherData(location: string) {
      this.getCurrentWeather(location).subscribe(
        (res) => {
          this.data = res;
          const recentList = JSON.parse(
            localStorage.getItem('favourite') || '[]'
          );
          const recentIndex=recentList.some((recentItem: any) =>
            recentItem.name === res.location.name &&
            recentItem.region === res.location.region
          );
         this.data.flag=recentIndex
          this.sharedService.updateData(this.data);
          localStorage.setItem('weatherData', JSON.stringify(this.data)); 
        },
        (error) => {
          console.error(error); // Log errors
        }
      );
    }
}
