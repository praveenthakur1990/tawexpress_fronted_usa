import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeeklycircularComponent } from './weeklycircular.component';

const routes: Routes = [{ path: '', component: WeeklycircularComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeeklycircularRoutingModule { }
