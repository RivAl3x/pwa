import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { BeepService } from '../beep.service';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, map, Observable } from 'rxjs';
import { Article } from '../article';

import { FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
@Component({
  selector: 'app-detalii',
  templateUrl: './detalii.component.html',
  styleUrls: ['./detalii.component.scss']
})
export class DetaliiComponent implements OnInit {

  // produs: Article = {} as Article;
  produsId: any;

  listingForm: FormGroup;
  listing: Article = {} as Article;
  eanCodeSes: any;


  constructor(public beepService: BeepService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.produsId = this.route.snapshot.paramMap.get('_id');
    this.produsId = this.route.params.subscribe(params => {
      if (params['_id']) {
        this.getDocById(params['_id']);
      }
      this.eanCodeSes = localStorage.getItem('eanCode');
      console.log("EAN CODE from SESSION:", this.eanCodeSes)
    });
    // initiaza form
    this.initForm({
      name: '',
      ean: this.eanCodeSes,
      price: 0
    });

    console.log(this.listing)

  }






  async getDocById(id: any): Promise<void> {
    this.beepService.getDocById(id)
      .subscribe(response => this.listing = response);
    console.log(this.listing)

    // setTimeout(() => {
    //   console.log("Delayed for 1 second.");
    this.initForm(this.listing);
    // }, 300)


    // const response = await lastValueFrom( this.beepService.getDocById(id));
    // console.log(this.listing)
    // console.log("VAR RESPONSE:",response)
    // this.listing = response;
    // return this.initForm(this.listing);
  }


  private initForm(listing: Article) {
    console.info('listing: ListingModel -- ', listing);
    let _id = listing._id ? listing._id : null;
    let name = listing.name ? listing.name : null;
    let ean = listing.ean ? listing.ean : null;
    let price = listing.price ? listing.price : null;
    // let image = listing.image ? listing.image : null;
    this.listingForm = new FormGroup({
      id: new FormControl(_id),
      name: new FormControl(name),
      ean: new FormControl(ean),
      price: new FormControl(price),
      // image: new FormControl(image)
    });

  }

  beforeonSaveListing(listingForm: any, tip: any) {
    console.log(this.produsId)
    if (tip == 1) {
      this.onSaveListing(listingForm)
    } else {
      this.onUpdateListing(listingForm, this.produsId)
    }
  }

  async onSaveListing(listingForm: any) {
    // console.log(listingForm, "triims pentru salvare")
    this.listing = this.listingForm.value;
    // console.log(this.listing, "this.listing")

    this.beepService.saveListing(this.listing).
      subscribe(res => this.listing = res);
    this.beepService.getDocs();
  }


}
