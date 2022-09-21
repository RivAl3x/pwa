import { Component, OnInit } from '@angular/core';
import { BeepService } from '../beep.service';
import { Location } from "@angular/common";

@Component({
  selector: 'app-dialog-confirmare',
  templateUrl: './dialog-confirmare.component.html',
  styleUrls: ['./dialog-confirmare.component.scss']
})
export class DialogConfirmareComponent implements OnInit {


  constructor( public beepService: BeepService,
    private location: Location) {}

  ngOnInit(): void {
  }


  deleteProduct() {
    this.beepService.deleteListing().subscribe(res => {
      console.log('Deleted')})
    }

    goBack(): void {
      this.location.back();
      sessionStorage.removeItem('justSaveBtn');
    }

}
