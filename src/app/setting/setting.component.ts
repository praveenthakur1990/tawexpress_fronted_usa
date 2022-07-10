import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccountService } from '../service/account.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.sass']
})
export class SettingComponent implements OnInit {

  constructor(private _notificationService:NotificationService, private _accountService: AccountService, private _spinner: NgxUiLoaderService) { }

  ngOnInit(): void {
  }

  logout(){
    this._spinner.start();  
    this._accountService.logout().subscribe(
      data => {
        this._spinner.stop();
        localStorage.clear();
        window.location.reload();
      },err => {
        this._spinner.stop();
        this._notificationService.showError(err.error.message,'Error')
      });
  }


}
