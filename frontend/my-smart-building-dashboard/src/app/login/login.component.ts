import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  hidePassword = true;
  errorMessage!: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.form.valid) {
      this.http
        .post('http://localhost:3000/api/login', this.form.value)
        .subscribe({
          next: (response: any) => {
            console.log('Login successful', response);
            // Assuming response contains user token or data
            localStorage.setItem('token', response.token);
            // Redirect to the dashboard or home page
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Login failed', error);
            this.errorMessage = 'Login failed. Please try again.'; // Display or handle error message
          },
        });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
