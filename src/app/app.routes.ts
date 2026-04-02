import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      
      // Content Management
      { path: 'about', loadComponent: () => import('./pages/about/view/view').then(m => m.AboutComponent) },
      { path: 'contact', loadComponent: () => import('./pages/contact/view/view').then(m => m.ContactComponent) },
      { path: 'homepage', loadComponent: () => import('./pages/homepage/view/view').then(m => m.HomePageComponent) },
      { path: 'news', loadComponent: () => import('./pages/news/view/view').then(m => m.NewsComponent) },
      { path: 'program', loadComponent: () => import('./pages/program/view/view').then(m => m.ProgramComponent) },
      { path: 'volunteer', loadComponent: () => import('./pages/volunteer/view/view').then(m => m.VolunteerComponent) },
      { path: 'donation', loadComponent: () => import('./pages/donation/view/view').then(m => m.DonationComponent) },
      
      // Management
      { path: 'admin/list', loadComponent: () => import('./pages/admin/list/list').then(m => m.List) },
      { path: 'admin/view/:id', loadComponent: () => import('./pages/admin/view/view').then(m => m.View) },
      { path: 'admin/create', loadComponent: () => import('./pages/admin/create/create').then(m => m.Create) },
      { path: 'admin/edit/:id', loadComponent: () => import('./pages/admin/edit/edit').then(m => m.Edit) },
      
      { path: 'user/list', loadComponent: () => import('./pages/user/list/list').then(m => m.List) },
      { path: 'user/view/:id', loadComponent: () => import('./pages/user/view/view').then(m => m.View) },
      
      { path: 'volunteer-app-form/list', loadComponent: () => import('./pages/volunteer-app-form/list/list').then(m => m.List) },
      { path: 'volunteer-app-form/view/:id', loadComponent: () => import('./pages/volunteer-app-form/view/view').then(m => m.View) },
      
      { path: 'consultation/list', loadComponent: () => import('./pages/consultation/list/list').then(m => m.List) },
      { path: 'consultation/view/:id', loadComponent: () => import('./pages/consultation/view/view').then(m => m.View) },
      
      { path: 'donation-records', loadComponent: () => import('./pages/donation-record/list/list').then(m => m.DonationRecordList) },
      { path: 'donation-records/:id', loadComponent: () => import('./pages/donation-record/view/view').then(m => m.DonationRecordView) },
      
      // System
      { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },
    ]
  },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: '**', redirectTo: 'dashboard' }
];
