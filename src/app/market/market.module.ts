import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MarketComponent } from './market.component';

const routes: Routes = [
  {
    path: '',
    component: MarketComponent
  }
];


@NgModule({
  declarations: [
    MarketComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    RouterModule.forChild(routes)
  ]
})
export class MarketModule { }
