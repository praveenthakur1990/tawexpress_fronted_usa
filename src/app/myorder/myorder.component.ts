import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Constants } from '../model/constants';
import { OrderdetailComponent } from '../orderdetail/orderdetail.component';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.sass']
})
export class MyorderComponent implements OnInit {

  objOrderList: any = [];
  currencySymbol: string = '';
  pageNumber: number = 1;
  constructor(private _orderService: OrderService, private _notificationService: NotificationService, private _commonService: CommonService, private _spinner: NgxUiLoaderService, private _modalService: NgbModal) {
    this.loadOrderList(0, '', this._commonService.getuserInfolocalStorage().userId || '', 1, Constants.pageSize, '');
    this.currencySymbol = this._commonService.getStoreInfolocalStorage().currencySymbol || '';
  }

  ngOnInit(): void {
  }

  loadOrderList(orderId: number, orderNo: string, orderBy: string, pageNumber: number, pageSize: number, searchStr: string) {
    this._spinner.start();
    this._orderService.getOrderList(orderId, orderNo, orderBy, false, pageNumber, pageSize, searchStr).subscribe(
      data => {
        this._spinner.stop();
        //debugger
        if (this.pageNumber == 1) {
          this.objOrderList = data;
        }
        else {
          for (let i = 0; i < data.length; i++) {
            this.objOrderList.push(data[i]);
          }
        }
        console.log(this.objOrderList)
        this.pageNumber++;
      }, err => {
        this._notificationService.showError(err.message, 'Error')
      });
  }

  onScroll() {
    //console.log('scrolled!!');
    this.loadOrderList(0, '', this._commonService.getuserInfolocalStorage().userId || '', this.pageNumber, Constants.pageSize, '');
  }

  openOrderDetailModal(orderDetail: any) {
    //console.log(orderDetail)
    const modalRef = this._modalService.open(OrderdetailComponent, {
      scrollable: true, size: 'lg', ariaLabelledBy: 'modal-basic-title',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.componentInstance.orderDetail = orderDetail;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
}
