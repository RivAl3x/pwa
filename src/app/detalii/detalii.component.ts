import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BeepService } from '../beep.service';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Article } from '../article';

import { FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-detalii',
  templateUrl: './detalii.component.html',
  styleUrls: ['./detalii.component.scss']
})
export class DetaliiComponent implements OnInit {
  produs: Article = {} as Article;
  produsId: any = '';

  listingForm: FormGroup;
  listing: Article = {} as Article;




  constructor(public beepService: BeepService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.produsId = this.route.snapshot.paramMap.get('_id');
    this.produsId = this.route.params.subscribe(params => {
      this.getDocById(params['_id']);
      console.log(this.produsId)
    });
    //initiaza form
    this.initForm(this.listing);
  }

  getDocById(id: any): void {

    this.beepService.getDocById(id)
      .subscribe(res => this.produs = res);

  }
  private initForm(listing: Article) {
    console.info('listing: ListingModel -- ', listing);

    // let id = listing._id ? listing._id : null;
    let name = listing.name ? listing.name : null;
    let ean = listing.ean ? listing.ean : null;
    let price = listing.price ? listing.price : null;
    // let image = listing.image ? listing.image : null;

    this.listingForm = new FormGroup({
      // id: new FormControl(id),
      name: new FormControl(name),
      ean: new FormControl(ean),
      price: new FormControl(price),
      // image: new FormControl(image)
    });

  }


  async onSaveListing(listingForm: any) {
    console.log(listingForm, "triims pentru salvare")
    this.listing = this.listingForm.value;
    console.log(this.listing, "this.listing")

    await this.beepService.saveListing(this.listing).
      subscribe(res => this.produs = res);
    this.beepService.getDocs();
  }


}
