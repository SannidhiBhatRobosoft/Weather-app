import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DialogueboxComponent } from '../dialoguebox/dialoguebox.component';
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'app-recent-search',
  standalone: true,
  imports: [CommonModule, DialogueboxComponent],
  templateUrl: './recent-search.component.html',
  styleUrl: './recent-search.component.css',
})
export class RecentSearchComponent implements OnInit {
  showPrompt = false;
  data: any = [];
  flag:boolean=false
   constructor( private sharedService: SharedService){}
  openDialogueboc() {
    this.showPrompt = true;
  }
  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('recentSearch') || '[]').reverse();
  }
  handleClick(index: number) {
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
}
