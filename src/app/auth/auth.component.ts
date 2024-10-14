import { Component, OnInit } from '@angular/core';
import { AppwriteService } from '../services/appwrite.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent  {
  email = '';
  password = '';
  name = '';
  isLogin = true; 

  constructor(private appwriteService: AppwriteService, private router: Router) {}

  toggleForm(event: Event) {
    event.preventDefault();
    this.isLogin = !this.isLogin;
  }

  async onSubmit() {
    if (this.isLogin) {
      try {
        await this.appwriteService.loginUser(this.email, this.password);
        Swal.fire({
          icon: 'success',
          title: 'Logged in!',
          text: 'User logged in successfully.',
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigate(['/events']); 
      } catch (error: any) {
        console.error('Login Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Failed to log in. Please try again later.',
        });
      }
    } else {
      // Registration form
      try {
        await this.appwriteService.registerUser(this.email, this.password, this.name);
        Swal.fire({
          icon: 'success',
          title: 'Registered!',
          text: 'User registered successfully.',
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigate(['/auth']); 
      } catch (error) {
        console.error('Registration Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Registration failed. Please try again later.',
        });
      }
    }
  }
}