import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Constants } from '../model/constants';
import { StoreVM } from '../model/store-vm';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class StoreAuthGuard implements CanActivate {
  subdomain: string = ''; objStoreInfo: StoreVM = {}; isLoading: boolean = true;
  constructor(private _commonService: CommonService, private _notificationService: NotificationService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    const domain = window.location.hostname;
    if (domain.indexOf('.') < 0 ||
      domain.split('.')[0] === 'example' || domain.split('.')[0] === 'lvh' || domain.split('.')[0] === 'www') {
      this.subdomain = '';
    } else {
      this.subdomain = domain.split('.')[0];
    }
    if (this.subdomain != '') {
      return this._commonService.getStoreInfo(this.subdomain || '').pipe(
        map(user => {        
          if (user) {
            this.objStoreInfo = user;
            console.log(this.objStoreInfo.advImgList)
            // this.objStoreInfo.logoPath = environment.imageBaseURL + this.objStoreInfo.logoPath;
            this.objStoreInfo.logoPath = this.objStoreInfo.logoPath;
            this.isLoading = false;
            this._commonService.setStoreInfolocalStorage(this.objStoreInfo);
            if (this.objStoreInfo.businessHours?.isClosed) {
              //this._notificationService.showError(Constants.offlineMsg + this.objStoreInfo.businessHours.openTime12Hour + "-" + this.objStoreInfo.businessHours.closeTime12Hour, 'Error', 3000)
              return true;
            }
            else {
              return true;
            }
          } else {
            return true;
          }
        }, (err: { message: string | undefined; }) => {
          this._notificationService.showError(err.message, 'Error')
        }));
    }
    else {
      return false;
    }
  }
}


//     this._commonService.getStoreInfo(this.subdomain || '').subscribe(
//       data => {
//         this.objStoreInfo = data;
//         this.objStoreInfo.logoPath = environment.imageBaseURL + this.objStoreInfo.logoPath;
//         console.log(this.objStoreInfo)
//         this.isLoading = false;
//         this._commonService.setStoreInfolocalStorage(this.objStoreInfo);
//         if (this.objStoreInfo.businessHours?.isClosed) {
//           //this._notificationService.showError(Constants.offlineMsg + data.businessHours.openTime12Hour + "-" + data.businessHours.closeTime12Hour, 'Error')
//           return false;
//         }
//         else {
//           return true;
//         }
//       }, err => {
//         this._notificationService.showError(err.message, 'Error')
//       });
//     return true;
//   }
//     else {
//   return false;
// }
//   }
// }
