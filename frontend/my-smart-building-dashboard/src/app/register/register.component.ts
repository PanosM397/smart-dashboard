import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { AuthService } from 'src/shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage!: string;

  private apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      'first-name': ['', Validators.required],
      'last-name': ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  register(): void {
    if (this.form.valid) {
      this.http.post(`${this.apiUrl}/register`, this.form.value).subscribe({
        next: (response: any) => {
          console.log('Registration successful', response);
          // Save the token in local storage
          localStorage.setItem('token', response.token);
          // Notify other components about the authentication status change
          this.authService.notifyLoginStatusChanged(true);
          // Redirect the user to the dashboard or home page
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Registration failed', error);
        },
      });
    } else {
      console.error('Form is not valid');
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
