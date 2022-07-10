import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '../service/account.service';
import { UserVM } from '../model/user-vm';
import { CommonService } from '../service/common.service';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  objUser: UserVM = { ".issued": '', ".expires": '' };
  constructor(private _commonService: CommonService, private _accountService: AccountService, private _router: Router, private _notificationService: NotificationService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {
      //debugger
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this._accountService.validateUserByRefreshToken().subscribe(res => {
          // console.log(res)
          this.objUser = res;
          this._commonService.setuserInfolocalStorage(this.objUser);
          window.location.reload();
        }, err => {
          //debugger
          localStorage.clear();
          this._router.parseUrl("/dashboard");
        });
      }
      const error = err.error.message || err.statusText;
      //this._notificationService.showError(error, "Error");
      return throwError(error);
    }))
  }
}
