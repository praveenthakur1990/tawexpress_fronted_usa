import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryAddressesComponent } from './delivery-addresses.component';

const routes: Routes = [{ path: '', component: DeliveryAddressesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryAddressesRoutingModule { }
