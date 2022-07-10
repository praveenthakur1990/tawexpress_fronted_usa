import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.sass']
})
export class OrderdetailComponent implements OnInit {
  @Input() public orderDetail: any;currencySymbol: string = '';
  constructor(private _activeModal: NgbActiveModal, private _commonService: CommonService) {
    this.currencySymbol = this._commonService.getStoreInfolocalStorage().currencySymbol || '';
  }

  ngOnInit(): void {
    console.log(this.orderDetail)
  }


  closeModal(sendData: any) {
    this._activeModal.close(sendData);
  }

}
