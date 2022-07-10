import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string | undefined, title: string | undefined, timer: number = 1000) {
    //debugger
    this.toastr.success(message, title, { timeOut: timer, enableHtml: true, progressBar: true });
  }

  showError(message: string | undefined, title: string | undefined, timer: number = 1000) {
    this.toastr.error(message, title, { timeOut: timer, enableHtml: true,  progressBar: true })
  }

  showInfo(message: string | undefined, title: string | undefined, timer: number = 1000) {
    this.toastr.info(message, '', { timeOut: timer, enableHtml: true, progressBar: true })
  }

  showWarning(message: string | undefined, title: string | undefined, timer: number = 1000) {
    this.toastr.warning(message, '', { timeOut: timer, enableHtml: true, progressBar: true })
  }
}
