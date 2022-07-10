import { Injectable } from '@angular/core';
import { ɵInternalFormsSharedModule } from '@angular/forms';
import { Toast } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { cartItem } from '../model/product-vm';

@Injectable({
  providedIn: 'root'
})

export class CartService2Service {

  public itemsInCartSubject: BehaviorSubject<any> = new BehaviorSubject([]);
  private itemsInCart: cartItem[] = [];

  constructor() {
    this.itemsInCartSubject.subscribe(_ => this.itemsInCart = _);
  }

  public addToCart(item: cartItem) {
    let products: cartItem[] = [];
    console.log(item)
    let amt = ((item.offerType=="2" || item.offerType=="1") ? parseFloat(item.finalValue!):item.price || 0) * (item.qty || 0);
    item.totalPrice = parseFloat(amt.toFixed(2));
    products = localStorage.getItem("cartProducts") == null ? [] : JSON.parse(localStorage.getItem("cartProducts")!);
    //debugger
    products.push(item);
    localStorage.setItem("cartProducts", JSON.stringify(products));
    var _cartProducts = JSON.parse(localStorage.getItem("cartProducts")!);
    this.itemsInCartSubject.next([_cartProducts]);
  }

  public getItems(): Observable<cartItem[]> {
    //debugger
    this.itemsInCart.push(JSON.parse(localStorage.getItem('cartProducts')!));
    // this.itemsInCart=dat;
    //this.itemsInCart.push(dat[0]);
    return this.itemsInCartSubject;
  }

  removeFromCart(item: cartItem, index: number) {
    // this.itemsInCart.splice(index, 1)
    let productAfterRemove: any = [];
    //debugger
    let currentItems: any = this.itemsInCart[0];

    // let currentItems: cartItem[] = [...this.itemsInCart];
    //currentItems.splice(index, 1);
    // const itemsWithoutRemoved = currentItems.filter(_ => _.productId !== item.productId);
    let itemsWithoutRemoved = currentItems.filter(function (el: any, i: number) {
      return i != index
    });
    productAfterRemove.push(itemsWithoutRemoved)
    localStorage.setItem("cartProducts", JSON.stringify(itemsWithoutRemoved));
    this.itemsInCartSubject.next(productAfterRemove);
  }

  emptyCart() {
    // debugger
    // this.itemsInCart.splice(index, 1)
    let productAfterRemove: any = [];
    //debugger
    let currentItems: any = this.itemsInCart[0];
    debugger
    //const currentItems = [...this.itemsInCart];
    currentItems.forEach((item: any, index: any) => {
      currentItems.splice(index, 1);
    });
    this.itemsInCartSubject.next(currentItems);

  }

  updateCartQty(item: cartItem, index: number) {
    let currentItems: any = this.itemsInCart[0];
    // const currentItems = [...this.itemsInCart];
    //const itemsWithoutRemoved = currentItems.filter(_ => _.productId == item.productId);
    if (currentItems.length > 0) {
      currentItems[index].qty = item.qty
    }
    //debugger

    // let productAfterRemove: any = [];
    // //debugger
    // productAfterRemove.push(currentItems)
    localStorage.setItem("cartProducts", JSON.stringify(currentItems));

    this.itemsInCartSubject.next([currentItems]);
    //debugger

  }

  productExistInCart(id: number) {
    let products: cartItem[] = JSON.parse(localStorage.getItem("cartProducts")!);
    if(products!=null){
      return products.some(function (el) {
        return el.productId === id;
      });
    }
   return false;
  }

}
