import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../model/constants';
import { catchError } from 'rxjs/operators';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private _commonService: CommonService) { }

  getCategories(userId: String): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getCategoriesURL + "?type=&userId=" + userId);    //.pipe(catchError(this._commonService.errorHandler));
  }

  getSubCategories(cartegoryId: number, userId: String): Observable<any> {
    // const UrlhttpOptions = {
    //   headers: new HttpHeaders({ 'Authorization': 'bearer ' + token })
    // };
    return this.http.get(environment.apiURL + Constants.getSubCategoriesURL + "?categoryId=" + cartegoryId + "&userId=" + userId);
  }  
 
}
