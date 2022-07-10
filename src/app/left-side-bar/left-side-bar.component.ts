import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject, Subscription } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { CategoryVm } from '../model/category-vm';
import { StoreVM } from '../model/store-vm';
import { RegisterComponent } from '../register/register.component';
import { AccountService } from '../service/account.service';
import { CategoryService } from '../service/category.service';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.sass']
})
export class LeftSideBarComponent implements OnInit {
  objCategory: Array<CategoryVm> = [];
  CategorySubject = new Subject<any>(); CategoryState = this.CategorySubject.asObservable();
  private subscription: Subscription | undefined; isCategoryShow = true;
  objStoreInfo: StoreVM = {};
  constructor(private _activeModal: NgbActiveModal, private _modalService: NgbModal, private _spinner: NgxUiLoaderService, private _notificationService: NotificationService, public _accountService: AccountService, private _router: Router, private _categoryService: CategoryService, private _commonService: CommonService) {
    this.getCategories();
    this.objStoreInfo = this._commonService.getStoreInfolocalStorage();
   }

  ngOnInit(): void {
    this.subscription = this.CategorySubject
      .subscribe((res: boolean) => {
        this.isCategoryShow = res;
      });
  }

  closeModal(sendData: any) {
    this._activeModal.close(sendData);
  }

  openLoginModal() {
    this._modalService.dismissAll();
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
    this._modalService.dismissAll();
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
        this._modalService.dismissAll();
        this._spinner.stop();
        localStorage.clear();
        this._router.navigate(['/']);
      }, (err: { error: { message: any; }; }) => {
        this._spinner.stop();
        this._notificationService.showError(err.error.message, 'Error')
      });
  }

  redirectToProfile() {
    this._modalService.dismissAll();
    this.CategorySubject.next(false)
    this._router.navigate(['/setting/my-account']);
  }

  redirectToSpecialOffer() {
    this._modalService.dismissAll();
    this._router.navigate(['/specialOffer']);
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

  redirectToProducts(catId:any){
    this._modalService.dismissAll();
    this._router.navigate(['/products', catId]);
  }

  redirectToDashboard() {
    this._modalService.dismissAll();
    this.CategorySubject.next(true)
    this._router.navigate(['/']);
  }
}
