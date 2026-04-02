import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class View implements OnInit {
  user: User | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchUser(id);
    } else {
      this.router.navigate(['/user/list']);
    }
  }

  fetchUser(id: string) {
    this.isLoading = true;
    this.userService.get(id).subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/user/list']);
        this.cdr.detectChanges();
      }
    });
  }

  deleteUser() {
    const userId = this.user?.id || this.user?._id;
    if (userId && confirm('Are you sure you want to delete this community member? This action cannot be undone.')) {
      this.userService.delete(userId).subscribe(() => {
        this.router.navigate(['/user/list']);
      });
    }
  }
}
