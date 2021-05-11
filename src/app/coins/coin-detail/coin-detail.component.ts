// @ts-nocheck
import { Component, OnInit, OnDestroy, ViewChild , PLATFORM_ID, APP_ID, Inject} from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { Subscription } from 'rxjs';
import { SocketService } from '../../shared/services/socket.service';
import { CurrencyService } from '../../shared/services/currency.service';
import { ApicallsService } from '../../shared/services/apicalls.service';

import { RoutePath } from '../../shared/services/routepath.service';

import { Event } from '../../event.enum';
declare var jQuery: any;

import * as _ from "lodash";
import * as moment from "moment";
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.css']
})
export class CoinDetailComponent implements OnInit, OnDestroy {

  ioConnection: any;
  cryptoData: any = {};
  type:any = 0;
  crypto:any;
  lastValue:any;
  selectedCurrency = 'USD';
  tabData:any = {};
  popperTab:string = '';
  get decimalPlaces() {
    return this.popperTab === 'local' ? '.2-2' : '.2-8';
  }
  isPopper:boolean = false;
  cryptoDetail:any = [
                      {url:"ada-usd",short:"ADA",name:"Cardano",conversion:"ADA/USD",image:"ADA.png"},
                      {url:"btc-usd",short:"BTC",name:"Bitcoin",conversion:"BTC/USD",image:"BTC.png"},
                      {url:"dash-usd",short:"DASH",name:"Dash",conversion:"DASH/USD",image:"DASH.png"},
                      {url:"eth-usd",short:"ETH",name:"Ethereum",conversion:"ETH/USD",image:"ETH.png"},
                      {url:"ltc-usd",short:"LTC",name:"Litecoin",conversion:"LTC/USD",image:"LTC.png"},
                      {url:"qtum-btc",short:"QTUM",name:"QTUM",conversion:"QTUM/BTC",image:"QTUM.png"},
                      {url:"xmr-usd",short:"XMR",name:"Monero",conversion:"XMR/USD",image:"XMR.png"},
                      {url:"xrp-usd",short:"XRP",name:"Ripple",conversion:"XRP/USD",image:"XRP.png"},
                      {url:"zec-usd",short:"ZEC",name:"Zcash",conversion:"ZEC/USD",image:"ZEC.png"}
                    ];
  currencyData:any = {};
  msg:any;
  popper:any={};


  isHour:boolean = true;
  isDay:boolean = false;
  isWeek:boolean = false;
  isMonth:boolean = false;

  // Chart
  public lineChartData:Array<any> = [
    {data: [], label: ''}
    // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    // {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  // public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartLabels:Array<any> = [];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType: ChartType = 'line';
  private paramMapSubscription: Subscription;

  private activatedRoute: ActivatedRoute;
  platform: boolean;

  constructor(private socketService: SocketService,
              private  currencyService:  CurrencyService,
              private api: ApicallsService,
              private route: ActivatedRoute,
              private router: Router,
              private routepath: RoutePath,
              @Inject(PLATFORM_ID) private platformId: Object,
              @Inject(APP_ID) private appId: string
            ) {
    this.platform = isPlatformBrowser(platformId) ? true : false;
    console.log(`Running ${this.platform} with appId=${appId}`);
    this.activatedRoute = route;
  }

  private initIoConnection(): void { //Socket
    this.socketService.initSocket();
    this.ioConnection = this.socketService.onMessage('message')
      .subscribe((message) => {
        console.log(message);
    });
    if(!this.platform){
      this.socketService.disconnectSocket();
    }
    this.socketService.onEvent(Event.CONNECT).subscribe(() => {
        console.log('connected');
        this.sendNotification("market-data", this.msg);
      });
    this.socketService.onEvent(Event.DISCONNECT).subscribe(() => {
        console.log('disconnected');
      });

    this.socketService.onMessage("market-data").subscribe((response) => {
        // console.log("market-data",response);
        if(response){
          this.cryptoData = response;
          this.cryptoData.isFresh = true;
          if(this.lastValue > this.cryptoData.last.toFixed(2)) this.cryptoData.nLast = -1;
          else if(this.lastValue < this.cryptoData.last.toFixed(2)) this.cryptoData.nLast = 1;
          this.lastValue = this.cryptoData.last.toFixed(2);
          setTimeout(() => {
            this.cryptoData.isFresh = false;
            this.cryptoData.nLast = 0;
          },1000);
        }else{
          this.cryptoData = {};
        }
    });
  }

  public sendNotification(type, message): void {
    this.socketService.send(type, message);
  }

  setCurrencyDetail(currency,index,tab):any{
    this.selectedCurrency = currency;
    this.historyData("hour");
  }

  chartClicked(){
  }

  openPopup(){
  }

  //Navigating
  redirect(crypto,toConvert,type){
    this.selectedCurrency = toConvert;
    this.currencyService.setCurrencyType(type);
    this.router.navigate(['coins', crypto, toConvert]);
  }

  historyData(period){
    this.isHour=this.isDay=this.isWeek=this.isMonth=false;
    let format = "DD MMM HH:mm";
    if(period=="hour"){
      this.isHour = true;
      format = "HH:mm";
    }
    else if(period=="day"){
      this.isDay = true;
      format = "dd HH:mm";
    }
    else if(period=="week"){
      this.isWeek = true;
    }
    else if(period=="month"){
      this.isMonth = true;
    }
    this.api.historicalData(this.crypto, this.selectedCurrency, period, this.popperTab)
      .subscribe(
         data => {
           // console.log("Historical data",data);
           this.filterData(data,format);
         },error => {
           console.error("error",error);
         });
  }

  filterData(data,format){
    let plotData = [];
    let markingData = [];
    for (let i = 0; i < data.length; i++) {
        if(data[i].price && data[i].time){
          plotData.push(data[i].price.toFixed(4));
          markingData.push(moment(data[i].time).format(format));
        }
    }
    this.lineChartData[0].data = plotData;
    this.lineChartData[0].label = this.crypto+"-"+this.selectedCurrency;
    this.lineChartLabels = markingData;
  }

  currencyTab(){
    this.api.currencyTabData(this.crypto)
      .subscribe(
         data => {
            this.tabData = data;
         },error => {
           console.log("error",error);
         });
  }

  initialiseData(){
    this.msg = {"type":this.type,"symbol":this.crypto.toLowerCase()+'-'+this.selectedCurrency.toLowerCase()};
    // this.msg = {"type":'local',"symbol":this.crypto.toLowerCase()+'-'+this.selectedCurrency.toLowerCase()};

    this.initIoConnection();
    this.api.popper(this.crypto).subscribe(
       data => {
            if (data) {
              this.popper = data;
              let that = this;
              if(this.popper.fiat){
                for (let i = 0; i < this.popper.fiat.length; i++) {
                    if(that.popper.fiat[i] == that.selectedCurrency) that.popperTab = 'local';
                }
              }
              if(this.popper.crypto){
                for (let i = 0; i < this.popper.crypto.length; i++) {
                  if(that.popper.crypto[i] == that.selectedCurrency) that.popperTab = 'crypto';
                }
              }
              if(this.popper.tokens){
                for (let i = 0; i < this.popper.tokens.length; i++) {
                    if(that.popper.tokens[i] == that.selectedCurrency) that.popperTab = 'token';
                }
              }
            }
            this.historyData("hour");
       },error => {
         console.log("error",error);
       });
    // this.historyData("hour");
  }
  ngOnInit() {
    this.paramMapSubscription = this.activatedRoute.paramMap.subscribe(
            ( paramMap: ParamMap ) : void => {
                this.cryptoData.display_name = "";
                this.crypto = paramMap.get('crypto');
                this.selectedCurrency = paramMap.get('currency');
                // this.popperTab = this.currencyService.getCurrencyType();
                this.socketService.disconnectSocket();
                this.routepath.sendMessage({crypto:this.crypto,currency:this.selectedCurrency});

                this.initialiseData();
                this.currencyTab();
            }
    );
    if(this.platform) {
      jQuery(window).click(function(e) {
        if(e.target.id != "fiat-tab" && e.target.id != "crypto-tab" && e.target.id != "token-tab"){
          jQuery("#currency-popper").removeClass("show");
        }
      });
      jQuery('#dropdownMenuLink').click(
        function () {
          // console.log("Clicked Pop");
          if(!jQuery("#currency-popper").hasClass("show")){
            jQuery("#currency-popper").addClass("show");
          }
        }
      );
      jQuery('#fiat-tab').click(
        function () {
          this.popperTab ="fiat";
          if(!jQuery("#currency-popper").hasClass("show")){
            jQuery("#currency-popper").addClass("show");
          }
        }
      );
      jQuery('#crypto-tab').click(
        function () {
          this.popperTab ="crypto";
          if(!jQuery("#currency-popper").hasClass("show")){
            jQuery("#currency-popper").addClass("show");
          }
        }
      );
      jQuery('#token-tab').click(
        function () {
          this.popperTab ="token";
          if(!jQuery("#currency-popper").hasClass("show")){
            jQuery("#currency-popper").addClass("show");
          }
        }
      );
    }
  }

  ngOnDestroy() {
    ( this.paramMapSubscription ) && this.paramMapSubscription.unsubscribe();
    console.log("Destroying Socket...");
    this.socketService.disconnectSocket();
  }
}
