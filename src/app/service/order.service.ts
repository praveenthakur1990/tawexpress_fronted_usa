import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../model/constants';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private _commonService: CommonService) { }

  getOrderList(orderId: number, orderNo: string, orderBy: string, IsCurrentDate: boolean, pageNumber: number, pageSize: number, searchStr: string): Observable<any> {
    const UrlhttpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'bearer ' + this._commonService.getuserInfolocalStorage().access_token })
    };
    return this.http.get(environment.apiURL + Constants.getOrderListURL + "?orderId=" + orderId + "&orderNo=" + orderNo + "&orderBy=" + orderBy + "&IsCurrentDate=" + IsCurrentDate + "&userId=" + this._commonService.getStoreInfolocalStorage().userId + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&searchStr=" + searchStr, UrlhttpOptions);
  }
}
