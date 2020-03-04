import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthServiceService } from '../service/auth-service.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private _auth: AuthServiceService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser = this._auth.currentUserValue;
    const currentUserToken =
      currentUser !== null ? currentUser.data.access_token : '';
    if (currentUser && currentUserToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUserToken}`
        }
      });
    }

    return next.handle(request);
  }
}
