import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialOfferRoutingModule } from './special-offer-routing.module';
import { SpecialOfferComponent } from './special-offer.component';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    SpecialOfferComponent
  ],
  imports: [
    CommonModule,
    SpecialOfferRoutingModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class SpecialOfferModule { }
