import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyorderRoutingModule } from './myorder-routing.module';
import { MyorderComponent } from './myorder.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    MyorderComponent,
  ],
  imports: [
    CommonModule,
    MyorderRoutingModule,
    InfiniteScrollModule
  ]
})
export class MyorderModule { }
