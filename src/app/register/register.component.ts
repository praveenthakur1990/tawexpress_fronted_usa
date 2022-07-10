import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoginComponent } from '../login/login.component';
import { OtpComponent } from '../otp/otp.component';
import { AccountService } from '../service/account.service';
import { CategoryService } from '../service/category.service';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  registerForm: any = FormGroup; submitted = false;
  constructor(private _commonService: CommonService, private _modalService: NgbModal, private _notificationService: NotificationService, private _formBuilder: FormBuilder, private _accountService: AccountService, private _spinner: NgxUiLoaderService, private _activeModal: NgbActiveModal) { }

  get r() { return this.registerForm.controls; }
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      mobileNumber: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(/\d/)]],
      userId: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(4)]]
    });
  }
 
  register() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    else {
      this._spinner.start();
      var obj = {
        'userId': this.registerForm.value.userId,
        'FirstName': this.registerForm.value.firstName,
        'LastName': this.registerForm.value.lastName,
        'Email': this.registerForm.value.email,
        'MobileNumber': this.registerForm.value.mobileNumber,
        'Password': '@Password3',
        'ConfirmPassword': '@Password3',
        'RoleName': 'User',
        'CreatedBy': this._commonService.getStoreInfolocalStorage().userId,
      }
      this._accountService.register(obj).subscribe(
        data => {
          this.submitted = false;
          this._spinner.stop();
          this._activeModal.close();
          this.openOTPModal(this.registerForm.value.userId);
        }, err => {
          this._spinner.stop();
          this._notificationService.showError(err.error, 'Error', 2000)
        });
    }
  }

  openLoginModal() {
    this._modalService.dismissAll();
    const modalRef = this._modalService.open(LoginComponent, {
      scrollable: true, size: 'md', ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  closeModal(sendData: any) {
    this._activeModal.close(sendData);
  }

  openOTPModal(mobileNumber: string) {
    this._modalService.dismissAll();
    const modalRef = this._modalService.open(OtpComponent, {
      scrollable: true, size: 'md', ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.componentInstance.mobileNumber = mobileNumber;
    modalRef.componentInstance.callType = 'register';
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

