import { AuthService } from './../../_core/auth-service/auth.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-login-nav',
  templateUrl: './login-nav.component.html',
  styleUrls: ['./login-nav.component.css']
})
export class LoginNavComponent implements OnInit {
  @Input()
  user;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
  }
}