import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoginComponent } from '../login/login.component';
import { BrandVM } from '../model/brand-vm';
import { CategoryVm } from '../model/category-vm';
import { ProductDashboardVM, ProductsData, SubCatProductsData } from '../model/product-vm';
import { ProductInfoComponent } from '../product-info/product-info.component';
import { AccountService } from '../service/account.service';
import { BrandService } from '../service/brand.service';
import { CartService2Service } from '../service/cart-service2.service';
import { CategoryService } from '../service/category.service';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {
  categoryId: number = 0; objProductDashboardVM: Array<ProductDashboardVM> = []; objSubcat: Array<CategoryVm> = []; objBrandVM: Array<BrandVM> = []; objProductsDataList: Array<SubCatProductsData> = []; objProductsData: SubCatProductsData = {};
  selectedSubCatId: Array<number> = []; selectedBrandId: Array<number> = [];
  closeResult: string | undefined; currencySymbol: string = '';
  objProductInfo: ProductDashboardVM = {}; submitted = false;
  addToCartForm: any = FormGroup; isClosed: boolean = false;
  IsShowFilter: boolean = true; searchedProduct: any = {};
  objCatdata: ProductsData = {};
  objCategoryImg: string = '';
  constructor(private _Activatedroute: ActivatedRoute, private _commonService: CommonService, private _categoryService: CategoryService, private _productService: ProductService, private _brandService: BrandService, private _modalService: NgbModal, private _spinner: NgxUiLoaderService, private _notificationService: NotificationService, private _formBuilder: FormBuilder, private _router: Router, private _CartService2Service: CartService2Service, public _accountService: AccountService) {
    this.currencySymbol = this._commonService.getStoreInfolocalStorage().currencySymbol || '';
    this._spinner.start();
    this.isClosed = this._commonService.getStoreInfolocalStorage().businessHours?.isClosed || false;
  }

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe(params => {
      // console.log(localStorage.getItem('searchedProduct'))
      if (localStorage.getItem('searchedProduct') != null) {
        const prod = JSON.parse(localStorage.getItem('searchedProduct') || '{}');
        // debugger
        var objData = {
          'id': prod.id,
          'productName': prod.name,
          'productImage': prod.image,
          'price': prod.price,
          'isVarient': prod.isVariants,
          //'productVarients': prod.productVarients,
          //'defaultVarientId': prod.defaultVarientId,
          'description': prod.description,
          'isDescriptionShow': prod.isDescriptionShow,
          'isAdded': this._CartService2Service.productExistInCart(prod.id || 0)
        }
        this.searchedProduct = objData;
        if (this.searchedProduct != undefined && this.searchedProduct != null) {
          this.objCatdata.categoryName = prod.categoryName;
          this.objCatdata.categoryId = prod.categoryId;
          this.IsShowFilter = false;
        }
      }

      //  debugger
      this.categoryId = parseInt(params.get('id') || '0');
      //console.log(this.categoryId);
      this.objProductDashboardVM = [];
      this.objProductsData = {};
      this.objProductsDataList = [];

      this.getSubCategories(this.categoryId, this._commonService.getStoreInfolocalStorage().userId || '');
      this.getBrands(this.categoryId, '', this._commonService.getStoreInfolocalStorage().userId || '');
      this._spinner.stop();
      localStorage.removeItem('searchedProduct')

      this._commonService.getUpdate().subscribe(res => {
        if (res.text.type == 'addedCart') {
          //debugger
          let catId = res.text.catId;
          let productId = res.text.productId;
          //this.getProducts(catId || 0, 6, this._commonService.getStoreInfolocalStorage().userId || '');
          console.log(this.objProductsDataList)
          let catIndex = this.objProductsDataList?.findIndex((d => d.categoryId == catId));
          let productIndex = this.objProductsDataList[catIndex]?.products?.findIndex((d => d.id == productId));
          //debugger
          this.objProductsDataList.forEach(res => {
            if (res.products?.length || 0 > 0) {
              res.products?.forEach(prod => {
                if (prod.id == productId) {
                  prod.isAdded = true;
                }
              })
            }
          });

          if (this.searchedProduct.id == productId) {
            //  debugger
            this.searchedProduct.isAdded = true;
          }
        }

        if (res.text.type == 'deletedCart') {
          let catId = res.text.catId;
          let productId = res.text.productId;
          //this.getProducts(catId || 0, 6, this._commonService.getStoreInfolocalStorage().userId || '');
          console.log(this.objProductsDataList)
          let catIndex = this.objProductsDataList?.findIndex((d => d.categoryId == catId));
          let productIndex = this.objProductsDataList[catIndex]?.products?.findIndex((d => d.id == productId));
          //  debugger
          this.objProductsDataList.forEach(res => {
            if (res.products?.length || 0 > 0) {
              res.products?.forEach(prod => {
                if (prod.id == productId) {
                  prod.isAdded = false;
                }
              })
            }
          });

          if (this.searchedProduct.id == productId) {
            //debugger
            this.searchedProduct.isAdded = false;
          }
        }
      });
    });
  }

  get c() { return this.addToCartForm.controls; }

  getSubCategories(categoryId: number, userId: string): any {
    this._spinner.start();
    this._categoryService.getSubCategories(categoryId, userId).subscribe(
      data => {
        this.objSubcat = data;
        for (let i = 0; i < this.objSubcat.length; i++) {
          this.objSubcat[i].checked = false;
          this.getProductsByCategoryId(this.categoryId.toString(), this.objSubcat[i].id?.toString(), '', this._commonService.getStoreInfolocalStorage().userId || '');
        }
      }, err => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  getProductsByCategoryId(categoryId: string, subCategoryIds: string = '', brandIds: string = '', userId: string): any {
    this._productService.getProductByCategoryId(categoryId, subCategoryIds, brandIds, userId).subscribe(
      data => {
        this.objProductDashboardVM = data;
        this.objCategoryImg = this.objProductDashboardVM[0].bannerImg || '';
        //console.log(this.objCategoryImg)
        if (this.objProductDashboardVM.length > 0) {
          this.objProductsData = { categoryId: 0, categoryName: '', subCategoryId: 0, subCategoryName: '', products: [] };
          this.objProductsData.categoryId = parseInt(categoryId);
          this.objProductsData.categoryName = this.objProductDashboardVM[0].categoryName;
          this.objProductsData.subCategoryId = this.objProductDashboardVM[0].subCategoryId;
          this.objProductsData.subCategoryName = this.objProductDashboardVM[0].subCategoryName;
          //debugger
          for (let i = 0; i < this.objProductDashboardVM.length; i++) {
            if (this.searchedProduct != null && parseInt(this.searchedProduct.id) != this.objProductDashboardVM[i].id) {
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
          }
          this.objProductsDataList.push(this.objProductsData)
        }
        //console.log(this.objProductsDataList)
      }, err => {
        this._notificationService.showError(err.message, 'Error', 3000)
      });
  }

  getBrands(categoryId: number, subCategoryIds: string, userId: string): any {
    this._brandService.getBrands(categoryId, subCategoryIds, userId).subscribe(
      data => {
        this.objBrandVM = data;
        //console.log(this.objBrandVM)
        // this.selectedBrandId=[];
      }, err => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  onSubCatSelect(eve: number) {
    this._spinner.start();
    this.objSubcat.filter((value, index) => {
      if (value.id == eve && value.checked == false) {
        value.checked = true;
      }
      else if (value.id == eve && value.checked == true) {
        value.checked = false;
      }
    });
    this.getSelectedSubCatIds();
    this._spinner.stop();
  }

  getSelectedSubCatIds(): void {
    this.selectedSubCatId = [];
    this.objSubcat.filter((value, index) => {
      if (value.checked == true) {
        this.selectedSubCatId.push(value.id || 0)
      }
    });
    this.objProductsDataList = [];
    this.getBrands(this.categoryId, this.selectedSubCatId.toString(), this._commonService.getStoreInfolocalStorage().userId || '');
    if (this.selectedSubCatId.length > 0) {
      //  console.log(this.selectedBrandId.toString())
      this.selectedBrandId = [];
      for (let i = 0; i < this.selectedSubCatId.length; i++) {
        //debugger
        this.getProductsByCategoryId(this.categoryId.toString(), this.selectedSubCatId[i].toString(), this.selectedBrandId.toString(), this._commonService.getStoreInfolocalStorage().userId || '');
      }
      // this.getBrands(this.categoryId, this.selectedSubCatId.toString(), this._commonService.getStoreInfolocalStorage().userId || '');
    }
    else {
      this.getSubCategories(this.categoryId, this._commonService.getStoreInfolocalStorage().userId || '');
    }

  }

  onBrandSelect(eve: number) {
    this._spinner.start();
    this.objBrandVM.filter((value, index) => {
      if (value.id == eve && value.checked == false) {
        value.checked = true;
      }
      else if (value.id == eve && value.checked == true) {
        value.checked = false;
      }
    });
    this.getSelectedBrandIds();
    this._spinner.stop();
  }

  getSelectedBrandIds(): void {
    // debugger
    this.selectedBrandId = [];
    this.objBrandVM.filter((value, index) => {
      if (value.checked == true) {
        this.selectedBrandId.push(value.id || 0)
      }
    });

    this.objProductsDataList = [];
    if (this.selectedBrandId.length > 0) {
      this.getProductsByCategoryId(this.categoryId.toString(), this.selectedSubCatId.length > 0 ? this.selectedSubCatId.toString() : '', this.selectedBrandId.toString(), this._commonService.getStoreInfolocalStorage().userId || '');
      // for (let i = 0; i < this.selectedBrandId.length; i++) {
      //  //this.getSubCategories(this.categoryId,this._commonService.getStoreInfolocalStorage().userId || '');
      // }
    }
  }

  openProductInfoModalPopup(product: ProductDashboardVM, objCat: ProductsData) {
    this._accountService.isLoggedIn$?.subscribe(res => {
      if (res == true) {
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
    });
  }
}
