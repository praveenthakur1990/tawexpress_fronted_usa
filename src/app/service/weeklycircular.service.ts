import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../model/constants';

@Injectable({
  providedIn: 'root'
})
export class WeeklycircularService {

  constructor(private http: HttpClient) { }

  getWeeklyCircularDates(userId: string): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getWeeklyCircularDatesForAPPURL + "?userId=" + userId);
  }

  getWeeklyCircularInfoById(weeklyCircularId: number, pageNumber: number, pageSize: number, userId: string): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getWeeklyCircularInfByIdAPPURL + "?id=" + weeklyCircularId + "&userId=" + userId + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&searchStr=+");
  }

  getWeeklyCircularProductCatgories(weeklyCircularId: number, userId: string): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getWeeklyCircularCatgoriesAPPURL + "?weeklyCircularId=" + weeklyCircularId + "&userId=" + userId);
  }

  getProductsByWeeklyCircularIdAPPURL(categoryId: string, weeklyCircularId: number, userId: string): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getProductsByWeeklyCircularIdAPPURL + "?categoryId=" + categoryId + "&weeklyCircularId=" + weeklyCircularId + "&userId=" + userId);
  }

  registerWeeklyCircularSubscriber(registerModel: any): Observable<any> {
    return this.http.post(environment.apiURL + Constants.getWeeklyCircularSubscriberSaveURL, registerModel);    //.pipe(catchError(this._commonService.errorHandler));
  }

  verifyWeeklyCircularSubscriber(data: any): Observable<any> {
    return this.http.post(environment.apiURL + Constants.getWeeklyCircularVerifySubscriberURL + "?OTP=" + data.OTP + "&mobileNumber=" + data.mobileNumber + "&userId=" + data.userId, null);    //.pipe(catchError(this._commonService.errorHandler));
  }

  ValidateSubscriber(data: any): Observable<any> {
    return this.http.post(environment.apiURL + Constants.getWeeklyCircularValidateSubscriberURL + "?mobileNumber=" + data.mobileNumber + "&userId=" + data.userId, null);    //.pipe(catchError(this._commonService.errorHandler));
  }

}
