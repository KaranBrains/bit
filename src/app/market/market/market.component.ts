import { Component, OnInit } from '@angular/core';
import{ MarketConfig }from '../../../assets/data/market';

  
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

  marketData: MarketData[]  =MarketConfig ;

  constructor() { }

  ngOnInit(): void {
  }

  onClick(){
    console.log("hello")
    }

}
