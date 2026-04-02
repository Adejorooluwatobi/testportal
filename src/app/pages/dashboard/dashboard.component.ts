import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  greeting = 'Welcome back! 🌿';
  beneficiaries = 2841;
  fundsRaised = 18.4;
  activePrograms = 8;
  activeVolunteers = 347;

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.setGreeting(user?.username);
    });
  }

  setGreeting(username: string = 'Admin') {
    const hour = new Date().getHours();
    let prefix = 'Good morning';
    if (hour >= 12 && hour < 17) prefix = 'Good afternoon';
    else if (hour >= 17) prefix = 'Good evening';
    
    this.greeting = `${prefix}, ${username} ${hour < 12 ? '🌿' : hour < 17 ? '☀️' : '🌙'}`;
  }
}
