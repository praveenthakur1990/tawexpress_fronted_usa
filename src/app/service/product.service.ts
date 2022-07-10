import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SrvRecord } from 'dns';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../model/constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductForDashboard(categoryId: number, limit: number = 0, userId: string): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getProductsForDashboardURL + "?categoryId=" + categoryId + "&limit=" + limit + "&userId=" + userId);
  }

  getProductByCategoryId(categoryId: string, subCategoryIds: string, brandIds: string, userId: string): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getProductsByCategoryIdURL + "?categoryId=" + categoryId + "&subCategoryIds=" + subCategoryIds + "&brandIds=" + brandIds + "&userId=" + userId);
  }

  getProductBySearchStr(searchStr: string, userId: string): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getProductsBySearchStrURL + "?searchStr=" + searchStr + "&userId=" + userId);
  }

  getRelatedProductById(productId: number, limit: number = 0, userId: string): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getRelatedProductsByIdURL + "?productId=" + productId + "&limit=" + limit + "&userId=" + userId);
  }

}
