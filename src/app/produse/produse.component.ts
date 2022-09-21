import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { Article } from '../article';
import { BeepService } from '../beep.service';
import { ShoppingCart } from '../shopping-cart';
import { UpdateService } from '../update.service';



@Component({
  selector: 'app-produse',
  templateUrl: './produse.component.html',
  styleUrls: ['./produse.component.scss']
})
export class ProduseComponent implements AfterViewInit {

  started: boolean | undefined;
  errorMessage: string | undefined;
  acceptAnyCode = true;
  items: [Article, number][] = [];
  totalPrice: number = 0;

  public catalogue2: Article[] = [];
  pageSizeOptions = [5, 10, 25, 100];

  displayedColumns: string[] = ['name', 'ean', 'price'];


  dataSource = new MatTableDataSource(this.catalogue2);

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private beepService: BeepService,
  ) {  }


  ngAfterViewInit(): void {
    if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
      this.errorMessage = 'getUserMedia is not supported';
      return;
    }
    this.getDocsForTable();

    //paginatie
    this.dataSource = new MatTableDataSource(this.catalogue2);
    this.dataSource.paginator = this.paginator;
    // console.log(this.paginator)
  }


  public getDocsForTable() {
    this.beepService
      .getDocs()
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.catalogue2 = data;
      });
  }



  applyFilter(event: Event) {
    console.log(event)
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
