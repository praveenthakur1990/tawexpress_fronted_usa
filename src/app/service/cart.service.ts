
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { cartItem, ProductVM } from '../model/product-vm';

@Injectable({
  providedIn: 'root'
})
export class CartService { 
  constructor() {}
   cartSubject = new Subject<cartItem>(); Products : cartItem[]= []; CartState = this.cartSubject.asObservable();
   
    addProduct(_product:cartItem) {
      this.Products.push(_product)
      this.cartSubject.next(<cartItem>{loaded: true, products:  this.Products});
    }

    removeProduct(id:number) {
      console.log('product list :' +this.Products)
      this.Products = this.Products.filter((_item) =>  _item.productId !== id )
      console.log('deleted product :' +this.Products)
      this.cartSubject.next(<cartItem>{loaded: false , products:  this.Products});
      console.log(this.cartSubject)
    }  
  }
