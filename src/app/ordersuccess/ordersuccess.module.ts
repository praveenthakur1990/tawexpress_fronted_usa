import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersuccessRoutingModule } from './ordersuccess-routing.module';
import { OrdersuccessComponent } from './ordersuccess.component';


@NgModule({
  declarations: [
    OrdersuccessComponent
  ],
  imports: [
    CommonModule,
    OrdersuccessRoutingModule
  ]
})
export class OrdersuccessModule { }
