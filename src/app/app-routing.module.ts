import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    // @ts-ignore
    loadChildren: () => import('./orders/orders-routing.module').then((m) => m.OrdersRoutingModule),
  },
  {
    path: 'products',
    // @ts-ignore
    loadChildren: () => import('./products/products-routing.module').then((m) => m.ProductsRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
