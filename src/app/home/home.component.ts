import { Component, OnInit, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ParticlesConfig } from '../../assets/data/particles';

declare let particlesJS: any
declare var $: any;



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public dummyData: any = [{
    change: 944.35,
    name: "GBXUSD",
    price: 54521.69,
    symbol: "$"
  }, {
    change: 942.73,
    name: "GBXEUR",
    price: 45133,
    symbol: "€"
  }, {
    change: 964,
    name: "Bitfinex",
    price: 54515,
    symbol: "$"
  }, {
    change: 945.19,
    name: "Coinbase Pro",
    price: 54527.43,
    symbol: "$"
  }, {
    change: 953.83,
    name: "Bitstamp",
    price: 54544.25,
    symbol: "$"
  }, {
    change: 1003.2,
    name: "Kraken",
    price: 54539.9,
    symbol: "$"
  }]


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

  

  customOptions: OwlOptions = {
    mouseDrag: false,
    touchDrag: false,
    autoplay: true,
    dots: false,
    loop:true,
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 3
      },
      740: {
        items: 5
      },
      940: {
        items: 5
      },
      1040: {
        items: 4 
      }

    },

  }

  
  // customOptions :any = [{
  //   'autoPlay': true,
  //   'slideSpeed': 2000,
  //   'pagination': false,
  //   'navigation': true,
  //   'navigationText': ['', ''],
  //   'items': 4,
  //   'transitionStyle': "fade",
  //   /* [This code for animation ] */
  //   'itemsDesktop': [1199, 5],
  //   'itemsDesktopSmall': [980, 4],
  //   'itemsTablet': [768, 3],
  //   'itemsMobile': [479, 2],
  // }];

  
  // @ViewChild('owlElement') owlElement!: OwlCarousel;

  isSortAll = false;

  // nextFun() {
  //   this.owlElement.next([200])
  // }
  // previoudFun() {
  //   this.owlElement.previous([200])
  // }

  constructor() { }


  
  ngOnInit() {
    this.invokeParticles()
    

  }


  onNext() {
    (document.getElementsByClassName('owl-next')[0] as HTMLElement).click()
    
  }

  onPrev() {
    (document.getElementsByClassName('owl-prev')[0] as HTMLElement).click()

  }

  public invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig, function () {
      console.log('loaded')
    });


  }
}
