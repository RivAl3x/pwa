import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BeepService } from '../beep.service';
import Quagga from '@ericblade/quagga2';
import { Article } from '../article';
import { ShoppingCart } from '../shopping-cart';
import { UpdateService } from '../update.service';
import { environment } from '../../environments/environment';
import { getMainBarcodeScanningCamera } from '../camera-access';


import {MatTableDataSource, MatTableModule} from '@angular/material/table'


import {MatDialog, MatDialogModule} from '@angular/material/dialog';



import {MatPaginator} from '@angular/material/paginator';



@Component({
  selector: 'app-scanari',
  templateUrl: './scanari.component.html',
  styleUrls: ['./scanari.component.scss']
})
export class ScanariComponent implements AfterViewInit {
  started: boolean | undefined;
  errorMessage: string | undefined;
  acceptAnyCode = true;
  items: [Article, number][] = [];
  totalPrice: number = 0;

  public catalogue2: Article[] = [];
  pageSizeOptions  =[5, 10, 25, 100];

  displayedColumns: string[] = ['name', 'ean', 'price'];


  dataSource = new MatTableDataSource(this.catalogue2);

  @ViewChild(MatPaginator) paginator: MatPaginator;


  private shoppingCart: ShoppingCart;
  private lastScannedCode: string | undefined;
  private lastScannedCodeDate: number  | undefined;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private beepService: BeepService,
              private updateService: UpdateService,

              public dialog: MatDialog

            ) {
    this.shoppingCart = new ShoppingCart();
  }



  ngAfterViewInit(): void {
    if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
      this.errorMessage = 'getUserMedia is not supported';
      return;
    }


    this.initializeScanner();

    if (environment.production) {
      setTimeout(() => {
        this.updateService.checkForUpdates();
      }, 3000);
    }

    // this.getDocs();
    this.getDocsForTable();
    //  console.log(this.dataSourceFilters)

//paginatie
this.dataSource = new MatTableDataSource(this.catalogue2);
     this.dataSource.paginator = this.paginator;
     console.log(this.paginator)
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



  public getDocsForTable() {
    this.beepService
      .getDocs()
      .subscribe((data) => {
         this.dataSource = new MatTableDataSource(data);
        this.catalogue2 = data;

      });
  }


  private initializeScanner(): Promise<void> {
    if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
      this.errorMessage = 'getUserMedia is not supported. Please use Chrome on Android or Safari on iOS';
      this.started = false;
      return Promise.reject(this.errorMessage);
    }

    // enumerate devices and do some heuristics to find a suitable first camera
    return Quagga.CameraAccess.enumerateVideoDevices()
      .then(mediaDeviceInfos => {
        const mainCamera = getMainBarcodeScanningCamera(mediaDeviceInfos);
        if (mainCamera) {
          console.log(`Using ${mainCamera.label} (${mainCamera.deviceId}) as initial camera`);
          return this.initializeScannerWithDevice(mainCamera.deviceId);
        } else {
          console.error(`Unable to determine suitable camera, will fall back to default handling`);
          return this.initializeScannerWithDevice(undefined);
        }
      })
      .catch(error => {
        this.errorMessage = `Failed to enumerate devices: ${error}`;
        this.started = false;
      });
  }

  private initializeScannerWithDevice(preferredDeviceId: string | undefined): Promise<void> {
    console.log(`Initializing Quagga scanner...`);

    const constraints: MediaTrackConstraints = {};
    if (preferredDeviceId) {
      // if we have a specific device, we select that
      constraints.deviceId = preferredDeviceId;
    } else {
      // otherwise we tell the browser we want a camera facing backwards (note that browser does not always care about this)
      constraints.facingMode = 'environment';
    }

    return Quagga.init({
        inputStream: {
          type: 'LiveStream',
          constraints,
          area: { // defines rectangle of the detection/localization area
            top: '15%',    // top offset
            right: '5%',  // right offset
            left: '5%',   // left offset
            bottom: '15%'  // bottom offset

            // top: '25%',    VECHILE VALORI
            // right: '10%',
            // left: '10%',
            // bottom: '25%'
          },
          target: document.querySelector('#scanner-container') ?? undefined
        },
        decoder: {
          readers: ['ean_reader'],
          multiple: false
        },
        // See: https://github.com/ericblade/quagga2/blob/master/README.md#locate
        locate: false
      },
      (err) => {
        if (err) {
          console.error(`Quagga initialization failed: ${err}`);
          this.errorMessage = `Initialization error: ${err}`;
          this.started = false;
        } else {
          console.log(`Quagga initialization succeeded`);
          Quagga.start();
          this.started = true;
          this.changeDetectorRef.detectChanges();
          Quagga.onDetected((res) => {
            if (res.codeResult.code) {
              this.onBarcodeScanned(res.codeResult.code);
            }
          });
        }
      });
  }

  onBarcodeScanned(code: string) {
    console.log("code:", code);
    // ignore duplicates for an interval of 1.5 seconds
    const now = new Date().getTime();
    if (code === this.lastScannedCode && ((this.lastScannedCodeDate !== undefined) && (now < this.lastScannedCodeDate + 2500))) {
      return;
    }

    // only accept articles from catalogue
    let article = this.catalogue2.find((item) => item.ean === code);
    // alert(code)
    if (!article) {
      if (this.acceptAnyCode) {
        console.log("CHECKBOX")
        article = this.createUnknownArticle(code);
      } else {
        return;
      }
    }
    this.shoppingCart.addArticle(article);
    this.items = this.shoppingCart.contents;
    this.totalPrice = this.shoppingCart.totalPrice;

    this.lastScannedCode = code;
    this.lastScannedCodeDate = now;
    this.beepService.beep();
    this.changeDetectorRef.detectChanges();
  }

  clearCart() {
    this.shoppingCart.clear();
    this.items = this.shoppingCart.contents;
  }

  private createUnknownArticle(code: string): Article {

    function eanCheckDigit(code:any){
      let result = 0;
      let i = 1;
      for (let counter = code.length-2; counter >=0; counter--){
          result = result + parseInt(code.charAt(counter)) * (1+(2*(i % 2)));
          i++;
      }

      return (10 - (result % 10)) % 10;
  }



    if(eanCheckDigit(code) == 8){

      // alert( eanCheckDigit(code) )
    }else {
      // alert(eanCheckDigit(code))
    }

    return {
      ean: "Cod ean :"+ code,
      // name: `Codul: ${code}`,
      name: "Produs nou",
      // image: 'assets/classy_crab_unknown.png',
      price:0
    }
  }



}
