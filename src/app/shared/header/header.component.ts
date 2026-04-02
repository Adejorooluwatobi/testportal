import { Component, EventEmitter, Input, Output, signal, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() pageTitle = 'Dashboard';
  @Output() toggleSidebar = new EventEmitter<void>();

  notifications: Notification[] = [];
  unreadCount = 0;
  selectedNotif: Notification | null = null;
  showAllNotifs = false;

  isProfileOpen = signal(false);
  isNotifOpen = signal(false);
  isMobSearchOpen = signal(false);
  isDark = signal(false);

  constructor(
    public router: Router, 
    public authService: AuthService,
    private notifService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  private pollInterval: any;

  ngOnInit() {
    this.fetchNotifications();
    // Poll every 1 minute
    this.pollInterval = setInterval(() => this.fetchNotifications(), 60000);
  }

  ngOnDestroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  fetchNotifications() {
    this.notifService.get().subscribe({
      next: (data: any) => {
        this.notifications = Array.isArray(data) ? data : [data];
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
        this.cdr.detectChanges();
      }
    });
  }

  toggleDropdown(type: 'profile' | 'notif' | 'search') {
    if (type === 'profile') {
      this.isProfileOpen.set(!this.isProfileOpen());
      this.isNotifOpen.set(false);
    } else if (type === 'notif') {
      this.isNotifOpen.set(!this.isNotifOpen());
      this.isProfileOpen.set(false);
    } else if (type === 'search') {
      this.isMobSearchOpen.set(!this.isMobSearchOpen());
    }
  }

  markAllAsRead() {
    this.notifService.readAll().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.unreadCount = 0;
      this.cdr.detectChanges();
    });
  }

  viewDetail(notif: Notification) {
    this.selectedNotif = notif;
    this.isNotifOpen.set(false);
    if (!notif.isRead) {
      this.notifService.get(notif._id!).subscribe(() => {
        notif.isRead = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        this.cdr.detectChanges();
      });
    }
  }

  viewAll() {
    this.showAllNotifs = true;
    this.isNotifOpen.set(false);
  }

  getIcon(type: string) {
    switch (type) {
      case 'donation': return '💰';
      case 'user_registration': return '👤';
      case 'consultation': return '💬';
      case 'volunteer_app': return '🤝';
      default: return '🔔';
    }
  }

  toggleTheme() {
    this.isDark.set(!this.isDark());
    document.documentElement.setAttribute('data-theme', this.isDark() ? 'dark' : 'light');
  }

  signOut() {
    this.authService.logout();
  }
}
