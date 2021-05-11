import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoinsRoutingModule } from './coins-routing.module';
import { CoinDetailComponent } from './coin-detail/coin-detail.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlModule } from 'ngx-owl-carousel';
import { ShortNumberPipe } from './../shared/pipes/short-number.pipe';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    CoinsRoutingModule,
    NgbModule,
    ChartsModule
  ],
  declarations: [CoinDetailComponent,ShortNumberPipe]
})
export class CoinsModule { }
