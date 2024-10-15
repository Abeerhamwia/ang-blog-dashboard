import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userEmail: string = '';
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userEmail = parsedUser.email; // Access email only if user is not null
    } else {
      this.userEmail = ''; // Fallback for null case
    }
  
    this.authService.loggedIn.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('user') || '{}'); // Default to empty object
        this.userEmail = user.email || ''; // Fallback for email
      } else {
        this.userEmail = '';
      }
    });
  }
  

  onLogOut() {
    this.authService.logout();
  }
}
