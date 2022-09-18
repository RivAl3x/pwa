import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { AfisareProduseComponent } from './afisare-produse/afisare-produse.component';
import { ShoppingCart } from './shopping-cart';
import { DetaliiComponent } from './detalii/detalii.component';
import { HomeComponent } from './home/home.component';
import { ScanariComponent } from './scanari/scanari.component';
import { ProduseComponent } from './produse/produse.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'cart', component: ShoppingCart },
  { path: 'detalii', component: DetaliiComponent },
  { path: 'detalii/:_id', component: DetaliiComponent },
  { path: 'home', component: HomeComponent },
  { path: 'scanari', component: ScanariComponent },
  { path: 'produse', component: ProduseComponent }

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
