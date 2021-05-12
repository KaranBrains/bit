import { Component, OnInit, OnDestroy, ViewChild , PLATFORM_ID, APP_ID, Inject} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as _ from "lodash";
import { OwlCarousel } from 'ngx-owl-carousel';
import { SocketService } from '../shared/services/socket.service';
import { CurrencyService } from '../shared/services/currency.service';
import { CoinTextService } from '../shared/services/coin_texts.service';
import { Event } from '../event.enum';
import { Router, ActivatedRoute, Params } from "@angular/router";

declare var jQuery: any;

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit, OnDestroy {

  msg = {"subscribe": true};
  selectedCurrency: any;
  ioConnection: any;
  sortedData:any[] = [];
  bSort = false;
  valueDiff = 0;
  expandIndex = 0;
  tempCount = 0;
  orderByCol = "crypto";
  info = `Bitcoin is a consensus network that enables a new payment system and a completely digital money. It is the first decentralized peer-to-peer payment network that is powered by its users with no central authority or middlemen. From a user perspective, Bitcoin
    is pretty much like cash for the Internet. Bitcoin can also be seen as the most prominent triple entry bookkeeping system in existence. Bitcoin is the first implementation of a concept called "cryptocurrency", which was first described
    in 1998 by Wei Dai on the cypherpunks mailing list, suggesting the idea of a new form of money that uses cryptography to control its creation and transactions, rather than a central authority.`;

  isexpandAll: boolean = false;
  isExpand: boolean = true;
  previousRow : any;
  // @ts-ignore
  previousIndex : number;
  t_fixed: any;
  mySelect = null;
  records:any = 50;
  toDisplay:any = 50;
  images = [
    "assets/img/brave-logo.png",
    "assets/img/bitsquare-logo.png",
    "assets/img/mycelium-logo.png",
    "assets/img/open-bazaar-logo.png",
    "assets/img/bitgo-logo.png",
    "assets/img/brave-logo.png",
    "assets/img/bitsquare-logo.png",
    "assets/img/mycelium-logo.png",
    "assets/img/open-bazaar-logo.png",
    "assets/img/bitgo-logo.png"
  ];
  carouselOptions: any = {
    margin:40,
    nav: true,
    dots: false,
    // loop: false,
    // items: 5,
    responsive:{
        0:{
            items:1
        },
        768:{
            items:3
        },
        992:{
            items:5
        }
    },
    navText : ["<i class='crypto-icon-arrow-left'></i>","<i class='crypto-icon-arrow-right'></i>"]
  }
  // @ts-ignore
  customOptions: [{
    'autoPlay': true,
    'slideSpeed': 2000,
    'pagination': false,
    'navigation': true,
    'navigationText': ['', ''],
    'items': 4,
    'transitionStyle': "fade",
    /* [This code for animation ] */
    'itemsDesktop': [1199, 5],
    'itemsDesktopSmall': [980, 4],
    'itemsTablet': [768, 3],
    'itemsMobile': [479, 2],
  }];

  public crypto : any;
  public last : any;
  public bid : any;
  public ask : any;
  public high : any;
  public market_cap : any;
  public volume : any;
  public change_percent : any;
  public low : any;
  platform: boolean;
  // @ts-ignore
  @ViewChild('owlElement') owlElement: OwlCarousel

  isSortAll = false;
  nextFun() {
    this.owlElement.next([200])
  }
  previoudFun() {
    this.owlElement.previous([200])
  }

  constructor(public socketService: SocketService,public  currencyService:  CurrencyService, public coinTextService: CoinTextService,public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    this.platform = isPlatformBrowser(platformId) ? true : false;
    console.log(`Running ${this.platform} with appId=${appId}`);
    this.initIoConnection();

  }

  selectRow(row:any, src:any){  //For Expanding Specific Row
    if(!this.isSortAll){
      var index = _.findIndex(this.sortedData, function(data:any) {
        return data.crypto == row.crypto;
      });
      // @ts-ignore
      this.sortedData[index].expand = !this.sortedData[index].expand;
    }
  }

  expandAll() {     //For Expanding All Rows
    this.isSortAll = !this.isSortAll;
    for (var i = 0; i < this.sortedData.length; i++) {
      this.sortedData[i].expand = this.isSortAll;
    }
  }

  updateRecordsToDisplay(){
    console.log("updateRecordsToDisplay =",this.records, this.toDisplay);
    this.records = this.toDisplay;
  }

  // setCurrencyDetail(currency){
  //   // console.log("currency",currency);
  //   this.currencyService.setCurrency(currency)
  // }

  public initIoConnection(): void { //Socket
    let that = this;
    this.socketService.initSocket();

    if(!this.platform){
      this.socketService.disconnectSocket();
    }

    this.ioConnection = this.socketService.onMessage('message')
      .subscribe((message) => {
        console.log(message);
      });
    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('Connected');
        this.sendNotification("crypto-metadata", this.msg);
      });
    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });

    this.socketService.onMessage("crypto-metadata").subscribe((response) => {
      // console.log(response);
      let diff = null;
      if (that.sortedData.length == 0) { //Initialisation Of Obj
        let keys = _.keys(response);
        let sortedKeys = _.sortBy(keys, function(key) {
          return key;
        });
        let counter = 0;
        _.each(sortedKeys, function(key) {
          response[key].crypto = key;
          // if (that.sortedData.length == 0) response[key].expand = true;
          // else response[key].expand = false;
          if (key == 'BTC'){
            response[key].expand = true;
            that.previousIndex = counter;
          } else{
            response[key].expand = false;
          }
          response[key].info = that.info;
          that.sortedData.push(response[key]);
          counter++;
        });
        this.orderBy('market_cap');
        // this.previousIndex = 0;
      } else {
        _.forOwn(response, function(value, key) {   //For Updating individual Key Value in Scope
          var index = _.findIndex(that.sortedData, function(data) {
            return data.crypto == key;
          });
          // console.log(index,"value",that.sortedData[index]);
          value.crypto = key;
          value.info = that.info;
          value.isFresh = true;
          value.time = Date.now();
          if(index>=0){
            if(that.sortedData[index]){
              if(that.sortedData[index].bid){
                if(value.bid){ diff = value.bid - that.sortedData[index].bid;}
                else{ diff = that.sortedData[index].bid;}

                that.valueDiff = that.sortedData[index] ? diff : 0;
                if(that.valueDiff > 0) value.nBid = 1;
                if(that.valueDiff < 0) value.nBid = -1;
                if(that.valueDiff == 0) value.nBid = 0;
              }
              if(that.sortedData[index].last){
                if(value.last){ diff = value.last - that.sortedData[index].last;}
                else{ diff = that.sortedData[index].last;}

                that.valueDiff = diff.toFixed(2);
                if(that.valueDiff > 0) value.nLast = 1;
                if(that.valueDiff < 0) value.nLast = -1;
                if(that.valueDiff == 0) value.nLast = 0;
              }
              if(that.sortedData[index].ask){
                if(value.ask){ diff = value.ask - that.sortedData[index].ask;}
                else{ diff = that.sortedData[index].ask;}

                that.valueDiff = diff.toFixed(2);
                if(that.valueDiff > 0) value.nAsk = 1;
                if(that.valueDiff < 0) value.nAsk = -1;
                if(that.valueDiff == 0) value.nAsk = 0;
              }
              if(that.sortedData[index].high){
                if(value.high){ diff = value.high - that.sortedData[index].high;}
                else{ diff = that.sortedData[index].high;}

                that.valueDiff = diff.toFixed(2);
                if(that.valueDiff > 0) value.nHigh = 1;
                if(that.valueDiff < 0) value.nHigh = -1;
                if(that.valueDiff == 0) value.nHigh = 0;
              }
              if(that.sortedData[index].low){
                if(value.low){ diff = value.low - that.sortedData[index].low;}
                else{ diff = that.sortedData[index].low;}

                that.valueDiff = diff.toFixed(2);
                if(that.valueDiff > 0) value.nLow = 1;
                if(that.valueDiff < 0) value.nLow = -1;
                if(that.valueDiff == 0) value.nLow = 0;
              }
              if(that.sortedData[index].market_cap){
                if(value.market_cap){ diff = value.market_cap - that.sortedData[index].market_cap;}
                else{ diff = that.sortedData[index].market_cap;}

                that.valueDiff = diff.toFixed(2);
                if(that.valueDiff > 0) value.nMarketCap = 1;
                if(that.valueDiff < 0) value.nMarketCap = -1;
                if(that.valueDiff == 0) value.nMarketCap = 0;
              }
              if(that.sortedData[index].volume){
                if(value.volume){ diff = value.volume - that.sortedData[index].volume;}
                else{ diff = that.sortedData[index].volume;}

                that.valueDiff = diff.toFixed(2);
                if(that.valueDiff > 0) value.nVolume = 1;
                if(that.valueDiff < 0) value.nVolume = -1;
                if(that.valueDiff == 0) value.nVolume = 0;
              }
              if(that.sortedData[index].change_percent){
                // that.valueDiff = value.change_percent.toFixed(2) - that.sortedData[index].change_percent.toFixed(2);
                // if( value.change_percent > 0) value.nChangePercent = 1;
                // if( value.change_percent < 0) value.nChangePercent = -1;
                // if( value.change_percent == 0) value.nChangePercent = 0;
              }
              if (that.sortedData[index].expand) {
                value.expand = true;
                that.expandIndex = index;
              }
              else {
                value.expand = false;
              }
              that.sortedData[index] = value;
            }
          }
          else{
            value.expand = false
            value.countId = that.sortedData.length;
            that.sortedData[that.sortedData.length] = value;
          }

          setTimeout(() => {
            // if(Date.now() - value.time > 30000) that.sortedData[index].isFresh = false;
            if(Date.now() - value.time > 500) that.sortedData[index].isFresh = false;
          },500);
        })
        if (!that.isSortAll) {
          if (that.previousIndex >=0) {
            that.sortedData[that.previousIndex].expand = false;
            that.previousIndex = -1;
            that.selectRow(that.sortedData[that.expandIndex],"bottom");
          }
        }
      }
    });

    this.socketService.onMessage("frontend").subscribe((data) => {
      console.log("Received local market");
    });

    this.socketService.onMessage("main-price").subscribe((data) => {
      console.log("Received main price");
      console.log(data);
    });
  }

  public sendNotification(type:any, message:any): void {
    this.socketService.send(type, message);
  }

  orderBy(name: string) {
    // @ts-ignore
    if (this[name]){
      // @ts-ignore
      this[name] = !this[name];
      this.bSort = !this.bSort
    }
    else{
      // @ts-ignore
      this[name] = true;
      this.bSort = true;
    }
    this.orderByCol = name;
  }

  //Navigating
  redirect(crypto:any,toConvert:any,type:any){
    this.selectedCurrency = toConvert;
    this.currencyService.setCurrencyType(type);
    this.router.navigate(['coins', crypto, toConvert]);
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.socketService.disconnectSocket();
  }
}
