import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  hide = true;
  submitted = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.submitted = true;

    if (!this.credentials.email || !this.credentials.password) {
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        localStorage.setItem('access_token', res.accessToken);
        this.router.navigate(['/articles']);
      },
      error: () => {
        alert('Connexion échouée. Veuillez vérifier vos identifiants.');
      }
    });
  }
}
