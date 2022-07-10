import { Component, DebugElement, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { cartItem, ProductDashboardVM, ProductsData } from '../model/product-vm';
import { CartService2Service } from '../service/cart-service2.service';
import { CartService } from '../service/cart.service';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.sass']
})
export class ProductInfoComponent implements OnInit {
  addToCartForm: any = FormGroup; submitted = false; currencySymbol: string = '';
  @Input() public objProductInfo: ProductDashboardVM = {}; @Input() public objProductsData: ProductsData = {};
  objCartItem: cartItem = {}; @Input() public isWeeklyCircular!: boolean;
  minOrderAmt: number = 0; objProductDashboardVM: Array<ProductDashboardVM> = [];
  constructor(private _formBuilder: FormBuilder, public activeModal: NgbActiveModal, private _commonService: CommonService, private _cartService2: CartService2Service, private _notificationService: NotificationService, private _productService: ProductService, private _CartService2Service: CartService2Service, private _modalService: NgbModal) {
    this.currencySymbol = this._commonService.getStoreInfolocalStorage().currencySymbol || '';
    this.minOrderAmt = parseFloat(this._commonService.getStoreInfolocalStorage().minOrderAmt!);
  }

  ngOnInit(): void {
    //debugger
    console.log(this.objProductInfo)
    this.submitted = false;
    console.log(this.isWeeklyCircular)
    this.addToCartForm = this._formBuilder.group({
      qty: ['1', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]]
    });
    this.bindRelatedProducts(this.objProductInfo.id!, 4, this._commonService.getStoreInfolocalStorage().userId!);
  }

  get c() { return this.addToCartForm.controls; }

  closeModal(sendData: any) {
    this.activeModal.close(sendData);
  }

  onOptionsSelected(event: any) {
    const value = event.target.value;
    let data = this.objProductInfo.productVarients?.find(i => i.id === parseInt(value));
    this.objProductInfo.price = data?.price;
    this.objProductInfo.productName = data?.name;
    this.objProductInfo.defaultVarientId = data?.id;
  }

  addToCart() {
    this.submitted = true;
    if (this.addToCartForm.invalid) {
      return;
    }
    else {
      console.log(this.objProductInfo)
      this.objCartItem.productId = this.objProductInfo.id;
      this.objCartItem.productName = this.objProductInfo.productName;
      this.objCartItem.qty = this.addToCartForm.value.qty;
      this.objCartItem.price = this.objProductInfo.price;
      this.objCartItem.productImg = this.objProductInfo.productImage;
      this.objCartItem.productVarientId = this.objProductInfo.defaultVarientId;
      this.objCartItem.catId = this.objProductsData.categoryId;

      this.objCartItem.offerType = this.objProductInfo.offerType;
      this.objCartItem.offerValue = this.objProductInfo.offerValue;
      this.objCartItem.finalOfferValue = this.objProductInfo.finalOfferValue;
      this.objCartItem.finalValue = this.objProductInfo.finalValue;
      this._cartService2.addToCart(this.objCartItem);
      this._notificationService.showSuccess("Added to cart", "Success", 500);
      this.activeModal.close();
      this._commonService.sendUpdate({ 'type': 'addedCart', 'catId': this.objProductsData.categoryId, 'productId': this.objProductInfo.id });
    }
  }

  numberOnly($event: any): boolean {
    const charCode = ($event.which) ? $event.which : $event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  bindRelatedProducts(productId: number, limit: number = 0, userId: string) {
    //debugger
    this._productService.getRelatedProductById(productId, limit, userId).subscribe(
      data => {
        //console.log(data)
        this.objProductDashboardVM = data;
        // console.log(this.objProductDashboardVM)
        this.objProductsData = { categoryId: 0, categoryName: '', categoryImage: '', products: [] };
        this.objProductsData.categoryId = this.objProductDashboardVM[0].categoryId;
        this.objProductsData.categoryName = this.objProductDashboardVM[0].categoryName;
        this.objProductsData.categoryImage = this.objProductDashboardVM[0].categoryImage;
        //debugger
        for (let i = 0; i < this.objProductDashboardVM.length; i++) {
          var objData = {
            'id': this.objProductDashboardVM[i].id,
            'productName': this.objProductDashboardVM[i].productName,
            'productImage': this.objProductDashboardVM[i].productImage,
            'price': this.objProductDashboardVM[i].price,
            'isVarient': this.objProductDashboardVM[i].isVarient,
            'productVarients': this.objProductDashboardVM[i].productVarients,
            'defaultVarientId': this.objProductDashboardVM[i].defaultVarientId,
            'description': this.objProductDashboardVM[i].description,
            'isDescriptionShow': this.objProductDashboardVM[i].isDescriptionShow,
            'isAdded': this._CartService2Service.productExistInCart(this.objProductDashboardVM[i].id || 0)
          }
          this.objProductsData.products?.push(objData);
        }
        console.log(this.objProductsData)
      }, err => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  openProductInfoModalPopup(product: ProductDashboardVM, objCat: ProductsData) {
    this._modalService.dismissAll();
    if (this._commonService.getuserInfolocalStorage().userId != undefined) {
      const modalRef = this._modalService.open(ProductInfoComponent, {
        scrollable: true, size: 'lg', ariaLabelledBy: 'modal-basic-title',
        keyboard: false,
        backdrop: 'static'
      });
      modalRef.componentInstance.objProductInfo = product;
      modalRef.componentInstance.objProductsData = objCat;
      modalRef.result.then((result) => {
      }, (reason) => {
      });
    }
    else {
      const modalRef = this._modalService.open(LoginComponent, {
        scrollable: true, size: 'md', ariaLabelledBy: 'modal-basic-title',
        keyboard: false,
        backdrop: 'static'
      });
      modalRef.result.then((result) => {
      }, (reason) => {
      });
    }
  }
}
