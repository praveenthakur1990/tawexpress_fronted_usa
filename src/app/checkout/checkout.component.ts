import { typeofExpr } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { merge, Observable, of, Subscription } from 'rxjs';
import { cartItem } from '../model/product-vm';
import { StoreVM } from '../model/store-vm';
import { UserVM } from '../model/user-vm';
import { CartService2Service } from '../service/cart-service2.service';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';
import { PaymentService } from '../service/payment.service';
import { AddNewAddressComponent } from '../shared/add-new-address/add-new-address.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.sass']
})
export class CheckoutComponent implements OnInit {
  public shoppingCartItems$: Observable<cartItem[]> = of([]);
  public shoppingCartItems: cartItem[] = []; currencySymbol: string = ''; totalAmt: number = 0; finalAmt: number = 0;
  totalCartItemCount: number = 0;
  objCarttems: Array<cartItem> = [];
  orderType: string = "H";
  objStoreVM: StoreVM = {};
  strikeCheckout: any = null;
  private subscriptionName: Subscription | undefined;
  objDeliveryTime: any = { startTime: '', endTime: '' }; objDeliveryDate: Date | undefined; objDeliveryAddressId: number = 0;
  isRequiredAddress: boolean = false; isRequiredDeliveryDate: boolean = false; isRequiredDeliveryTime: boolean = false;
  isShowDeliverySlot: boolean = false;
  constructor(private _modalService: NgbModal, private _cartService2: CartService2Service, private _commonService: CommonService, private _router: Router, private _notificationService: NotificationService, private _spinner: NgxUiLoaderService, private _paymentService: PaymentService) {
    this.currencySymbol = this._commonService.getStoreInfolocalStorage().currencySymbol || '';
    this.objStoreVM = this._commonService.getStoreInfolocalStorage();
  }

  ngOnInit(): void {
    this.stripePaymentGateway();
    this._cartService2.getItems().subscribe((res: any) => {
      this.objCarttems = res.length > 0 ? res[0] : [];
      console.log(this.objCarttems)
      if (this.objCarttems.length > 0) {
        this.totalAmt = 0;
        this.totalCartItemCount = this.objCarttems.length;
        for (let i = 0; i < this.objCarttems.length; i++) {
          this.totalAmt += parseFloat((this.objCarttems[i].totalPrice || 0).toFixed(2));
        }
      }
      else {
        this.totalAmt = 0;
      }
      this.objStoreVM.taxAmt = parseFloat((this.totalAmt * (this.objStoreVM.taxRate != undefined ? this.objStoreVM.taxRate : 0) / 100).toFixed(2));
      this.finalAmt = parseFloat((this.totalAmt + (this.objStoreVM.deliveryCharges != undefined ? this.objStoreVM.deliveryCharges : 0) + this.objStoreVM.taxAmt).toFixed(2));
    });

    this.subscriptionName = this._commonService.getUpdate().subscribe(res => {
      if (res.text.type == 'deliveryAddressId') {
        //debugger
        this.objDeliveryAddressId = res.text.data;
        this._commonService.sendUpdate({ type: 'isRequiredAddress', isRequired: this.objDeliveryAddressId == 0 ? true : false })
        this.isShowDeliverySlot = true;
      }
      if (res.text.type == 'deliveryDay') {
        this.objDeliveryDate = res.text.data;
        this._commonService.sendUpdate({ type: 'isRequiredDeliveryDate', isRequired: this.objDeliveryDate == undefined ? true : false })
      }
      if (res.text.type == 'deliveryTime') {
        this.objDeliveryTime = res.text.data;
        this._commonService.sendUpdate({ type: 'isRequiredDeliveryTime', isRequired: this.objDeliveryTime.startTime == '' ? true : false })
      }
    })
 
  }

  ngOnDestroy() {
    this.subscriptionName?.unsubscribe();
  }

  openAddNewAddressModal() {
    const modalRef = this._modalService.open(AddNewAddressComponent, {
      scrollable: true, size: 'lg', ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  onSelectOrderType(type: any) {
    this.orderType = type;
    if (this.orderType == 'S') {
      this.isShowDeliverySlot = false;
    }
  }


  checkout(amount: number) {
    // console.log(amount)
    var obj = {
      'orderType': this.orderType,
      'deliveryAddressId': this.objDeliveryAddressId,
      'deliveryDate': this.objDeliveryDate,
      'deliveryTime': this.objDeliveryTime,
      'cartItems': this.objCarttems
    }
    console.log(obj)
   // debugger
    this._commonService.sendUpdate({ type: 'isRequiredAddress', isRequired: obj.deliveryAddressId == 0 ? true : false })
    this._commonService.sendUpdate({ type: 'isRequiredDeliveryDate', isRequired: obj.deliveryDate == undefined ? true : false })
    this._commonService.sendUpdate({ type: 'isRequiredDeliveryTime', isRequired: obj.deliveryTime.startTime == '' ? true : false })
    if (this.orderType == "H" && (obj.deliveryAddressId == 0 || obj.deliveryDate == undefined || obj.deliveryTime.startTime == '')) {
      let errorMessage = 'Please fix the following:';
      let _timer: number = 10000;
      if (this.orderType == "H" && obj.deliveryAddressId == 0) {
        errorMessage += '</br> Select  a delivery address'
      }
      if (this.orderType == "H" && obj.deliveryDate == undefined && obj.deliveryAddressId > 0) {
        errorMessage += '</br> Select  a delivery date';
       // _timer = 10000;
      }
      if (this.orderType == "H" && obj.deliveryTime.startTime == '' && obj.deliveryAddressId > 0) {
        errorMessage += '</br> Select  a delivery time';
        //_timer = 10000;
      }
      this._notificationService.showError(errorMessage, 'Error', _timer);
    }
    else {
      const strikeCheckout = (<any>window).StripeCheckout.configure({
        key: 'pk_test_HZbmgwCyijQVEpDFcLByQmxS00HbZ8zbD8',
        locale: 'auto',
        token: function (stripeToken: any) {
          console.log(stripeToken)
          //alert('Stripe token generated!');
          let token: string = stripeToken.id;
          let email: string = stripeToken.email;
          // this.doPayment(token, email, amount);
          (<HTMLInputElement>document.getElementById('HToken')).value = token;
          (<HTMLInputElement>document.getElementById('HEmail')).value = email;

          var button: any = document.getElementById("payBtn");
          button.click();
        }
      });

      strikeCheckout.open({
        name: 'Payment',
        //description: 'Payment widgets',
        amount: amount * 100
      });
    }

  }

  doPayment() {
    let sToken: string = (<HTMLInputElement>document.getElementById('HToken')).value;
    let sEmail: string = (<HTMLInputElement>document.getElementById('HEmail')).value;
    let objUser: UserVM = this._commonService.getuserInfolocalStorage();
    let merged = {
      'OrderBy': objUser.userId,
      'OrderType': this.orderType,
      'DeliveryAddressId': this.objDeliveryAddressId,
      'DeliveryDate': this.objDeliveryDate,
      'DeliveryStartTime': this.objDeliveryTime.startTime,
      'DeliveryEndTime': this.objDeliveryTime.endTime,
      'TaxRate': this.objStoreVM.taxRate,
      'TaxAmount': this.objStoreVM.taxAmt,
      'DeliveryCharges': this.objStoreVM.deliveryCharges,
      'StripeToken': sToken,
      'StoreUserId': this.objStoreVM.userId,
      'Email': sEmail,
      'OrderDetails': this.objCarttems
    }
    console.log(merged)
    this._spinner.start();
    this._paymentService.saveOrder(merged).subscribe((res: any) => {
      this._spinner.stop();
      console.log(res)
      if (res.capturedId != '') {
        //this._cartService2.emptyCart();
       // localStorage.getItem("cartProducts")
        localStorage.removeItem("cartProducts");
        this._router.navigate(['/order-success'], { state: { res: res } });
      }
      else {
        this._notificationService.showError("An error ocurred", 'Error')
      }
    }, err => {
      this._spinner.stop();
      console.log(err)
      this._notificationService.showError(err.error, 'Error')
    });
  }

  stripePaymentGateway() {
    if (!window.document.getElementById('stripe-script')) {
      const scr = window.document.createElement("script");
      scr.id = "stripe-script";
      scr.type = "text/javascript";
      scr.src = "https://checkout.stripe.com/checkout.js";

      scr.onload = () => {
        this.strikeCheckout = (<any>window).StripeCheckout.configure({
          key: 'pk_test_HZbmgwCyijQVEpDFcLByQmxS00HbZ8zbD8',
          locale: 'auto',
          token: function (token: any) {
            console.log(token)
            debugger
            alert('Payment via stripe successfull!');
            this._router.navigate(['/order-success']);
          }
        });
      }
      window.document.body.appendChild(scr);
    }
  }


  stringToHTML(str: string) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
  };

}
