import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../model/constants';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }

  getBrands(categoryId: number, subcategoryIds: string, userId: String): Observable<any> {
    return this.http.get(environment.apiURL + Constants.getBrandsForAppURL + "?categoryId=" + categoryId + "&subCategoryIds=" + subcategoryIds + "&userId=" + userId);
  }
}
