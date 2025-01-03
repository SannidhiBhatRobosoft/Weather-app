import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  data:any={}
  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('weatherData') || '{}');
    
  }

}
