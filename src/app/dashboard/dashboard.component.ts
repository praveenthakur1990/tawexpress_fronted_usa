import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoginComponent } from '../login/login.component';
import { CategoryVm } from '../model/category-vm';
import { ProductDashboardVM, ProductsData } from '../model/product-vm';
import { StoreVM } from '../model/store-vm';
import { ProductInfoComponent } from '../product-info/product-info.component';
import { AccountService } from '../service/account.service';
import { CartService2Service } from '../service/cart-service2.service';
import { CategoryService } from '../service/category.service';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  objCategory: Array<CategoryVm> = []; objProductDashboardVM: Array<ProductDashboardVM> = []; objProductsDataList: Array<ProductsData> = []; objProductsData: ProductsData = {};
  closeResult: string | undefined;
  currencySymbol: string = '';
  objProductInfo: ProductDashboardVM = {}; submitted = false;
  addToCartForm: any = FormGroup;
  isClosed: boolean = false;
  objStoreInfo: StoreVM = {};
  isbannerList: boolean = false;
  isAdvList:boolean=false;
  constructor(private _commonService: CommonService, private _categoryService: CategoryService, private _productService: ProductService, private _modalService: NgbModal, private _spinner: NgxUiLoaderService, private _notificationService: NotificationService, private _CartService2Service: CartService2Service, public _accountService: AccountService) {
    this._spinner.start()
    this.getCategories();
    this.objStoreInfo = this._commonService.getStoreInfolocalStorage();
    this.currencySymbol = this.objStoreInfo.currencySymbol || '';
    this._spinner.stop()
    this.isbannerList = this.objStoreInfo.bannerList?.length || 0 > 0 ? true : false;
    this.isAdvList = this.objStoreInfo.advImgList?.length || 0 > 0 ? true : false;
    //debugger
    //this.isClosed = this._commonService.getStoreInfolocalStorage().businessHours?.isClosed || false;
    this.isClosed = false;
  }

  ngOnInit(): void {
    this._commonService.getUpdate().subscribe(res => {
      if (res.text.type == 'addedCart') {
        let catId = res.text.catId;
        let productId = res.text.productId;
        //this.getProducts(catId || 0, 6, this._commonService.getStoreInfolocalStorage().userId || '');
        console.log(this.objProductsDataList)
        let catIndex = this.objProductsDataList?.findIndex((d => d.categoryId == catId));
        let productIndex = this.objProductsDataList[catIndex]?.products?.findIndex((d => d.id == productId));
        //debugger
        this.objProductsDataList[catIndex]?.products?.forEach(res => {
          if (res.id == productId) {
            res.isAdded = true;
          }
        })
      }

      if (res.text.type == 'deletedCart') {
        let catId = res.text.catId;
        let productId = res.text.productId;
        //this.getProducts(catId || 0, 6, this._commonService.getStoreInfolocalStorage().userId || '');
        console.log(this.objProductsDataList)
        let catIndex = this.objProductsDataList?.findIndex((d => d.categoryId == catId));
        let productIndex = this.objProductsDataList[catIndex]?.products?.findIndex((d => d.id == productId));
        // debugger
        this.objProductsDataList[catIndex]?.products?.forEach(res => {
          if (res.id == productId) {
            res.isAdded = false;
          }
        })
      }
    });
  }


  get c() { return this.addToCartForm.controls; }

  getCategories() {
    this._categoryService.getCategories(this._commonService.getStoreInfolocalStorage().userId || '').subscribe(
      data => {
        this.objCategory = data;
        for (let i = 0; i < this.objCategory.length; i++) {
          this.getProducts(this.objCategory[i].id || 0, 18, this._commonService.getStoreInfolocalStorage().userId || '');
        }
      }, err => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  getProducts(categoryId: number, limit: number = 0, userId: string): any {
    this._productService.getProductForDashboard(categoryId, limit, userId).subscribe(
      data => {
        //console.log(data)
        this.objProductDashboardVM = data;
        // console.log(this.objProductDashboardVM)
        this.objProductsData = { categoryId: 0, categoryName: '', categoryImage: '', products: [] };
        this.objProductsData.categoryId = categoryId;
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
            'isAdded': this._CartService2Service.productExistInCart(this.objProductDashboardVM[i].id || 0),
            'offerType': this.objProductDashboardVM[i].offerType,
            'offerValue': this.objProductDashboardVM[i].offerValue,
            'finalValue': this.objProductDashboardVM[i].finalValue,
            'finalOfferValue': this.objProductDashboardVM[i].finalOfferValue
          }
          this.objProductsData.products?.push(objData);
        }
        this.objProductsDataList.push(this.objProductsData);
        //console.log(this.objProductsDataList)
      }, err => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  openProductInfoModalPopup(product: ProductDashboardVM, objCat: ProductsData) {
    this._accountService.isLoggedIn$?.subscribe(res => {
      if (res == true) {
        // debugger
        this._modalService.dismissAll();
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
    })
  }
}
