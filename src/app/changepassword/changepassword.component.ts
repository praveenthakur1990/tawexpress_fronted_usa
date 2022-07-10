import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccountService } from '../service/account.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.sass']
})
export class ChangepasswordComponent implements OnInit {
  changePasswordForm: any = FormGroup; submitted = false;
  constructor(private _formBuilder: FormBuilder, private _activeModal: NgbActiveModal, private _spinner: NgxUiLoaderService, private _accountService: AccountService, private _notificationService: NotificationService) {
    this.changePasswordForm = this._formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.maxLength(50)]],
      newPassword: ['', [Validators.required, Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  get r() { return this.changePasswordForm.controls; }

  ngOnInit(): void {

  }


  closeModal(sendData: any) {
    this._activeModal.close(sendData);
  }

  changePassword() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    else {
      this._spinner.start();
      var obj = {
        'oldPassword': this.changePasswordForm.value.oldPassword,
        'newPassword': this.changePasswordForm.value.newPassword,
        'confirmPassword': this.changePasswordForm.value.confirmPassword
      }
      this._accountService.changePassword(obj).subscribe(
        data => {
          this.submitted = false;
          this._spinner.stop();
          this._activeModal.close();
          this._notificationService.showSuccess("Your password has been changed successfully", 'Success', 2000)
        }, err => {
          this._spinner.stop();
          this._notificationService.showError(err.error, 'Error', 2000)
        });
    }
  }
}

export function ConfirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}