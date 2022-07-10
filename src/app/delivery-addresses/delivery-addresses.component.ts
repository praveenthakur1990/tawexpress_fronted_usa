import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { constants } from 'buffer';
import { Subscription } from 'rxjs';
import { Constants } from '../model/constants';
import { CommonService } from '../service/common.service';
import { DeliveryAddressService } from '../service/delivery-address.service';
import { NotificationService } from '../service/notification.service';
import { AddNewAddressComponent } from '../shared/add-new-address/add-new-address.component';

@Component({
  selector: 'app-delivery-addresses',
  templateUrl: './delivery-addresses.component.html',
  styleUrls: ['./delivery-addresses.component.sass']
})
export class DeliveryAddressesComponent implements OnInit {
  IsCheckoutPage: boolean = false;
  objDeliveryAddresses: any = [];
  objHomeDeliveryAddress: any = [];
  objOfficeDeliveryAddress: any = [];
  private subscriptionName: Subscription | undefined;
  isRequiredAddress: boolean = false;
  constructor(private _modalService: NgbModal, private _router: Router, private _deliveryAddressService: DeliveryAddressService, private _notificationService: NotificationService, private _commonService: CommonService) {
    if (this._router.url == '/checkout') {
      this.IsCheckoutPage = true;
    }
    if (this._router.url == '/setting/delivery-addresses') {
      this.IsCheckoutPage = false;
    }
    this.fetchDeliveryAddresses(0);
  }

  ngOnInit(): void {
    this.subscriptionName = this._commonService.getUpdate().subscribe(res => {
      if (res.text == 'addedNewAddress') {
        this.fetchDeliveryAddresses(0);
      }
    });

    this.subscriptionName = this._commonService.getUpdate().subscribe(res => {
      //debugger
      if (res.text.type == 'isRequiredAddress' && res.text.isRequired == true) {
        this.isRequiredAddress = true;
      }
      if (res.text.type == 'isRequiredAddress' && res.text.isRequired == false) {
        this.isRequiredAddress = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscriptionName?.unsubscribe();
  }

  openAddNewAddressModal(id: number, address: any) {
    const modalRef = this._modalService.open(AddNewAddressComponent, {
      scrollable: true, size: 'lg', ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static'
    });
    console.log(address)
    modalRef.componentInstance.deliveryAddressId = id;
    modalRef.componentInstance.address = address;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  fetchDeliveryAddresses(id: number) {
    this._deliveryAddressService.getDeliveryAddresses(id).subscribe(res => {
      console.log(res)
      this.objDeliveryAddresses = res;
      this.objHomeDeliveryAddress = this.objDeliveryAddresses.filter((xx: { addressType: string; }) => xx.addressType == 'H');
      this.objOfficeDeliveryAddress = this.objDeliveryAddresses.filter((xx: { addressType: string; }) => xx.addressType == 'O');
      //console.log(this.objOfficeDeliveryAddress)
    }, err => {
      // if (err.status == 401) {
      //   this._notificationService.showError(Constants.sessionExpiredMsg, "Error");
      //   this._router.navigate(['/dashboard']);
      // }
      // else {
      //   this._notificationService.showError(err.message, "Error");
      // }
    })
  }

  onSelectAdress(addressId: number) {
    if (this.IsCheckoutPage) {
      this._deliveryAddressService.calculateDistance(addressId).subscribe(res => {
        if(parseFloat(this._commonService.getStoreInfolocalStorage().maxDeliveryAreaInMiles || '0') > 0 && parseFloat(res) > parseFloat(this._commonService.getStoreInfolocalStorage().maxDeliveryAreaInMiles || '0')){
          this._notificationService.showError(Constants.locationFaAwayMsg, "Error", 2000);
          this.fetchDeliveryAddresses(0);
        }        
        else {
          this._commonService.sendUpdate({ 'type': 'deliveryAddressId', 'data': addressId })
        }
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
  }

}
