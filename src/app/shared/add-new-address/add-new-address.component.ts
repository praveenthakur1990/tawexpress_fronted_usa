import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/model/constants';
import { CommonService } from 'src/app/service/common.service';
import { DeliveryAddressService } from 'src/app/service/delivery-address.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-add-new-address',
  templateUrl: './add-new-address.component.html',
  styleUrls: ['./add-new-address.component.sass']
})
export class AddNewAddressComponent implements OnInit {
  addNewAddressForm: any = FormGroup; submitted = false;
  // address: any;
  userAddress: any = [];
  userLatitude: string = ''
  userLongitude: string = ''
  setAsDefault: string = 'Y';
  setAddressType: string = 'H';
  objDeliveryAddess: any = {};
  @Input() public deliveryAddressId: number = 0;
  @Input() public address: any = {};
  constructor(private _activeModal: NgbActiveModal, private _formBuilder: FormBuilder, private _notificationService: NotificationService, private _spinner: NgxUiLoaderService, private _deliveryAddressService: DeliveryAddressService, private _commonService: CommonService) { }

  ngOnInit(): void {
    this.setAddressType = this.address != null ? this.address.addressType : '';
    this.setAsDefault = this.address != null ? this.address.isSetDefault == true ? 'Y' : 'N' : 'N';
    this.userLatitude = this.address != null ? this.address.latitude : '';
    this.userLongitude = this.address != null ? this.address.longitude : '';
    this.addNewAddressForm = this._formBuilder.group({
      firstName: [this.address != null ? this.address.firstName : null, [Validators.required, Validators.maxLength(50)]],
      lastName: [this.address != null ? this.address.lastName : null, [Validators.required, Validators.maxLength(50)]],
      address: [this.address != null ? this.address.address : null, [Validators.required, Validators.maxLength(200)]],
      city: [this.address != null ? this.address.city : null, [Validators.required, Validators.maxLength(50)]],
      state: [this.address != null ? this.address.state : null, [Validators.required, Validators.maxLength(50)]],
      zipCode: [this.address != null ? this.address.zipCode : null, [Validators.required, Validators.maxLength(10), Validators.pattern(/\d/)]]
    });
    if (this.deliveryAddressId == 0) {
      this.onSetAdressType('H');
    }


  }

  get f() { return this.addNewAddressForm.controls; }

  closeModal(sendData: any) {
    this._activeModal.close(sendData);
  }

  addNewAddress() {
    this.submitted = true;
    if (this.addNewAddressForm.invalid) {
      return;
    }
    else {
      this._spinner.start();
      var obj = {
        'Id': this.deliveryAddressId,
        'UserId': this._commonService.getuserInfolocalStorage().userId,
        'AddressType': this.setAddressType,
        'FirstName': this.addNewAddressForm.value.firstName,
        'LastName': this.addNewAddressForm.value.lastName,
        'Address': this.addNewAddressForm.value.address,
        'City': this.addNewAddressForm.value.city,
        'State': this.addNewAddressForm.value.state,
        'ZipCode': this.addNewAddressForm.value.zipCode,
        'Latitude': this.userLatitude,
        'Longitude': this.userLongitude,
        'IsSetDefault': false,
        'IsActive': true,
        'IsDeleted': false,
        'StoreId': this._commonService.getStoreInfolocalStorage().userId,
      }
      console.log(obj);
      //debugger;
      this._deliveryAddressService.addNewAddress(obj).subscribe(res => {
        this._spinner.stop();
        console.log(res);
        this._notificationService.showSuccess(Constants.deliveryAddressSuccessMsg, 'Saved')
        this._activeModal.close();
        this._commonService.sendUpdate('addedNewAddress');
      }, err => {
        this._spinner.stop();
        this._notificationService.showError(err.error, 'Error')
      })

    }
  }

  handleAddressChange(address: any) {
    console.log(address)
    this.userAddress = address.address_components;
    this.userLatitude = address.geometry.location.lat()
    this.userLongitude = address.geometry.location.lng()
    let addressComponents: [] = this.userAddress;
    for (let i = 0; i < addressComponents.length; i++) {
      console.log(addressComponents[i])
      let typesArray: any = addressComponents[i];
      for (let j = 0; j < typesArray.types.length; j++) {
        if (typesArray.types[j] === "locality") {
          console.log(' city : ' + typesArray.long_name)
          this.addNewAddressForm.controls.city.setValue(typesArray.long_name)
        }
        if (typesArray.types[j] === "administrative_area_level_1") {
          console.log(' state : ' + typesArray.long_name)
          this.addNewAddressForm.controls.state.setValue(typesArray.long_name)
        }
        if (typesArray.types[j] === "postal_code") {
          console.log(' zipCode : ' + typesArray.long_name)
          this.addNewAddressForm.controls.zipCode.setValue(typesArray.long_name)
        }
      }
    }
  }

  onSetAsDefault(type: string) {
    this.setAsDefault = type;
  }

  onSetAdressType(type: string) {
    this.setAddressType = type;
  }

  fetchDeliveryAddresses(id: number) {
    // this._deliveryAddressService.getDeliveryAddresses(id).subscribe(res => {
    //   this.objDeliveryAddess = res;
    //   console.log(this.objDeliveryAddess)
    //   this.setAddressType = this.objDeliveryAddess.addressType;
    //   this.setAsDefault = this.objDeliveryAddess.isSetDefault == true ? 'Y' : 'N';
    //   this.userLatitude = this.objDeliveryAddess.latitude;
    //   this.userLongitude = this.objDeliveryAddess.longitude;
    //   console.log(this.objDeliveryAddess.firstName)
    //   //debugger
    //   this.addNewAddressForm = this._formBuilder.group({
    //     firstName: [this.objDeliveryAddess.firstName, [Validators.required, Validators.maxLength(50)]],
    //     lastName: [this.objDeliveryAddess.lastName, [Validators.required, Validators.maxLength(50)]],
    //     address: [this.objDeliveryAddess.address, [Validators.required, Validators.maxLength(200)]],
    //     city: [this.objDeliveryAddess.city, [Validators.required, Validators.maxLength(50)]],
    //     state: [this.objDeliveryAddess.state, [Validators.required, Validators.maxLength(50)]],
    //     zipCode: [this.objDeliveryAddess.zipCode, [Validators.required, Validators.maxLength(10), Validators.pattern(/\d/)]]
    //   });
    // })
  }

}
