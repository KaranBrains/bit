import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  public currencyData: any;
  constructor() {
    this.currencyData = "";
  }

  setCurrencyType (data: any) {
    this.currencyData = data;
    localStorage.setItem("currencyType",data);
  }
  getCurrencyType () {
    if(this.currencyData == ""){
      this.currencyData = localStorage.getItem("currencyType");
    }
    return this.currencyData;
  }
}
