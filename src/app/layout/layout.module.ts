//modules
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxUiLoaderConfig, NgxUiLoaderModule, PB_DIRECTION, POSITION, SPINNER } from "ngx-ui-loader";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//components
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { CategoryHeaderComponent } from './category-header/category-header.component';
//services
import { CommonService } from '../service/common.service';
import { CategoryService } from '../service/category.service';
import { NotificationService } from '../service/notification.service';
import { PaymentService } from '../service/payment.service';

//directive
import { PhoneMaskDirective } from '../directive/phone-mask.directive';
import { RightNavBarComponent } from './right-nav-bar/right-nav-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { WeeklycircularService } from '../service/weeklycircular.service';

import { ErrorInterceptor } from '../_helper/error.interceptor';
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'red',
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce,
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
};
@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    MainLayoutComponent,
    CategoryHeaderComponent,
    PhoneMaskDirective,
    RightNavBarComponent,

  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    LayoutRoutingModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates:true
    }),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AutocompleteLibModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CommonService, CategoryService, NotificationService, PaymentService, WeeklycircularService, { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },]

})
export class LayoutModule { }
