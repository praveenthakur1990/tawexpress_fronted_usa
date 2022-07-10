import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductDashboardVM, ProductsData, SubCatProductsData } from '../model/product-vm';
import { ProductInfoComponent } from '../product-info/product-info.component';
import { CartService2Service } from '../service/cart-service2.service';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';
import { SpecialofferService } from '../service/specialoffer.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-special-offer',
  templateUrl: './special-offer.component.html',
  styleUrls: ['./special-offer.component.sass']
})
export class SpecialOfferComponent implements OnInit {
  currencySymbol: string = ''; objSpecialOfferDates: any = []; isShowPanel: boolean = false;
  activeSpecialOfferId: number = 0; objSpecialOfferInfo: any = {}; objCategoriesArr: any = [];
  objProductDashboardVM: Array<ProductDashboardVM> = []; objProductsData: SubCatProductsData = {}; objProductsDataList: Array<SubCatProductsData> = [];
  selectedItems: any = []; objSelectedCatgoresArr: any = []; dropdownSettings!: IDropdownSettings;
  objSpecialOfferBannerImg:string='';
  constructor(private _commonService: CommonService, private _spinner: NgxUiLoaderService, private _specialofferService: SpecialofferService, private _notificationService: NotificationService, private _CartService2Service: CartService2Service, private _modalService: NgbModal) {
    this.currencySymbol = this._commonService.getStoreInfolocalStorage().currencySymbol || '';
    this._spinner.start();
    this._specialofferService.getSpecialOfferDates(this._commonService.getStoreInfolocalStorage().userId || '').subscribe(res => {
      this.objSpecialOfferDates = res;
      if (this.objSpecialOfferDates.length > 0) {
        this.isShowPanel = true;
        this.activeSpecialOfferId = this.objSpecialOfferDates[0].id;
        this.objSpecialOfferBannerImg=this.objSpecialOfferDates[0].bannerImagePath==null ?'':this.objSpecialOfferDates[0].bannerImagePath;
        this.getSpecialOfferById(this._commonService.getStoreInfolocalStorage().userId || '', this.objSpecialOfferDates[0].id);
        this.getSpecialOfferProductsById('', this._commonService.getStoreInfolocalStorage().userId || '', this.objSpecialOfferDates[0].id);
        //console.log(this._commonService.getStoreInfolocalStorage().userId)
        this.getSpecialOfferProductCatgories(this._commonService.getStoreInfolocalStorage().userId || '', this.objSpecialOfferDates[0].id);
      }
      else {
        this._spinner.stop();
      }
    });
  }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      enableCheckAll: false
    };
  }

  getSpecialOfferById(userId: string, specialOfferId: number): any {
    this._specialofferService.getSpecialOfferInfoById(specialOfferId, 1, 1, userId).subscribe(
      data => {
        this._spinner.stop();
        this.objSpecialOfferInfo = data[0];
      }, err => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  getSpecialOfferProductsById(categoryId: string, userId: string, specialOfferId: number): any {
    this._specialofferService.getProductsBySpecialOfferIdAPPURL(categoryId, specialOfferId, userId).subscribe(
      data => {
        this.objProductDashboardVM = [];
        this.objProductsData.products = [];
        this.objProductsDataList = [];
        this._spinner.stop();
        this.objProductDashboardVM = data;
        this.objProductsData = { categoryId: 0, categoryName: '', subCategoryId: 0, subCategoryName: '', products: [] };
        this.objProductsData.categoryId = parseInt(categoryId);
        this.objProductsData.categoryName = this.objProductDashboardVM[0].categoryName;
        this.objProductsData.subCategoryId = this.objProductDashboardVM[0].subCategoryId;
        this.objProductsData.subCategoryName = this.objProductDashboardVM[0].subCategoryName;
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
            'weeklyCircularId': this.objProductDashboardVM[i].weeklyCircularId,
            'offerType': this.objProductDashboardVM[i].offerType,
            'offerValue': this.objProductDashboardVM[i].offerValue,
            'finalValue': this.objProductDashboardVM[i].finalValue,
            'finalOfferValue': this.objProductDashboardVM[i].finalOfferValue
          }
          this.objProductsData.products?.push(objData);
        }
        this.objProductsDataList.push(this.objProductsData);
      }, err => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  getSpecialOfferProductCatgories(userId: string, specialOfferId: number): any {
    this._specialofferService.getSpecialOfferProductCatgories(specialOfferId, userId).subscribe(
      data => {
        this._spinner.stop();
        this.objCategoriesArr = data;
        //console.log(this.objCategoriesArr);
      }, err => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  openProductInfoModalPopup(product: ProductDashboardVM, objCat: ProductsData) {
    const modalRef = this._modalService.open(ProductInfoComponent, {
      scrollable: true, size: 'lg', ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.componentInstance.objProductInfo = product;
    modalRef.componentInstance.objProductsData = objCat;
    modalRef.componentInstance.isWeeklyCircular = true;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  bindProducts(event: any) {
    this.objProductDashboardVM = [];
    this.objProductsData.products = [];
    this.objProductsDataList = [];
    if (parseInt(event.target.value) > 0) {
      this.activeSpecialOfferId = parseInt(event.target.value);
      this.selectedItems = [];
      this.getSpecialOfferProductsById('', this._commonService.getStoreInfolocalStorage().userId || '', parseInt(event.target.value))
      this.getSpecialOfferById(this._commonService.getStoreInfolocalStorage().userId || '', parseInt(event.target.value));
      this.getSpecialOfferProductCatgories(this._commonService.getStoreInfolocalStorage().userId || '', parseInt(event.target.value));
    }
  }

  onItemDeSelect(item: any) {
    this.objSelectedCatgoresArr = this.objSelectedCatgoresArr.filter((obj: any) => obj !== item.id);
    this.getSpecialOfferProductsById(this.objSelectedCatgoresArr.toString(), this._commonService.getStoreInfolocalStorage().userId || '', this.activeSpecialOfferId)
  }

  onItemSelect(item: any) {
    this.objSelectedCatgoresArr.push(item.id);
    this.getSpecialOfferProductsById(this.objSelectedCatgoresArr.toString(), this._commonService.getStoreInfolocalStorage().userId || '', this.activeSpecialOfferId)
  }
}
