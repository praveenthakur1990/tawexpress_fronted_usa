import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from 'src/app/service/common.service';
import { NotificationService } from 'src/app/service/notification.service';
import { WeeklycircularService } from 'src/app/service/weeklycircular.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.sass']
})
export class OtpComponent implements OnInit {
  OTPForm: any = FormGroup; submitted = false;
  mobileNumber: string = ''; @Input() public callType: string = '';
  constructor(private _formBuilder: FormBuilder, private _spinner: NgxUiLoaderService, private _commonService: CommonService, private _weeklycircularService: WeeklycircularService, private _notificationService: NotificationService, private _router: Router) {
    var data: any = this._router.getCurrentNavigation()!.extras.state != undefined ? this._router.getCurrentNavigation()!.extras.state : '';
    if (data == '') {
      this._router.navigate(['subscriber/login']);
    }
    else {
      this.mobileNumber = data.mobileNumber;
    }
  }

  get o() { return this.OTPForm.controls; }
  ngOnInit(): void {
    this.OTPForm = this._formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(/\d/)]]
    });
  }


  verifyOTP() {
    this.submitted = true;
    if (this.OTPForm.invalid) {
      return;
    }
    else {
      this._spinner.start();
      var obj = {
        'OTP': this.OTPForm.value.otp,
        'mobileNumber': this.mobileNumber,
        'userId': this._commonService.getStoreInfolocalStorage().userId,
      }
      this._weeklycircularService.verifyWeeklyCircularSubscriber(obj).subscribe(
        data => {
          this._router.navigate(['subscriber/home'], { state: { isView: true } });
        }, err => {
          this._spinner.stop();
          this._notificationService.showError(err.error, 'Error')
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
