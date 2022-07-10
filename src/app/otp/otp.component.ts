import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserVM } from '../model/user-vm';
import { AccountService } from '../service/account.service';
import { CategoryService } from '../service/category.service';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.sass']
})
export class OtpComponent implements OnInit {
  OTPForm:any=FormGroup; submitted = false; returnUrl: string | undefined;
  @Input() public mobileNumber:string=''; @Input() public callType:string='';
  objUser:UserVM={".issued":'',".expires":''};
  constructor(private _commonService: CommonService, private _notificationService:NotificationService, private _accountService: AccountService, private _spinner: NgxUiLoaderService, private _activeModal: NgbActiveModal, private _formBuilder: FormBuilder,private route: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {
    this.OTPForm = this._formBuilder.group({
      otp: ['', [Validators.required,Validators.pattern(/\d/)]]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get o() { return this.OTPForm.controls; }

  closeModal(sendData: any) {
    this._activeModal.close(sendData);
  }

  verifyOTP(){   
    this.submitted = true;
    if (this.OTPForm.invalid) {
      return;
    }
    else{
      this._spinner.start();
      var obj={
        'OTP':this.OTPForm.value.otp,
        'mobileNumber':this.mobileNumber
      }
      this._accountService.verifyOTP(obj).subscribe(
        data => {        
          if(this.callType=='register'){
            this._notificationService.showSuccess('Your account has been created successfully','Success');
          }           
          this.loginAfterRegister();
        },err => {
          this._spinner.stop();
          this._notificationService.showError(err.error,'Error')
        });
    }
  }

  loginAfterRegister(){
    var obj={
      'password':'@Password3',
      'mobileNumber':this.mobileNumber
    }
    this._accountService.login(obj).subscribe(
      data => { 
        this.objUser=data;
        this._commonService.setuserInfolocalStorage(this.objUser);
        //window.location.reload();
        this._activeModal.close();
        this._spinner.stop();
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        // this._router.navigate([this.returnUrl]);
      },err => {
        this._spinner.stop();
        this._notificationService.showError(err.error.error,'Error')
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
