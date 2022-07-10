import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../model/constants';

@Injectable({
  providedIn: 'root'
})
export class SpecialofferService {

  constructor(private http: HttpClient) { }

  getSpecialOfferDates(userId: string): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getSpecialOfferDatesForAPPURL + "?userId=" + userId);
  }

  getSpecialOfferInfoById(specialOfferId: number, pageNumber: number, pageSize: number, userId: string): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getSpecialOfferInfByIdAPPURL + "?id=" + specialOfferId + "&userId=" + userId + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&searchStr=+");
  }

  getProductsBySpecialOfferIdAPPURL(categoryId: string, specialOfferId: number, userId: string): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getProductsBySpecialOfferIdAPPURL + "?categoryId=" + categoryId + "&specialOfferId=" + specialOfferId + "&userId=" + userId);
  }

  getSpecialOfferProductCatgories(specialOfferId: number, userId: string): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getSpecialOfferCatgoriesAPPURL + "?specialOfferId=" + specialOfferId + "&userId=" + userId);
  }
}
