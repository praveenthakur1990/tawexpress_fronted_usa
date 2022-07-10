import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriberRoutingModule } from './subscriber-routing.module';
import { SubscriberComponent } from './subscriber.component';
import { LoginComponent } from '../../shared/subscriber/login/login.component';
import { OtpComponent } from '../../shared/subscriber/otp/otp.component';
import { RegisterComponent } from '../../shared/subscriber/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from "ngx-ui-loader";
@NgModule({
  declarations: [
    SubscriberComponent,
    LoginComponent,
    OtpComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    SubscriberRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule

  ]
})
export class SubscriberModule { }
