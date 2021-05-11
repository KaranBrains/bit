import { Component, OnInit } from '@angular/core';
import{ MarketConfig }from '../../assets/data/market';

  
interface MarketData {
  "crpto": String, 
  "id": String,
  "image": String,
  "last": String,
  "bid": String,
  "ask": String,
  "high": String, 
  "low": String,
  "mktcap":String,
  "vol": String,
  "change": String,
  "total":String,
  "about":String,
}

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
  realData: any[] = MarketConfig ;
  marketData: any[] = this.realData ;
  shouldToggle: Boolean = true;
  sortHow : any = {
    "crpto": true, 
    "id": true,
    "image": true,
    "last": true,
    "bid": true,
    "ask": true,
    "high": true, 
    "low": true,
    "mktcap":true,
    "vol": true,
    "change": true,
    "total":true,
    "about":true,
  }

  constructor() { }

  ngOnInit(): void {
  }

  onClick(){
    console.log("hello")
  }

  toggleIcon(i:any) {
    if (this.shouldToggle) {
      document.getElementById("abc"+i)?.classList.toggle('hidden');
      document.getElementById("abcd"+i)?.classList.toggle('hidden');
    } else {
      return;
    }
  }

  toggleIconHeader(i:any){
    this.shouldToggle = this.shouldToggle? false: true;
    for(let j = 0;j<this.marketData.length;j++) {
      document.getElementById("abc"+j)?.classList.toggle('hidden');
      document.getElementById("abcd"+j)?.classList.toggle('hidden');
    }
  }

  filter(){
    // @ts-ignore
    const val = document.getElementById('filterInput')?.value;
    let market:any = [];
    const maxCount = val<this.realData.length ? val : this.realData.length; 
    for(let i=0;i<maxCount;i++) {
      market.push(this.realData[i]);
    }
    this.marketData = market;
  }

  sort(type:any){
    if (this.sortHow[type]) {
      this.realData.sort((a, b) => (a[type] > b[type]) ? 1 : -1)
    } else {
      this.realData.sort((a, b) => (a[type] <= b[type]) ? 1 : -1)
    }
    this.sortHow[type] = this.sortHow[type] ? false: true;
  }

}
