import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../article';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shopping-cart-item',
  templateUrl: './shopping-cart-item.component.html',
  styleUrls: ['./shopping-cart-item.component.scss']
})
export class ShoppingCartItemComponent implements OnInit {

  displayedColumns: string[] = ['name', 'ean', 'price'];
  constructor( private router: Router,
    private route: ActivatedRoute) {
  }

  @Input()
  article: Article | undefined;

  @Input()
  count: number | undefined;

  ngOnInit(): void {
  }
  createBook(eanCode: any){
    // Create Book logic
    this.router.navigate(['/detalii']);
    console.log(eanCode)
    localStorage.setItem('eanCode', eanCode);

 }
}
