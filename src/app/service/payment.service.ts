import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../model/constants';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient, private _commonService: CommonService) { }

  saveOrder(data: any): Observable<any> {
    // return this.http.post(environment.apiURL + Constants.paymentAPIURL + "?storeUserId=" + data.storeUserId + "&loggedInUserId=" + data.loggedInUserId + "&price=" + data.price + "&stripeToken=" + data.stripeToken + "&email=" + data.email, null);    //.pipe(catchError(this._commonService.errorHandler));
    const UrlhttpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'bearer ' + this._commonService.getuserInfolocalStorage().access_token })
    };
    return this.http.post(environment.apiURL + Constants.saveOrderURL, data, UrlhttpOptions);    //.pipe(catchError(this._commonService.errorHandler));
  }
}
