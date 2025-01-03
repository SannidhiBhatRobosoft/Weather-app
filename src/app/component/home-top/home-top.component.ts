import { Component, OnInit,Input  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-top',
  standalone: true,
  imports: [],
  templateUrl: './home-top.component.html',
  styleUrls: ['./home-top.component.css'],
  providers: [DatePipe]
})
export class HomeTopComponent implements OnInit {
 data:any={}
  currentTab: string = 'home';
  formattedTime: string = '';
 
  constructor(private router: Router, private datePipe: DatePipe) {}
  
  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('weatherData') || '{}');
    this.formattedTime = this.datePipe.transform(this.data.location.localtime, 'EEE, d MMM yyyy h:mm a') || '';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url.split('/')[1];
        this.currentTab = url || 'home';
      }
    });
  }
  
  navigateTo(tab: string) {
    this.currentTab = tab;
    this.router.navigate([`/${tab}`]);
  }
}
