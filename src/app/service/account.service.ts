import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Constants } from '../model/constants';
import { UserVM } from '../model/user-vm';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserSubject: BehaviorSubject<UserVM>;
  public currentUser: Observable<UserVM>;
  public isLoggedIn$: BehaviorSubject<boolean> | undefined;
  constructor(private http: HttpClient, private _commonService: CommonService) {
    this.currentUserSubject = new BehaviorSubject<UserVM>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();

    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    this.isLoggedIn$ = new BehaviorSubject(isLoggedIn);
    //  debugger
  }

  register(registerModel: any): Observable<any> {
    return this.http.post(environment.apiURL + Constants.registerURL, registerModel);    //.pipe(catchError(this._commonService.errorHandler));
  }

  verifyOTP(data: any): Observable<any> {
    return this.http.post(environment.apiURL + Constants.verifyOTPURL + "?OTP=" + data.OTP + "&mobileNumber=" + data.mobileNumber, null);    //.pipe(catchError(this._commonService.errorHandler));
  }

  login(loginModal: any) {
    let headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let body = new URLSearchParams();
    body.set('username', loginModal.mobileNumber);
    body.set('password', loginModal.password);
    body.set('grant_type', 'password');
    const UrlhttpOptions = {
      headers: new HttpHeaders({ 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    return this.http.post<any>(environment.apiURL + Constants.loginURL, body.toString(), UrlhttpOptions)
      .pipe(map(user => {
        //debugger
        // login successful if there's a jwt token in the response
        if (user && user.access_token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          localStorage.setItem('loggedIn', 'true');
          this.isLoggedIn$?.next(true);
        }
        return user;
      }));
    // return this.http.post(environment.apiURL + Constants.loginURL, body.toString(), UrlhttpOptions);
  }

  logout(): Observable<any> {
    console.log(this._commonService.getuserInfolocalStorage())
    const UrlhttpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'bearer ' + this._commonService.getuserInfolocalStorage().access_token })
    };
    //debugger    
    this.isLoggedIn$?.next(false);
    localStorage.setItem('loggedIn', 'false');
    return this.http.post(environment.apiURL + Constants.logoutURL, null, UrlhttpOptions);
  }

  generateOTP(mobileNumber: any): Observable<any> {
    return this.http.post(environment.apiURL + Constants.GenerateOTPURL + "?mobileNumber=" + mobileNumber + "&tedencyCreatedBy=" + this._commonService.getStoreInfolocalStorage().userId, null);    //.pipe(catchError(this._commonService.errorHandler));
  }

  updatePersonalInfo(data: any): Observable<any> {
    const UrlhttpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'bearer ' + this._commonService.getuserInfolocalStorage().access_token })
    };
    return this.http.post(environment.apiURL + Constants.updatePersonalInfoURL, data, UrlhttpOptions);    //.pipe(catchError(this._commonService.errorHandler));
  }

  validateUserByRefreshToken(): Observable<any> {
    console.log(this._commonService.getuserInfolocalStorage().refresh_token)
   // debugger
    var _url = environment.apiURL + Constants.loginURL;
    let headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let body = new URLSearchParams();
    body.set('refresh_token', this._commonService.getuserInfolocalStorage().refresh_token!);
    body.set('grant_type', 'refresh_token');
    const UrlhttpOptions = {
      headers: new HttpHeaders({ 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    return this.http.post(environment.apiURL + Constants.loginURL, body.toString(), UrlhttpOptions);
  }

  changePassword(params: any): Observable<any> {
    const UrlhttpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'bearer ' + this._commonService.getuserInfolocalStorage().access_token })
    };
    return this.http.post(environment.apiURL + Constants.changePasswordURL, params, UrlhttpOptions);    //.pipe(catchError(this._commonService.errorHandler));
  }
}
