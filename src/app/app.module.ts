import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddNewAddressComponent } from './shared/add-new-address/add-new-address.component';
import { IndexComponent } from './shared/subscriber/index/index.component';
import { StoreWeeklyCircularComponent } from './shared/subscriber/store-weekly-circular/store-weekly-circular.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';


@NgModule({
  declarations: [
    AppComponent,
    AddNewAddressComponent,
    IndexComponent,
    StoreWeeklyCircularComponent,
    ChangepasswordComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { scrollPositionRestoration: 'enabled' }),
    LayoutModule,
    GooglePlaceModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule

  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
