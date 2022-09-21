import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule, SwRegistrationOptions } from '@angular/service-worker';
import { AppComponent } from './app.component';
import { ShoppingCartItemComponent } from './shopping-cart-item/shopping-cart-item.component';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AfisareProduseComponent } from './afisare-produse/afisare-produse.component';
import { RouterModule } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table'
import { MaterialComponentsModule } from './material-components/material-components.module';
import { MatIconModule } from '@angular/material/icon';

import { MatDialogModule } from '@angular/material/dialog';

import { DetaliiComponent } from './detalii/detalii.component';


import { ReactiveFormsModule } from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HomeComponent } from './home/home.component';
import { ScanariComponent } from './scanari/scanari.component';
import { ProduseComponent } from './produse/produse.component';
import { BackDirective } from './back.directive';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';



@NgModule({
  declarations: [
    AppComponent,
    ShoppingCartItemComponent,
    AfisareProduseComponent,


    DetaliiComponent,



    DetaliiComponent,
    HomeComponent,
    ScanariComponent,
    ProduseComponent,
    BackDirective,




  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    MatTabsModule,
    MatTableModule,
    MaterialComponentsModule,
    BrowserAnimationsModule,
    MatIconModule,

    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,

    MatButtonModule,
    MatSelectModule,

    MatFormFieldModule,
    MatToolbarModule,





    // PWA support
    ServiceWorkerModule.register('ngsw-worker.js'),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: SwRegistrationOptions,
      useFactory: () => {
        return {
          enabled: environment.production,
          registrationStrategy: 'registerImmediately'
        };
      }
    },



  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
