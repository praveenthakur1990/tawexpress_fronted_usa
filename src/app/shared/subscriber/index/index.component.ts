import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass']
})
export class IndexComponent implements OnInit {

  constructor(private _router: Router, private _spinner: NgxUiLoaderService) { }

  ngOnInit(): void {
    this._spinner.start();
  }

  ngAfterViewInit() {
    this._spinner.stop();
  }

  redirectToRegister() {
    this._router.navigate(['subscriber/register']);
  }

  redirectToLogin() {
    this._router.navigate(['subscriber/login']);
  }

}
