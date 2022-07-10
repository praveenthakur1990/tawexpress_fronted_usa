import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductDashboardVM, ProductsData, SubCatProductsData } from '../model/product-vm';
import { ProductInfoComponent } from '../product-info/product-info.component';
import { CartService2Service } from '../service/cart-service2.service';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';
import { WeeklycircularService } from '../service/weeklycircular.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-weeklycircular',
  templateUrl: './weeklycircular.component.html',
  styleUrls: ['./weeklycircular.component.sass']
})
export class WeeklycircularComponent implements OnInit {
  objProductDashboardVM: Array<ProductDashboardVM> = []; objProductsData: SubCatProductsData = {}; objProductsDataList: Array<SubCatProductsData> = [];
  currencySymbol: string = ''; objWeeklyCircularDates: any = []; objWeeklyCircularInfo: any = {};
  pdfFilePath: string = ''; objCategoriesArr: any = [];
  dropdownList: any = [];
  selectedItems: any = []; dropdownSettings!: IDropdownSettings;
  objSelectedCatgoresArr: any = [];
  activeWeeklyCircularId: number = 0;
  isShowPanel: boolean = false;
  constructor(private _CartService2Service: CartService2Service, private _notificationService: NotificationService, private _commonService: CommonService, private _spinner: NgxUiLoaderService, private _modalService: NgbModal, private _weeklycircularService: WeeklycircularService) {
    this.currencySymbol = this._commonService.getStoreInfolocalStorage().currencySymbol || '';
    this._spinner.start();
    this._weeklycircularService.getWeeklyCircularDates(this._commonService.getStoreInfolocalStorage().userId || '').subscribe(res => {
      this.objWeeklyCircularDates = res;
      if (this.objWeeklyCircularDates.length > 0) {
        this.isShowPanel = true;
        this.activeWeeklyCircularId = this.objWeeklyCircularDates[0].id;
        this.getWeeklyCircularById(this._commonService.getStoreInfolocalStorage().userId || '', this.objWeeklyCircularDates[0].id);
        this.getWeeklyCircularProductsById('', this._commonService.getStoreInfolocalStorage().userId || '', this.objWeeklyCircularDates[0].id)
        this.getWeeklyCircularProductCatgories(this._commonService.getStoreInfolocalStorage().userId || '', this.objWeeklyCircularDates[0].id);
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

  onItemSelect(item: any) {
    this.objSelectedCatgoresArr.push(item.id);
    this.getWeeklyCircularProductsById(this.objSelectedCatgoresArr.toString(), this._commonService.getStoreInfolocalStorage().userId || '', this.activeWeeklyCircularId)
  }

  onItemDeSelect(item: any) {
    this.objSelectedCatgoresArr = this.objSelectedCatgoresArr.filter((obj: any) => obj !== item.id);
    this.getWeeklyCircularProductsById(this.objSelectedCatgoresArr.toString(), this._commonService.getStoreInfolocalStorage().userId || '', this.activeWeeklyCircularId)
  }

  getWeeklyCircularProductsById(categoryId: string, userId: string, weeklyCircularId: number): any {
    this._weeklycircularService.getProductsByWeeklyCircularIdAPPURL(categoryId, weeklyCircularId, userId).subscribe(
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
        this.objProductsDataList.push(this.objProductsData)
        //console.log(this.objProductsDataList)
      }, err => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  getWeeklyCircularProductCatgories(userId: string, weeklyCircularId: number): any {
    this._weeklycircularService.getWeeklyCircularProductCatgories(weeklyCircularId, userId).subscribe(
      data => {
        this._spinner.stop();
        this.objCategoriesArr = data;
        console.log(this.objCategoriesArr);
      }, err => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  getWeeklyCircularById(userId: string, weeklyCircularId: number): any {
    this._weeklycircularService.getWeeklyCircularInfoById(weeklyCircularId, 1, 1, userId).subscribe(
      data => {
        this._spinner.stop();
        this.objWeeklyCircularInfo = data[0];
        this.pdfFilePath = this.objWeeklyCircularInfo.pdfFilePath;
      }, err => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  bindProducts(event: any) {
    this.objProductDashboardVM = [];
    this.objProductsData.products = [];
    this.objProductsDataList = [];
    if (parseInt(event.target.value) > 0) {
      this.activeWeeklyCircularId = parseInt(event.target.value);
      this.selectedItems = [];
      this.getWeeklyCircularProductsById('', this._commonService.getStoreInfolocalStorage().userId || '', parseInt(event.target.value))
      this.getWeeklyCircularById(this._commonService.getStoreInfolocalStorage().userId || '', parseInt(event.target.value));
      this.getWeeklyCircularProductCatgories(this._commonService.getStoreInfolocalStorage().userId || '', parseInt(event.target.value));
    }
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
}
