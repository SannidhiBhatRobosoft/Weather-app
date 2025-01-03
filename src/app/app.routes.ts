import { Routes } from '@angular/router';
import { HomeBodyComponent } from './component/home-body/home-body.component';
import { FavouriteComponent } from './component/favourite/favourite.component';
import { RecentSearchComponent } from './component/recent-search/recent-search.component';
export const routes: Routes = [
    { path: 'home', component: HomeBodyComponent },
    { path: 'favourite', component: FavouriteComponent },
    { path: 'recentsearch', component: RecentSearchComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },

];
