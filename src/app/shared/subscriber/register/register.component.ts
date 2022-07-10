import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from 'src/app/service/common.service';
import { NotificationService } from 'src/app/service/notification.service';
import { WeeklycircularService } from 'src/app/service/weeklycircular.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  registerForm: any = FormGroup; submitted = false;
  constructor(private _formBuilder: FormBuilder, private _spinner: NgxUiLoaderService, private _commonService: CommonService, private _weeklycircularService: WeeklycircularService, private _notificationService: NotificationService, private _router: Router) {
  }

  get r() { return this.registerForm.controls; }
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      fullName: ['', [Validators.required, Validators.maxLength(50)]],
      mobileNumber: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(/\d/)]],
      termConditionCheck: [false, Validators.requiredTrue]
    });
  }

  registerSubscriber() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    else {
      this.submitted = false;
      this._spinner.start();
      var obj = {
        'fullName': this.registerForm.value.fullName,
        'mobileNumber': this.registerForm.value.mobileNumber,
        'CreatedBy': this._commonService.getStoreInfolocalStorage().userId,
      }
      this._weeklycircularService.registerWeeklyCircularSubscriber(obj).subscribe(
        data => {
          this.submitted = false;
          this._spinner.stop();
          if (data == 3) {
            this._notificationService.showError('This mobile number already exist', 'Error');
          }
          else {
            this._router.navigate(['subscriber/otp'], { state: { mobileNumber: this.registerForm.value.mobileNumber } });
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


