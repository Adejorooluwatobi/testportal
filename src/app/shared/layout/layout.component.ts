import { Component, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  isMobOpen = false;
  isCollapsed = false;
  currentPageTitle = 'Dashboard';

  private titles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/about': 'About Us',
    '/contact': 'Contact Info',
    '/homepage': 'Homepage',
    '/news': 'News',
    '/program': 'Programs',
    '/volunteer': 'Volunteer Page',
    '/admin': 'Admins',
    '/user': 'Users',
    '/volunteer-app-form': 'Applications',
    '/profile': 'My Profile',
    '/settings': 'Settings',
  };

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.updateTitle(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateTitle(event.urlAfterRedirects);
      if (this.isMob()) this.isMobOpen = false;
      // Force Angular to sync the view immediately after navigation
      this.cdr.detectChanges();
    });
  }

  updateTitle(url: string) {
    const key = Object.keys(this.titles).find(k => url.startsWith(k));
    this.currentPageTitle = key ? this.titles[key] : 'Dashboard';
  }

  isMob() {
    return window.innerWidth <= 900;
  }

  handleSbBtn() {
    if (this.isMob()) {
      this.isMobOpen = !this.isMobOpen;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (!this.isMob()) {
      this.isMobOpen = false;
    }
  }
}
