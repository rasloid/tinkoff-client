import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env/environment';
import { User } from '@models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public checkAuth(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/login`).pipe(
      map((user) => {
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/login`, { email: username, password })
      .pipe(map(user => {
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    this.currentUserSubject.next(null);
  }
}
