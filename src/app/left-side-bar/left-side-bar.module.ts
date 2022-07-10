import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeftSideBarRoutingModule } from './left-side-bar-routing.module';
import { LeftSideBarComponent } from './left-side-bar.component';


@NgModule({
  declarations: [
    LeftSideBarComponent
  ],
  imports: [
    CommonModule,
    LeftSideBarRoutingModule
  ]
})
export class LeftSideBarModule { }
