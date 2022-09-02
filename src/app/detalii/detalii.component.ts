import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BeepService } from '../beep.service';
import {ActivatedRoute} from '@angular/router';
import { map, Observable } from 'rxjs';
import { Article } from '../article';




@Component({
  selector: 'app-detalii',
  templateUrl: './detalii.component.html',
  styleUrls: ['./detalii.component.scss']
})
export class DetaliiComponent implements OnInit {
  produs: Article ={
    name: '',
    ean: '',
    image: '',
    price: 0
  };
  produsId: any = '';





  constructor(public beepService: BeepService,
                      private router: Router,
                      private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.produsId = this.route.snapshot.paramMap.get('_id');
    this.produsId =  this.route.params.subscribe(params => {
      this.getDocById(params['_id']);
      console.log(this.produsId)
    });

  }

  getDocById(id:any): void {

  this.beepService.getDocById(id)
    .subscribe(res => this.produs = res);

}
}



