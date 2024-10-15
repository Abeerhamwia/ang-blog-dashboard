import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }
  ngOnInit(): void {
  }

  onSubmit(formValue: any) {
    this.authService.login(formValue.email, formValue.password);
  }
  
 }
