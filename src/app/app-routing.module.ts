import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { AfisareProduseComponent } from './afisare-produse/afisare-produse.component';
import { ShoppingCart } from './shopping-cart';
import { DetaliiComponent } from './detalii/detalii.component';


const routes: Routes = [
  { path: '', redirectTo: 'AppComponent', pathMatch: 'full' },
  { path: 'produse', component: AfisareProduseComponent },
  { path: 'cart', component: ShoppingCart },

  { path: 'detalii', component: DetaliiComponent },
  { path: 'detalii/:_id', component: DetaliiComponent },

  { path: 'detalii', component: DetaliiComponent }

];


@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      // { enableTracing: true }
       // <-- debugging purposes only
    )
    // other imports here
  ],

})
export class AppRoutingModule { }
