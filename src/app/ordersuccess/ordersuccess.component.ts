import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService2Service } from '../service/cart-service2.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-ordersuccess',
  templateUrl: './ordersuccess.component.html',
  styleUrls: ['./ordersuccess.component.sass']
})
export class OrdersuccessComponent implements OnInit {
  objOrderResponse: any = {};
  currencySymbol: string = '';
  constructor(private router: Router, private _commonService: CommonService, private _cartService2: CartService2Service) {
    this.objOrderResponse = this.router.getCurrentNavigation()?.extras?.state?.res;
    console.log(this.objOrderResponse)
    this._cartService2.emptyCart();
    this.currencySymbol = this._commonService.getStoreInfolocalStorage().currencySymbol || '';
    if (this.objOrderResponse == undefined) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
  }
}
