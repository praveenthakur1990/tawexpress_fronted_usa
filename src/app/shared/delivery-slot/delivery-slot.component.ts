import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/model/constants';
import { CommonService } from 'src/app/service/common.service';
import { DeliveryAddressService } from 'src/app/service/delivery-address.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-delivery-slot',
  templateUrl: './delivery-slot.component.html',
  styleUrls: ['./delivery-slot.component.sass']
})
export class DeliverySlotComponent implements OnInit {
  objDays: any = []; objSlots: any = [];
  private subscriptionName: Subscription | undefined; isRequiredDeliveryDate: boolean = false;
  isRequiredDeliveryTime: boolean = false;
  deliveryDay: number = -1;
  deliverySlot: number = -1;
  constructor(private _router: Router, private _deliveryAddressService: DeliveryAddressService, private _notificationService: NotificationService, private _commonService: CommonService) {
    console.log('delivery slot loaded')
    this.fetchDeliverySlotDays(3);
    this.fetchDeliverySlots(30, 9, 22);
  }

  ngOnInit(): void {
    this.subscriptionName = this._commonService.getUpdate().subscribe(res => {
      //debugger
      if (res.text.type == 'isRequiredDeliveryDate' && res.text.isRequired == true) {
        this.isRequiredDeliveryDate = true;
      }

      if (res.text.type == 'isRequiredDeliveryDate' && res.text.isRequired == false) {
        this.isRequiredDeliveryDate = false;
      }
      if (res.text.type == 'isRequiredDeliveryTime' && res.text.isRequired == true) {
        this.isRequiredDeliveryTime = true;
      }

      if (res.text.type == 'isRequiredDeliveryTime' && res.text.isRequired == false) {
        this.isRequiredDeliveryTime = false;
      }
    });
  }


  ngOnDestroy() {
    this.subscriptionName?.unsubscribe();
  }

  fetchDeliverySlotDays(days: number) {
    this._deliveryAddressService.getDeliverySlotDays(days).subscribe(res => {
      this.objDays = res;
      console.log(this.objDays)
    }, err => {
      if (err.status == 401) {
        this._notificationService.showError(Constants.sessionExpiredMsg, "Error");
        this._router.navigate(['/dashboard']);
      }
      else {
        this._notificationService.showError(err.message, "Error");
      }
    })
  }

  fetchDeliverySlots(interval: number, start: number, end: number) {
    this._deliveryAddressService.getDeliverySlots(interval, start, end).subscribe(res => {
      this.objSlots = res;
      //console.log(this.objSlots)
    }, err => {
      if (err.status == 401) {
        this._notificationService.showError(Constants.sessionExpiredMsg, "Error");
        this._router.navigate(['/dashboard']);
      }
      else {
        this._notificationService.showError(err.message, "Error");
      }
    })
  }

  onSelectDeliveryDay(date: Date, index: number) {
    console.log(date)
    this.deliveryDay=index;
    this._commonService.sendUpdate({ 'type': 'deliveryDay', 'data': date })
  }

  onSelectDeliveryTime(time: any, index: number) {
    console.log(time)
    this.deliverySlot=index;
    this._commonService.sendUpdate({ 'type': 'deliveryTime', 'data': time })
  }

}
