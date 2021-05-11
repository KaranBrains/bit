import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path:'markets',
    loadChildren: () => import('./market/market.module').then(m => m.MarketModule),
  },
  {
    path:'coins/:crypto/:currency',
    loadChildren: () => import('./coins/coins.module').then(m => m.CoinsModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[]
})
export class AppRoutingModule { }
