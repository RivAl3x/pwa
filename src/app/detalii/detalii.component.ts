import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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

import { Location } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialog } from '@angular/material/dialog';



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
  justSaveBtn:any;
  justUpdateBtn:any;
  public dialog: MatDialog;

  constructor(public beepService: BeepService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
    ) { }

  ngOnInit(): void {
    // this.produsId = this.route.snapshot.paramMap.get('_id');
    this.produsId = this.route.params.subscribe(params => {
      if (params['_id']) {
        this.getDocById(params['_id']);
      }
      this.eanCodeSes = localStorage.getItem('eanCode');
      var paramsId = params['_id'];
      localStorage.setItem('paramsId', paramsId)

      console.log("EAN CODE from SESSION:", this.eanCodeSes)
    });

    // this.initForm({
    //   name: '',
    //   ean: this.eanCodeSes,
    //   price: 0
    // });

    // console.log(this.listing)

    //pentru afisare in detalii din scanari EAN
    this.listingForm = new FormGroup({
      name: new FormControl(),
      ean: new FormControl(this.eanCodeSes),
      price: new FormControl(),
      magazin: new FormControl()

    });

    this.justSaveBtn = sessionStorage.getItem('justSaveBtn');
  }
  // openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
  //   this.dialog.open(DialogAnimationsExampleDialog, {
  //     width: '250px',
  //     enterAnimationDuration,
  //     exitAnimationDuration,
  //   });
  // }



  deleteProduct() {
    this.beepService.deleteListing().subscribe(res => {
      console.log('Deleted')})
    }


  goBack(): void {
    this.location.back();
    sessionStorage.removeItem('justSaveBtn');
  }




  async getDocById(id: any): Promise<void> {
    this.beepService.getDocById(id)
      .subscribe(response => this.listing = response);


    let name = this.listing.name ? this.listing.name : null;
    let ean = this.listing.ean ? this.listing.ean : null;
    let price = this.listing.price ? this.listing.price : undefined;
    let magazin = this.listing.magazin ? this.listing.magazin : undefined;

    this.listingForm = new FormGroup({
        name: new FormControl(name),
        ean: new FormControl(ean),
        price: new FormControl(price),
        magazin: new FormControl(magazin)

      });

    // console.log(this.listing)

    // setTimeout(() => {
    //   console.log("Delayed for 1 second.");
    // ===this.initForm(this.listing);
    // }, 300)


    // const response = await lastValueFrom( this.beepService.getDocById(id));
    // console.log(this.listing)
    // console.log("VAR RESPONSE:",response)
    // this.listing = response;
    // return this.initForm(this.listing);
  }


  // private initForm(listing: Article) {
  //   console.info('listing: ListingModel -- ', listing);
  //   // let _id = listing._id ? listing._id : null;
  //   let name = listing.name ? listing.name : null;
  //   let ean = listing.ean ? listing.ean : null;
  //   let price = listing.price ? listing.price : undefined;
  //   // let image = listing.image ? listing.image : null;
  //   this.listingForm = new FormGroup({
  //     // _id: new FormControl(_id),
  //     name: new FormControl(name),
  //     ean: new FormControl(ean),
  //     price: new FormControl(price),
  //     // image: new FormControl(image)
  //   });

  // }



  beforeonSaveListing(listingForm: any, tip: any) {
    // console.log(this.produsId)
    if (tip == 1) {
      this.onSaveListing(listingForm)
    } else if(tip==2) {
      this.onUpdateListing(listingForm)
    }
  }

  async onSaveListing(listingForm: any) {
    // console.log(listingForm, "triims pentru salvare")
    this.listing = this.listingForm.value;
    // console.log(this.listing, "this.listing")

    this.beepService.saveListing(this.listing).
      subscribe((res) => {
        this.listing._id = res._id
        console.log("res._id",res._id)
      });
      console.log("this.listing._id",this.listing._id)
    this.beepService.getDocs();
    sessionStorage.removeItem('justSaveBtn');
  }

  async onUpdateListing(listingForm:any){
    this.listing = this.listingForm.value;
    this.beepService.updateListing( this.listing).
    subscribe(res => this.listing = res);

    console.log("this.listing onUpdateListing",this.listing)
    this.beepService.getDocById(localStorage.getItem('paramsId')).
    subscribe(res => this.listing = res);
    sessionStorage.removeItem('justSaveBtn');
  }

  ngOnDestroy(): void{
    console.log('on distroy')
    sessionStorage.removeItem('justSaveBtn')
  }


}
