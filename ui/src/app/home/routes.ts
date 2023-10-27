import { Route } from '@angular/router';
import { HomeComponent } from './home.component';
import { postloginGuard } from '../postlogin.guard';

export const HOME_ROUTES: Route[] = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
    canActivate: [postloginGuard],
  },
];
