import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DialogueboxComponent } from "../dialoguebox/dialoguebox.component";

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
 ngOnInit(): void {
   this.data = JSON.parse(localStorage.getItem('favourite') || '[]');
  
 }
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
    this.data.splice(index, 1);
    localStorage.setItem('favourite', JSON.stringify(this.data));

  }
}
