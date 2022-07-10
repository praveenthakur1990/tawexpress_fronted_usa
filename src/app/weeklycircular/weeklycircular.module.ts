import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeeklycircularRoutingModule } from './weeklycircular-routing.module';
import { WeeklycircularComponent } from './weeklycircular.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@NgModule({
  declarations: [
    WeeklycircularComponent
  ],
  imports: [
    CommonModule,
    WeeklycircularRoutingModule,
    TabsModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule
  ]
})
export class WeeklycircularModule { }

