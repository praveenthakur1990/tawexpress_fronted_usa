import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersuccessComponent } from './ordersuccess.component';

const routes: Routes = [{ path: '', component: OrdersuccessComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersuccessRoutingModule { }
