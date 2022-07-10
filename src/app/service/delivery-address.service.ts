import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stat } from 'fs';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../model/constants';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryAddressService {

  constructor(private http: HttpClient, private _commonService: CommonService) { }

  addNewAddress(data: any): Observable<any> {
    const UrlhttpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'bearer ' + this._commonService.getuserInfolocalStorage().access_token })
    };
    return this.http.post(environment.apiURL + Constants.saveDeliveryAddressURL, data, UrlhttpOptions);    //.pipe(catchError(this._commonService.errorHandler));
  }

  getDeliveryAddresses(id: number): Observable<any> {
    const UrlhttpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'bearer ' + this._commonService.getuserInfolocalStorage().access_token })
    };
    //console.log(this._commonService.getuserInfolocalStorage().access_token)
    return this.http.get(environment.apiURL + Constants.getDeliveryAddresses + "?id=" + id + "&userId=" + this._commonService.getuserInfolocalStorage().userId + "&createdBy=" + this._commonService.getuserInfolocalStorage().createdBy, UrlhttpOptions);    //.pipe(catchError(this._commonService.errorHandler));
  }

  getDeliverySlotDays(days: number): Observable<any> {
    const UrlhttpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'bearer ' + this._commonService.getuserInfolocalStorage().access_token })
    };
    //console.log(this._commonService.getuserInfolocalStorage().access_token)
    return this.http.get(environment.apiURL + Constants.getDeliverySlotDays + "?days=" + days + "&createdBy=" + this._commonService.getuserInfolocalStorage().createdBy, UrlhttpOptions);    //.pipe(catchError(this._commonService.errorHandler));
  }

  getDeliverySlots(interval: number, start: number, end: number): Observable<any> {
    const UrlhttpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'bearer ' + this._commonService.getuserInfolocalStorage().access_token })
    };
    //console.log(this._commonService.getuserInfolocalStorage().access_token)
    return this.http.get(environment.apiURL + Constants.getDeliverySlots + "?interval=" + interval + "&start=" + start + "&end=" + end + "&createdBy=" + this._commonService.getuserInfolocalStorage().createdBy, UrlhttpOptions);    //.pipe(catchError(this._commonService.errorHandler));
  }

  calculateDistance(deliveryAddressId: number): Observable<any> {
    const UrlhttpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'bearer ' + this._commonService.getuserInfolocalStorage().access_token })
    };
    //console.log(this._commonService.getuserInfolocalStorage().access_token)
    return this.http.get(environment.apiURL + Constants.CalculateDistanceURL + "?deliveryAddressId=" + deliveryAddressId + "&userId=" + this._commonService.getuserInfolocalStorage().createdBy, UrlhttpOptions);    //.pipe(catchError(this._commonService.errorHandler));
  }
}
