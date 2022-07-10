import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Constants } from '../model/constants';
import { StoreVM } from '../model/store-vm';
import { NotificationService } from './notification.service';
import { UserVM } from '../model/user-vm';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  objStoreInfo: StoreVM = {}; objUserInfo: UserVM = { ".issued": '', ".expires": '' };
  private subjectName = new Subject<any>();
  constructor(private http: HttpClient, private _notificationService: NotificationService) { }
  getStoreInfo(sudDomain: string): Observable<any> {
    return this.http.get(environment.apiURL + Constants.tenantsInfoURL + "?domainName=" + sudDomain);
  }

  setStoreInfolocalStorage(objStoreInfo: StoreVM) {
    localStorage.setItem('Storenfo', JSON.stringify(objStoreInfo));
  }

  getStoreInfolocalStorage() {
    this.objStoreInfo = JSON.parse(localStorage.getItem('Storenfo') || '{}');
    return this.objStoreInfo;
  }

  setuserInfolocalStorage(objuserInfo: UserVM) {
    localStorage.setItem('userInfo', JSON.stringify(objuserInfo));
  }

  getuserInfolocalStorage() {
    this.objUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return this.objUserInfo;
  }


  errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.log(this._notificationService)
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      this._notificationService.showError(error.error, error.status.toString())
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  sendUpdate(message: any) { //the component that wants to update something, calls this fn
    this.subjectName.next({ text: message }); //next() will feed the value in Subject
  }

  getUpdate(): Observable<any> { //the receiver component calls this function 
    return this.subjectName.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
  }

}
