import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../guard/authentication.guard';
import { CheckoutGuard } from '../guard/checkout.guard';
import { StoreAuthGuard } from '../guard/store-auth.guard';
import { SettingComponent } from '../setting/setting.component';
import { IndexComponent } from '../shared/subscriber/index/index.component';
import { LoginComponent } from '../shared/subscriber/login/login.component';
import { OtpComponent } from '../shared/subscriber/otp/otp.component';
import { RegisterComponent } from '../shared/subscriber/register/register.component';
import { StoreWeeklyCircularComponent } from '../shared/subscriber/store-weekly-circular/store-weekly-circular.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SubscriberComponent } from './subscriber/subscriber.component';

const routes: Routes = [
 // { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '', component: MainLayoutComponent, children: [
      { path: '', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'products/:id', loadChildren: () => import('../products/products.module').then(m => m.ProductsModule), canActivate: [StoreAuthGuard] },
      { path: 'checkout', loadChildren: () => import('../checkout/checkout.module').then(m => m.CheckoutModule), canActivate: [CheckoutGuard, StoreAuthGuard] },
      { path: 'order-success', loadChildren: () => import('../ordersuccess/ordersuccess.module').then(m => m.OrdersuccessModule), canActivate: [StoreAuthGuard] },
      { path: 'productInfo', loadChildren: () => import('../product-info/product-info.module').then(m => m.ProductInfoModule), canActivate: [StoreAuthGuard] },
      { path: 'weeklycircular', loadChildren: () => import('../weeklycircular/weeklycircular.module').then(m => m.WeeklycircularModule), canActivate: [StoreAuthGuard] },
      { path: 'specialOffer', loadChildren: () => import('../special-offer/special-offer.module').then(m => m.SpecialOfferModule), canActivate: [StoreAuthGuard] },
      {
        path: 'setting', component: SettingComponent, children: [
          { path: '', loadChildren: () => import('../setting/setting.module').then(m => m.SettingModule), canActivate: [AuthenticationGuard, StoreAuthGuard] },
          { path: 'my-account', loadChildren: () => import('../myaccount/myaccount.module').then(m => m.MyaccountModule), canActivate: [StoreAuthGuard] },
          { path: 'my-orders', loadChildren: () => import('../myorder/myorder.module').then(m => m.MyorderModule), canActivate: [StoreAuthGuard] },
          { path: 'delivery-addresses', loadChildren: () => import('../delivery-addresses/delivery-addresses.module').then(m => m.DeliveryAddressesModule), canActivate: [StoreAuthGuard] },
          { path: 'order-detail', loadChildren: () => import('../orderdetail/orderdetail.module').then(m => m.OrderdetailModule), canActivate: [StoreAuthGuard] },
        ], canActivate: [AuthenticationGuard, StoreAuthGuard]
      },
      { path: 'order-success', loadChildren: () => import('../ordersuccess/ordersuccess.module').then(m => m.OrdersuccessModule), canActivate: [AuthenticationGuard] },
    ], canActivate: [StoreAuthGuard]
  },
  { path: '', loadChildren: () => import('../login/login.module').then(m => m.LoginModule) },
  { path: '', loadChildren: () => import('../register/register.module').then(m => m.RegisterModule) },
  { path: '', loadChildren: () => import('../otp/otp.module').then(m => m.OtpModule) },
  {
    path: 'subscriber', component: SubscriberComponent, children: [
      { path: '', loadChildren: () => import('../layout/subscriber/subscriber.module').then(m => m.SubscriberModule) },
      { path: 'index', component: IndexComponent },
      { path: 'login', component: LoginComponent },
      { path: 'otp', component: OtpComponent },
      { path: 'register', component: RegisterComponent },

    ], canActivate: [StoreAuthGuard]
  },
  { path: 'subscriber/home', component: StoreWeeklyCircularComponent, canActivate: [StoreAuthGuard] },
 { path: 'leftsidebar', loadChildren: () => import('../left-side-bar/left-side-bar.module').then(m => m.LeftSideBarModule) }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
