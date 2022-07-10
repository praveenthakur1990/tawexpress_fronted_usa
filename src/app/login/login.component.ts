import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OtpComponent } from '../otp/otp.component';
import { RegisterComponent } from '../register/register.component';
import { AccountService } from '../service/account.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  loginForm: any = FormGroup; submitted = false; returnUrl: string | undefined;
  constructor(private _formBuilder: FormBuilder, private _activeModal: NgbActiveModal, private _modalService: NgbModal, private _accountService: AccountService, private _notificationService: NotificationService, private _spinner: NgxUiLoaderService,  private route: ActivatedRoute,) { }

  get l() { return this.loginForm.controls; }
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      // mobileNumber: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(/\d/)]]
      mobileNumber: ['', [Validators.required]]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  closeModal(sendData: any) {
    this._activeModal.close(sendData);
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    else {
      this._spinner.start();
      this._activeModal.close();
      this.generateOTP(this.loginForm.value.mobileNumber);
    }
  }

  openRegisterModal() {
    this._modalService.dismissAll();
    const modalRef = this._modalService.open(RegisterComponent, {
      scrollable: true, size: 'md', ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  generateOTP(mobileNumber: string) {
    this._accountService.generateOTP(mobileNumber).subscribe(
      data => {
        console.log('otp: ' + data)
        this._spinner.stop();
        this.submitted = false;
        this.openOTPModal(mobileNumber);
      }, err => {
        this._spinner.stop();
        this._notificationService.showError(err.error, 'Error')
      });
  }

  openOTPModal(mobileNumber: string) {
    this._modalService.dismissAll();
    const modalRef = this._modalService.open(OtpComponent, {
      scrollable: true, size: 'md', ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.componentInstance.mobileNumber = mobileNumber;
    modalRef.componentInstance.callType = 'login';
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
