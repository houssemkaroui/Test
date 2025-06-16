import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { username: '', email: '', password: '', role: 'admin' }
  hide = true;

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    if (!this.user.username || !this.user.email || !this.user.password || !this.user.role) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => alert('Échec de l\'inscription')
    });
  }
}
