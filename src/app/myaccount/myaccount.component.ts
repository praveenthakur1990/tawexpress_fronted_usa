import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ChangepasswordComponent } from '../changepassword/changepassword.component';
import { Constants } from '../model/constants';
import { UserVM } from '../model/user-vm';
import { AccountService } from '../service/account.service';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.sass']
})
export class MyaccountComponent implements OnInit {
  userInfo: any = {};
  userInfoForm: any = FormGroup; submitted = false;
  constructor(private _commonService: CommonService, private _formBuilder: FormBuilder, private _accountService: AccountService, private _spinner: NgxUiLoaderService, private _notificationService: NotificationService, private _modalService: NgbModal) {
    //console.log(this._commonService.getuserInfolocalStorage())
    this.userInfo = this._commonService.getuserInfolocalStorage();
  }

  ngOnInit(): void {
    this.userInfoForm = this._formBuilder.group({
      firstName: [this.userInfo.firstName, [Validators.required, Validators.maxLength(50)]],
      lastName: [this.userInfo.lastName, [Validators.required, Validators.maxLength(50)]],
      email: [this.userInfo.email, [Validators.required, Validators.maxLength(200)]],
      phoneNumber: [this.userInfo.phoneNumber, [Validators.required, Validators.maxLength(10)]],
    });
  }

  get f() { return this.userInfoForm.controls; }

  updatePersonalInfo() {
    this.submitted = true;
    if (this.userInfoForm.invalid) {
      return;
    }
    else {
      this._spinner.start();
      var obj = {
        'firstName': this.userInfoForm.value.firstName,
        'lastName': this.userInfoForm.value.lastName,
        'email': this.userInfoForm.value.email,
        'phoneNumber': this.userInfoForm.value.phoneNumber,
        'userId': this._commonService.getuserInfolocalStorage().userId,
      }

      this._accountService.updatePersonalInfo(obj).subscribe(
        data => {
          this.submitted = false;
          this._spinner.stop();
          let localUserInfo: UserVM = this._commonService.getuserInfolocalStorage();
          localUserInfo.firstName = obj.firstName;
          localUserInfo.lastName = obj.lastName;
          localUserInfo.email = obj.email;
          localUserInfo.phoneNumber = obj.phoneNumber;
          this._commonService.setuserInfolocalStorage(localUserInfo);
          console.log(this._commonService.getuserInfolocalStorage())
          this._notificationService.showSuccess(Constants.personalInfoSuccessMsg, 'Updated');
        }, err => {
          this._spinner.stop();
          console.log(err)
          //this._commonService.errorHandler(err);
          if (err.status == 401) {
            this._notificationService.showError(err.error.message, 'Error');
          }
          else {
            this._notificationService.showError(err.error, 'Error');
          }
        });
    }

  }

  openChangePasswordModel(){
    // const modalRef = this._modalService.open(ChangepasswordComponent, {
    //   scrollable: true, size: 'md', ariaLabelledBy: 'modal-basic-title',
    //   keyboard: false,
    //   backdrop: 'static'
    // });
    // modalRef.result.then((result: any) => {
    // }, (reason: any) => {
    // });
  }

}
