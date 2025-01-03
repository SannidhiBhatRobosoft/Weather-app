import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DialogueboxComponent } from '../dialoguebox/dialoguebox.component';

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
   
  openDialogueboc() {
    this.showPrompt = true;
  }
  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('recentSearch') || '[]');
  }
  handleClick(index: number) {
    localStorage.setItem('favourite', JSON.stringify(this.data));
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
