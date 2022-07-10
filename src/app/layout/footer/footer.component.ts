import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreVM } from 'src/app/model/store-vm';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {
  subdomain: string = '';
  objStoreInfo: StoreVM = {}; isLoading: boolean = true;
  constructor(private _commonService: CommonService, private _route: ActivatedRoute, private _router: Router) { this.getSubdomain(); }

  ngOnInit(): void {
  }
  getSubdomain() {
    const domain = window.location.hostname;
    if (domain.indexOf('.') < 0 ||
      domain.split('.')[0] === 'example' || domain.split('.')[0] === 'lvh' || domain.split('.')[0] === 'www') {
      this.subdomain = '';
    } else {
      this.subdomain = domain.split('.')[0];
    }
    if (this.subdomain != '') {
      this._commonService.getStoreInfo(this.subdomain || '').subscribe(
        data => {
          this.objStoreInfo = data;
          this.objStoreInfo.logoPath = environment.imageBaseURL + this.objStoreInfo.logoPath
          this.isLoading = false;
        });
      console.log('subdomain', this.subdomain);
    }
  }

}
