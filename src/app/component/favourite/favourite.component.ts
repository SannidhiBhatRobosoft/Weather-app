import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DialogueboxComponent } from "../dialoguebox/dialoguebox.component";
import { SharedService } from "../../services/shared.service";
@Component({
  selector: 'app-favourite',
  standalone: true,
  imports: [CommonModule, DialogueboxComponent],
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
 constructor( private sharedService: SharedService){}
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
  handleClick(index: number) {

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
}
