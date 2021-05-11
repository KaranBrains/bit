import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoinDetailComponent } from './coin-detail/coin-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CoinDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoinsRoutingModule { }
