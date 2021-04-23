import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '@services/authentication.service';
import { GlobalLoadingService } from '@services/global-loading.service';
import { User } from '@models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public loadingService: GlobalLoadingService,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  public ngOnInit(): void {
    this.checkAuth();
  }

  private checkAuth(): void {
    this.authenticationService.checkAuth().subscribe(
      (user) => {
        this.currentUser = user;
        this.loadingService.setState(false);
        this.router.navigate(['/']);
      },
      () => {
        this.loadingService.setState(false);
        this.router.navigate(['/login']);
      },
    );
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
