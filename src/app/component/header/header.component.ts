import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Component, HostListener, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isSidebarOpen: boolean = false;
  currentTab: string = 'home';

  toggleMenu() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger');
    const searchContainer = document.querySelector('.search');

    // Handle sidebar click outside
    if (
      !sidebar?.contains(event.target as Node) &&
      !hamburger?.contains(event.target as Node)
    ) {
      this.isSidebarOpen = false;
      document.body.classList.remove('no-scroll');
    }

    // Handle search suggestions click outside
    if (!searchContainer?.contains(event.target as Node)) {
      this.searchResults = []; // Clear search results
    }
  }

  searchQuery: string = ''; // User's search query
  searchResults: any[] = []; // Array to store search results

  constructor(private http: HttpClient, private router: Router) {}
  @Output() searchSelection = new EventEmitter<any>();
  private headers = new HttpHeaders({
    'X-RapidAPI-Key': 'af3431978amshc69811be2a6a5cep1e62abjsnbf2a965a707d',
    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
  });

  private apiUrl = 'https://weatherapi-com.p.rapidapi.com/search.json'; // API URL

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url.split('/')[1];
        this.currentTab = url || 'home';
      }
    });
  }

  onSearchChange() {
    if (this.searchQuery.length >= 3) {
    
      this.http
        .get<any>(this.apiUrl, {
          headers: this.headers,
          params: { q: this.searchQuery },
        })
        .subscribe(
          (response) => {
            this.searchResults = response; 
          },
          (error) => {
            console.error('Error fetching data:', error);
          }
        );
    }
  }
  onSuggestionClick(item: any) {
    this.searchQuery=item.name
    this.searchResults = []; 
    this.searchSelection.emit(item); 
    // this.searchQuery=""
  }
  navigateTo(tab: string) {
    this.currentTab = tab;
    this.toggleMenu();
    this.router.navigate([`/${tab}`]);
  }
}
