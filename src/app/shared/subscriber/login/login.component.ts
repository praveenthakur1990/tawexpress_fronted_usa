import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from 'src/app/service/common.service';
import { NotificationService } from 'src/app/service/notification.service';
import { WeeklycircularService } from 'src/app/service/weeklycircular.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  loginForm: any = FormGroup; submitted = false;
  constructor(private _formBuilder: FormBuilder, private _spinner: NgxUiLoaderService, private _notificationService: NotificationService, private _router: Router, private _commonService: CommonService, private _weeklycircularService: WeeklycircularService) { }

  get r() { return this.loginForm.controls; }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      mobileNumber: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(/\d/)]]
    });
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    else {
      this.submitted = false;
      this._spinner.start();
      var obj = {
        'mobileNumber': this.loginForm.value.mobileNumber,
        'userId': this._commonService.getStoreInfolocalStorage().userId,
      }
      this._weeklycircularService.ValidateSubscriber(obj).subscribe(
        data => {
          this.submitted = false;
          this._spinner.stop();
          console.log(data);
          if (data == -1) {
            this._notificationService.showError("This mobile number doesn't exist", 'Error', 3000);
          }
          if (data == 1) {
            //this._router.navigate(['subscriber/otp'], { state: { mobileNumber: this.loginForm.value.mobileNumber } });
            this._router.navigate(['subscriber/home'], { state: { isView: true } });
          }

        }, err => {
          this._spinner.stop();
          this._notificationService.showError(err.error, 'Error', 2000)
        });
    }
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
