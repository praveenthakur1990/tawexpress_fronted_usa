import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Constants } from '../model/constants';
import { cartItem } from '../model/product-vm';
import { CartService2Service } from '../service/cart-service2.service';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGuard implements CanActivate {
  public shoppingCartItems$: Observable<cartItem[]> = of([]);
  objCarttems: Array<cartItem> = []; totalAmt: number = 0;
  constructor(private _commonService: CommonService, private router: Router, private _cartService2: CartService2Service, private _notificationService: NotificationService) {
    this._cartService2.getItems().subscribe(res => {
      this.objCarttems = res;
      //debugger
      console.log(this.objCarttems)
      if (this.objCarttems!=null && this.objCarttems.length > 0 && this.objCarttems[0]!=null) {
        this.totalAmt = 0;
        for (let i = 0; i < this.objCarttems.length; i++) {
          let amt = (this.objCarttems[i].price || 0) * (this.objCarttems[i].qty || 0);
          this.totalAmt += parseFloat(amt.toFixed(2));
        }
      }
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this._commonService.getuserInfolocalStorage().userId != undefined && this.objCarttems!=null && this.objCarttems.length > 0 && this.objCarttems[0]!=null) {
      if (parseFloat(this.totalAmt.toString()) < parseFloat(this._commonService.getStoreInfolocalStorage().minOrderAmt || '0')) {
        this._notificationService.showError(Constants.minOrderMsg + this._commonService.getStoreInfolocalStorage().currencySymbol + this._commonService.getStoreInfolocalStorage().minOrderAmt, "Error");
        return false;
      }
      return true;
    }
    return this.router.parseUrl("/dashboard");
  }
}
