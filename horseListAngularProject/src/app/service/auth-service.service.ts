import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Constants } from '../../config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private currentUserSubject: BehaviorSubject<null>;
  public currentUser: Observable<null>;

  constructor(
    private http: HttpClient,
    private _config: Constants,
    private _route: Router
  ) {
    this.currentUserSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${this._config.BASE_URL}/users/login`, {
        email: username,
        password
      })
      .pipe(
        map(user => {
          console.log('USER LOGIN : ', user);
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this._route.navigate(['login']);
  }
}
