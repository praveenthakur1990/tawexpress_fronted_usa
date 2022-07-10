import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { DeliveryAddressesComponent } from '../delivery-addresses/delivery-addresses.component';
import { DeliverySlotComponent } from '../shared/delivery-slot/delivery-slot.component';

@NgModule({
  declarations: [
    CheckoutComponent,
    DeliveryAddressesComponent,
    DeliverySlotComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    GooglePlaceModule
  ]
})
export class CheckoutModule {
  constructor(){
    console.log('CheckoutModule loaded');
  }
 }
