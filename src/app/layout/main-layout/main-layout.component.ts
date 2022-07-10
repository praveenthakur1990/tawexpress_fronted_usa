import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryVm } from 'src/app/model/category-vm';
import { cartItem, ProductDashboardVM } from 'src/app/model/product-vm';
import { StoreVM } from 'src/app/model/store-vm';
import { CategoryService } from 'src/app/service/category.service';
import { CommonService } from 'src/app/service/common.service';
import { NotificationService } from 'src/app/service/notification.service';
import { FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/service/account.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserVM } from 'src/app/model/user-vm';
import { LoginComponent } from 'src/app/login/login.component';
import { RegisterComponent } from 'src/app/register/register.component';
import { CartService } from 'src/app/service/cart.service';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CartService2Service } from 'src/app/service/cart-service2.service';
import { ProductService } from 'src/app/service/product.service';
import { LeftSideBarComponent } from 'src/app/left-side-bar/left-side-bar.component';
import { ChangepasswordComponent } from 'src/app/changepassword/changepassword.component';
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.sass']
})
export class MainLayoutComponent implements OnInit {
  subdomain = ''; isLoading = true;
  objStoreInfo: StoreVM = {}; objCategory: Array<CategoryVm> = []; objProductDashboardVM: Array<ProductDashboardVM> = []; objProductsByCategory: Array<any> = [];
  copyRightYer: number = new Date().getFullYear();
  closeResult: string | undefined;
  loginForm: any = FormGroup; registerForm: any = FormGroup; OTPForm: any = FormGroup; submitted = false;
  objUser: UserVM = { ".issued": '', ".expires": '' };
  isLoggedIn = false;
  @Input() product: cartItem | undefined;
  private subscription: Subscription | undefined;
  objCarttems: Array<cartItem> = [];
  totalCartItemCount = 0;
  isCategoryShow = true;
  CategorySubject = new Subject<any>(); CategoryState = this.CategorySubject.asObservable();
  @ViewChild('openCart') openCart: ElementRef | undefined;
  @ViewChild('closeCart') closeCart: ElementRef | undefined;
  public shoppingCartItems$: Observable<cartItem[]> = of([]);
  keyword: any = 'name'; objProductArr: any = [];
  public shoppingCartItems: cartItem[] = []; currencySymbol = ''; totalAmt = 0;
  constructor(private _commonService: CommonService, private _categoryService: CategoryService, private _modalService: NgbModal, private _notificationService: NotificationService, private _cartService: CartService, private _cartService2: CartService2Service, public _accountService: AccountService, private _spinner: NgxUiLoaderService, private _router: Router, private renderer: Renderer2, private _productService: ProductService) {
    //debugger
    this.objStoreInfo = this._commonService.getStoreInfolocalStorage();
    this.getCategories();
    //this.checkUserLoggedIn();
    this.calculateTotalAmt();
    if (this._router.url == '/setting/my-account' || this._router.url == '/setting/my-orders' || this._router.url == '/setting/delivery-addresses' || this._router.url == '/order-success') {
      this.isCategoryShow = false;
    }
    this.currencySymbol = this._commonService.getStoreInfolocalStorage().currencySymbol || '';
  }

  ngOnInit(): void {
    this.subscription = this.CategorySubject
      .subscribe((res: boolean) => {
        this.isCategoryShow = res;
      });

  }

  selectEvent(item: any) {
    // this._spinner.start();
    //debugger
    localStorage.setItem('searchedProduct', JSON.stringify(item));
    this._router.navigate(['products', item.categoryId], { state: { searchedProduct: item, type: 'search' } });
  }

  onFocused(item: any) {
    // do something with selected item
  }

  onChangeSearch(item: any) {
    this.getProductBySearch(item);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    if (window.pageYOffset > 100) {
      let element = document.getElementById('navbar');
      element?.classList.add('sticky');
    } else {
      let element = document.getElementById('navbar');
      element?.classList.remove('sticky');
    }
  }

  calculateTotalAmt() {
    this._cartService2.getItems().subscribe((res: any) => {
      //debugger
      this.objCarttems = res.length > 0 ? res[0] : [];
      //console.log(this.objCarttems)
      if (this.objCarttems != null && this.objCarttems.length > 0) {
        this.totalAmt = 0;
        this.totalCartItemCount = this.objCarttems.length;
        for (let i = 0; i < this.objCarttems.length; i++) {
          ////debugger
          this.totalAmt += this.objCarttems[i].totalPrice || 0;
          this.totalAmt = parseFloat(this.totalAmt.toFixed(2));
        }
      }
      else {
        this.objCarttems = [];
        this.totalAmt = 0;
        this.totalCartItemCount = 0;
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  get l() { return this.loginForm.controls; }
  get r() { return this.registerForm.controls; }
  get o() { return this.OTPForm.controls; }



  checkUserLoggedIn() {
    var userInfo = this._commonService.getuserInfolocalStorage();
    if (userInfo.userId != undefined) {
      this.calculateTotalAmt();
      this.objUser = userInfo;
      this.isLoggedIn = true;
      var tokenExpireUnixTimeZero = Date.parse(userInfo['.expires']);
      var currentUTCUnixTimeZero = Date.parse(new Date().toISOString());
      if (currentUTCUnixTimeZero > tokenExpireUnixTimeZero) {
        // debugger
        this._accountService.validateUserByRefreshToken().subscribe(res => {
          // console.log(res)
          this.objUser = res;
          this._commonService.setuserInfolocalStorage(this.objUser);
          window.location.reload();
        }, err => {
          //debugger
          localStorage.clear();
          this._router.parseUrl("/");
        });
      }
    }
    else {
      this.isLoggedIn = false;
    }
  }

  getCategories() {
    //console.log(this._commonService.getStoreInfolocalStorage())
    this._categoryService.getCategories(this._commonService.getStoreInfolocalStorage().userId || '').subscribe(
      (data: any) => {
        this.objCategory = data;
        //console.log(this.objCategory)
      }, (err: { message: any; }) => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  openLoginModal() {
    const modalRef = this._modalService.open(LoginComponent, {
      scrollable: true, size: 'md', ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.result.then((result: any) => {
    }, (reason: any) => {
    });
  }

  openRegisterModal() {
    const modalRef = this._modalService.open(RegisterComponent, {
      scrollable: true, size: 'md', ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.result.then((result: any) => {
    }, (reason: any) => {
    });
  }

  logout() {
    this._spinner.start();
    this._accountService.logout().subscribe(
      (data: any) => {
        this._spinner.stop();
        localStorage.clear();
        window.location.href = '/';
      }, (err: { error: { message: any; }; }) => {
        this._spinner.stop();
        this._notificationService.showError(err.error.message, 'Error')
      });
  }

  redirectToProfile() {
    this.CategorySubject.next(false)
    this._router.navigate(['/setting/my-account']);

  }

  redirectToDashboard() {
    this.CategorySubject.next(true)
    this._router.navigate(['/']);
  }

  openNav() {
    this.renderer.setStyle(this.openCart?.nativeElement, 'width', '450px');
  }

  closeNav() {
    this.renderer.setStyle(this.openCart?.nativeElement, 'width', '0');
  }

  removeItemFromCart(objCart: cartItem, index: number) {
    this._cartService2.removeFromCart(objCart, index);
    this._commonService.sendUpdate({ 'type': 'deletedCart', 'catId': objCart.catId, 'productId': objCart.productId });
    // this._cartService.removeProduct(cart.productId || 0);
  }

  redirectToCheckout() {
    this._router.navigate(['/checkout']);
    this.closeNav();
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onSearchChange($event: any, objCartItem: cartItem, index: number): void {
    let inputQty = 0;
    //console.log($event.target.value);
    inputQty = $event.target.value == '' || $event.target.value == '0' ? 1 : parseInt($event.target.value);
    // debugger 
    $event.target.value = $event.target.value == '' || $event.target.value == '0' ? 1 : $event.target.value;

    let amt = inputQty * Number(((objCartItem.offerType == "2" || objCartItem.offerType == "1") ? parseFloat(objCartItem.finalValue!) : objCartItem.price || 0));
    objCartItem.qty = inputQty;
    objCartItem.totalPrice = parseFloat(amt.toFixed(2));
    this._cartService2.updateCartQty(objCartItem, index);
  }

  getProductBySearch(searchStr: string) {
    this.objProductArr = [];
    this._productService.getProductBySearchStr(searchStr, this._commonService.getStoreInfolocalStorage().userId || '').subscribe(
      (data: any) => {
        this.objProductArr = data;
        // debugger
        console.log(this.objProductArr)
      }, (err: { message: any; }) => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  openLeftSidebarModal() {
    const modalRef = this._modalService.open(LeftSideBarComponent, {
      scrollable: true, size: 'md', ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static',
      windowClass: 'left'
    });
    modalRef.result.then((result: any) => {
    }, (reason: any) => {
    });
  }

 
}