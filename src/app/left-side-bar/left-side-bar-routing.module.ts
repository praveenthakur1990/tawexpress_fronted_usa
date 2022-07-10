import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeftSideBarComponent } from './left-side-bar.component';

const routes: Routes = [{ path: '', component: LeftSideBarComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeftSideBarRoutingModule { }
