import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DialogueboxComponent } from "../dialoguebox/dialoguebox.component";
import { SharedService } from "../../services/shared.service";
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-favourite',
  standalone: true,
  imports: [CommonModule, DialogueboxComponent,HttpClientModule],
  templateUrl: './favourite.component.html',
  styleUrl: './favourite.component.css'
})
export class FavouriteComponent implements OnInit{
  showPrompt = false;
 data:any=[]
 flag:boolean=false
 ngOnInit(): void {
   this.data = JSON.parse(localStorage.getItem('favourite') || '[]');
  
 }
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
 roundNumber(number:number){
  return Math.round(number)
}
  openDialogueboc() {
    this.showPrompt = true; 
  }
 
  handleResponse(response: boolean) {
    this.showPrompt = false; 
    if (response) {
      localStorage.removeItem('favourite');
      this.data = [];
    } 
  }
  handleClick(index: number,event:Event) {
    event.stopPropagation();
    const itemToRemove = this.data[index];
    const recentList = JSON.parse(localStorage.getItem('recentSearch') || '[]');
    const weatherData = JSON.parse(localStorage.getItem('weatherData') || '[]');
    const recentIndex = recentList.findIndex(
      (recentItem: any) =>
        recentItem.name === itemToRemove.name &&
        recentItem.region === itemToRemove.region
    );
    if(weatherData.location.name===itemToRemove.name && weatherData.location.region===itemToRemove.region){
      weatherData.flag=!weatherData.flag;
      localStorage.setItem('weatherData', JSON.stringify(weatherData));
      this.sharedService.updateData(weatherData);
    }
    if (recentIndex !== -1) {
      recentList[recentIndex].flag = false;
      localStorage.setItem('recentSearch', JSON.stringify(recentList));
    }
   
    this.data.splice(index, 1);
    localStorage.setItem('favourite', JSON.stringify(this.data));
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
