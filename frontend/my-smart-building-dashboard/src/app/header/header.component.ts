import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Output,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './../../shared/user.service';

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  items: any[];
  isAuthenticated = false;
  username = '';

  // settings: SelectItem[]; // For settings dropdown

  constructor(
    private router: Router,
    private userService: UserService,
    @Inject(DOCUMENT) public document: Document
  ) {
    // Settings dropdown options
    // this.settings = [
    //   { label: 'Option 1', value: 'option1' },
    //   { label: 'Option 2', value: 'option2' },
    //   // More options
    // ];

    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: '/',
      },
      {
        label: 'Floor Management',
        icon: 'pi pi-fw pi-building',
        routerLink: '/plan',
      },
      {
        label: 'Solar Monitoring',
        icon: 'pi pi-fw pi-sun',
        routerLink: '/solar',
      },
    ];
  }

  ngOnInit() {
    this.attemptFetchUserData();
  }

  attemptFetchUserData() {
    const token = localStorage.getItem('token');
    // console.log(localStorage.getItem('token'));
    if (token) {
      this.fetchUserData();
    }
  }

  fetchUserData() {
    this.userService.getUserData().subscribe({
      next: (userData) => {
        if (userData) {
          this.isAuthenticated = true;
          this.username = userData.username; // Adjust based on your user data structure
        }
      },
      error: (error) => {
        this.isAuthenticated = false;
        console.error('Error fetching user data:', error);
      },
    });
  }

  login() {
    // this.auth.loginWithRedirect();
    this.attemptFetchUserData();
    this.router.navigate(['/login']);
  }

  register() {
    this.attemptFetchUserData();
    this.router.navigate(['/register']); // Navigate to register
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.username = '';
    this.router.navigate(['/login']);
  }
}
