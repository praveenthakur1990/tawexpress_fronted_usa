import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecialOfferComponent } from './special-offer.component';

const routes: Routes = [{ path: '', component: SpecialOfferComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialOfferRoutingModule { }
