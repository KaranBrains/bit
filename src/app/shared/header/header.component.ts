import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {ApicallsService} from '../services/apicalls.service';
import {CurrencyService} from '../services/currency.service';
import {RoutePath} from '../services/routepath.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  topCoins: any = [];
  topCoinsFirst: any = [];
  topCoinsSecond: any = [];
  coins: any = [];
  topExchanges: any = [];
  searchText: any;
  selectedCurrency: any;
  currentCrypto: any;
  currentCurrency: any;
  currencyDetail: any;
  URL: string = '';
  cryptoDetail: any = [
    {url: 'ada-usd', currency: 'ADA', name: 'Cardano', conversion: 'ADA/USD', image: 'ADA'},
    {url: 'btc-usd', currency: 'BTC', name: 'Bitcoin', conversion: 'BTC/USD', image: 'BTC'},
    {url: 'dash-usd', currency: 'DASH', name: 'Dash', conversion: 'DASH/USD', image: 'DASH'},
    {url: 'eth-usd', currency: 'ETH', name: 'Ethereum', conversion: 'ETH/USD', image: 'ETH'},
    {url: 'ltc-usd', currency: 'LTC', name: 'Litecoin', conversion: 'LTC/USD', image: 'LTC'},
    {url: 'qtum-btc', currency: 'QTUM', name: 'QTUM', conversion: 'QTUM/BTC', image: 'QTUM'},
    {url: 'xmr-usd', currency: 'XMR', name: 'Monero', conversion: 'XMR/USD', image: 'XMR'},
    {url: 'xrp-usd', currency: 'XRP', name: 'Ripple', conversion: 'XRP/USD', image: 'XRP'},
    {url: 'zec-usd', currency: 'ZEC', name: 'Zcash', conversion: 'ZEC/USD', image: 'ZEC'}
  ];

  private subscription: any;

  constructor(private currencyService: CurrencyService,
              private api: ApicallsService,
              activatedRoute: ActivatedRoute,
              private router: Router,
              private routepath: RoutePath,
              private cdRef: ChangeDetectorRef
  ) {
    activatedRoute = activatedRoute;

    this.api.menu().subscribe(
      (data: any) => {
        // console.log('data',data);
        let splitCurrency = [];
        let currencyDetail: any = {};
        for (const coin of data.top_coins) {
          splitCurrency = coin.split('(');
          currencyDetail.name = splitCurrency[0];
          currencyDetail.short = splitCurrency[1].split(')')[0];
          this.topCoins.push(currencyDetail);
          currencyDetail = {};
        }
        this.topCoinsFirst = this.topCoins.splice(0, 5);
        this.topCoinsSecond = this.topCoins;
        const coinData = null;
        for (const coin of data.coins) {
          currencyDetail.full = coin;
          splitCurrency = coin.split('(');
          currencyDetail.name = splitCurrency[0];
          currencyDetail.short = splitCurrency[1].split(')')[0];
          
          currencyDetail.image = currencyDetail.short + '.png';
          this.coins.push(currencyDetail);
          currencyDetail = {};
        }
        // this.currencyService.setCurrencyType(this.coins);
        this.topExchanges = data.top_exchanges;
      }, (error: any) => {
        console.log('error', error);
      });
  }

  redirect(crypto: any, toConvert: any, type: any) {
    this.selectedCurrency = toConvert;
    this.currencyService.setCurrencyType(type);
    this.router.navigate(['coins', crypto, toConvert]);
  }

  redirectHome(): void {
    this.router.navigate(['']);
  }

  redirectRegister(): void {
    window.location.href = 'https://pro.bitcoinaverage.com/pages/auth/register';
  }

  getByClass(className: any) {
    return <HTMLElement>document.getElementsByClassName(className)[0];
  }

  activateCryptoMenu(menu: any) {
    const actives = document.getElementsByClassName('active');
    while (actives.length) {
      actives[0].classList.remove('active');
    }
    menu.classList.add('active');
    this.getByClass('sub-menu').style.display = 'block';
    this.getByClass('crypto-markets').style.display = 'flex';
    this.getByClass('menu-data').style.display = 'none';
    this.getByClass('menu-api').style.display = 'none';
  }


  setupMenuActions() {
    const that = this;
    (document.getElementById('bulk_menu') as HTMLElement).onclick = function () {
      const elem = that.getByClass('navigation-bar');
      if (elem.style.display === 'flex') {
        elem.style.display = 'none';
      } else {
        elem.style.display = 'flex';
      }
    };
    (document.getElementById('crypto_mt') as HTMLElement).onclick = function () {
      that.activateCryptoMenu(this);
    };
    
    (document.getElementById('data_mt')as HTMLElement ).onclick = function () {
      const actives = document.getElementsByClassName('active');
      while (actives.length) {
        actives[0].classList.remove('active');
      }
      (document.getElementById('data_mt')as HTMLElement ).classList.add('active')
      that.getByClass('sub-menu').style.display = 'block';
      that.getByClass('menu-data').style.display = 'flex';
      that.getByClass('crypto-markets').style.display = 'none';
      that.getByClass('menu-api').style.display = 'none';
    };
    (document.getElementById('api_mt')as HTMLElement).onclick = function () {
      const actives = document.getElementsByClassName('active');
      while (actives.length) {
        actives[0].classList.remove('active');
      }
      (document.getElementById('data_mt')as HTMLElement ).classList.add('active')
      that.getByClass('sub-menu').style.display = 'block';
      that.getByClass('menu-api').style.display = 'flex';
      that.getByClass('crypto-markets').style.display = 'none';
      that.getByClass('menu-data').style.display = 'none';
    };

    (document.getElementById('global-indices') as HTMLElement).onmouseenter = function() {
      const elem = that.getByClass('sub-sub-menu-global-indices');
      elem.style.display = 'flex';
    };

    (document.getElementById('global-indices') as HTMLElement).onmouseleave = function() {
      const elem = that.getByClass('sub-sub-menu-global-indices');
      elem.style.display = 'none';
    };

    (document.getElementById('popular-coins') as HTMLElement).onmouseenter = function() {
      const elem = that.getByClass('sub-sub-menu-popular-coins');
      elem.style.display = 'flex';
    };

    (document.getElementById('popular-coins') as HTMLElement).onmouseleave = function() {
      const elem = that.getByClass('sub-sub-menu-popular-coins');
      elem.style.display = 'none';
    };

    (document.getElementById('popular-coins') as HTMLElement).onclick = function () {
      const elem = that.getByClass('sub-sub-menu-popular-coins');
      if (elem.style.display === 'flex') {
        elem.style.display = 'none';
      } else {
        elem.style.display = 'flex';
      }
    };
    (document.getElementById('open-crypto-mb') as HTMLElement).onclick = function () {
      const elem = that.getByClass('crypto-area');
      const arrowElem: any = document.getElementById('crypto_arrow');
      if (elem.style.display === 'block') {
        elem.style.display = 'none';
        arrowElem.style.transform = 'rotate(360deg)';
      } else {
        elem.style.display = 'block';
        arrowElem.style.transform = 'rotate(180deg)';
      }
    };
    (document.getElementById('glb-indices') as HTMLElement).onclick = function (event) {
      event.stopPropagation();
      const elem = that.getByClass('global-idc-content');
      if (elem.style.display === 'block') {
        elem.style.display = 'none';
        (document.getElementById('glb_arrow') as HTMLElement).style.transform = 'rotate(360deg)';
      } else {
        elem.style.display = 'block';
        (document.getElementById('glb_arrow') as HTMLElement).style.transform = 'rotate(180deg)';
      }
    };
    (document.getElementById('pop-coins') as HTMLElement).onclick = function (event) {
      event.stopPropagation();
      const elem = that.getByClass('popular-cns-content');
      if (elem.style.display === 'flex') {
        elem.style.display = 'none';
        (document.getElementById('pop_arrow') as HTMLElement).style.transform = 'rotate(360deg)';
      } else {
        elem.style.display = 'flex';
        (document.getElementById('pop_arrow') as HTMLElement).style.transform = 'rotate(180deg)';
      }
    };
    (document.getElementById('data-mb-ct') as HTMLElement).onclick = function () {
      const elem = that.getByClass('data-links-nav');
      if (elem.style.display === 'block') {
        elem.style.display = 'none';
        (document.getElementById('data_arrow') as HTMLElement).style.transform = 'rotate(360deg)';
      } else {
        elem.style.display = 'block';
        (document.getElementById('data_arrow') as HTMLElement).style.transform = 'rotate(180deg)';
      }
    };
    (document.getElementById('api-mb-ct') as HTMLElement).onclick = function () {
      const elem = that.getByClass('api-links-nav');
      if (elem.style.display === 'block') {
        elem.style.display = 'none';
        (document.getElementById('api_arrow') as HTMLElement).style.transform = 'rotate(360deg)';
      } else {
        elem.style.display = 'block';
        (document.getElementById('api_arrow')as HTMLElement).style.transform = 'rotate(180deg)';
      }
    };
  }

  ngOnInit() {
    this.subscription = this.routepath.getMessage().subscribe((detail: any) => {
      this.currentCrypto = detail.crypto;
      this.currentCurrency = detail.currency;
      this.URL = '/coins/' + this.currentCrypto + '/' + this.currentCurrency;
      this.cdRef.detectChanges();
      // console.log(this.currentCrypto ,' - ',this.currentCurrency);
    });
    this.setupMenuActions();
    const cryptoMenu = document.getElementById('crypto_mt');
    this.activateCryptoMenu(cryptoMenu);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }


  


  

}
