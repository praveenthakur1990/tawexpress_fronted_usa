import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { StoreVM } from 'src/app/model/store-vm';
import { CommonService } from 'src/app/service/common.service';
import { NotificationService } from 'src/app/service/notification.service';
import { WeeklycircularService } from 'src/app/service/weeklycircular.service';

@Component({
  selector: 'app-store-weekly-circular',
  templateUrl: './store-weekly-circular.component.html',
  styleUrls: ['./store-weekly-circular.component.sass']
})
export class StoreWeeklyCircularComponent implements OnInit {
  weeklyCircularList: any; objStoreInfo: StoreVM = {};
  constructor(private _commonService: CommonService, private _weeklycircularService: WeeklycircularService, private _spinner: NgxUiLoaderService, private _notificationService: NotificationService, private _router: Router) {

    var data: any = this._router.getCurrentNavigation()!.extras.state != undefined ? this._router.getCurrentNavigation()!.extras.state : '';
    if (data) {
      this.objStoreInfo = this._commonService.getStoreInfolocalStorage();
      console.log(this.objStoreInfo)
      this.bindWeeklyCircularList();
    }
    else {
      this._router.navigate(['subscriber/index']);
    }
  }

  ngOnInit(): void {
  }

  bindWeeklyCircularList() {
    this._spinner.start();
    this._weeklycircularService.getWeeklyCircularInfoById(0, 1, -1, this.objStoreInfo.userId!).subscribe(res => {
      this.weeklyCircularList = res;
      console.log(this.weeklyCircularList)
    }, err => {
      this._spinner.stop();
      this._notificationService.showError(err.error, 'Error', 2000)
    });
  }

}
