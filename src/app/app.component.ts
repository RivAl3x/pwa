import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { BeepService } from './beep.service';
import Quagga from '@ericblade/quagga2';
import { Article } from './article';
import { ShoppingCart } from './shopping-cart';
import { UpdateService } from './update.service';
import { environment } from '../environments/environment';
import { getMainBarcodeScanningCamera } from './camera-access';

import { Observable } from 'rxjs';

import { DocumentData } from '@angular/fire/firestore';
import { enableDebugTools } from '@angular/platform-browser';
import {MatTabsModule} from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon'
import {MatTableDataSource, MatTableModule} from '@angular/material/table'
//  import {MatIconModule} from '@angular/material/icon';
 import { MatSelectChange } from '@angular/material/select';
import { EmpFilter } from './model/empfilter';
// import { MatTableDataSource } from '@angular/material/table';
import { BrowserAnimationsModule } from
'@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from './dialog/dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  started: boolean | undefined;
  errorMessage: string | undefined;
  acceptAnyCode = true;
  items: [Article, number][] = [];
  totalPrice: number = 0;

  // private catalogue: Article[] = [
  //   { name: 'Classy Crab (red)', ean: '7601234567890', image: 'assets/classy_crab_red.png', price: 10 },
  //   { name: 'Classy Crab (blue)', ean: '7601234561232', image: 'assets/classy_crab_blue.png', price: 10 },
  //   { name: 'Classy Crab (gold, ltd. ed.)', ean: '7601234564561', image: 'assets/classy_crab_gold.png', price: 50 },
  //   { name: 'Cafea', ean: '8000070038028', image: 'https://www.lavazza.ro/ro/cafea/macinata/qualita-rossa.html', price: 50 }
  // ];
  public catalogue2: Article[] = [];



  EmpData : any[] =[{"id":1,"name":"Mellie","lastname":"Gabbott","email":"mgabbott0@indiatimes.com","gender":"Female","department":"Support","jobtitle":"Support Analyst"},
  {"id":2,"name":"Yehudi","lastname":"Ainsby","email":"yainsby1@w3.org","gender":"Female","department":"Support","jobtitle":"Support Analyst"},
  {"id":3,"name":"Noellyn","lastname":"Primett","email":"nprimett2@ning.com","gender":"Female","department":"Human Resources","jobtitle":"Project Manager"},
  {"id":4,"name":"Stefanie","lastname":"Yurenin","email":"syurenin3@boston.com","gender":"Female","department":"Marketing","jobtitle":"Senior officer"},
  {"id":5,"name":"Stormi","lastname":"O'Lunny","email":"solunny4@patch.com","gender":"Female","department":"Engineering","jobtitle":"Software Engineer"},
  {"id":6,"name":"Keelia","lastname":"Giraudy","email":"kgiraudy5@nba.com","gender":"Male","department":"Marketing","jobtitle":"Senior officer"},
  {"id":7,"name":"Ikey","lastname":"Laight","email":"ilaight6@wiley.com","gender":"Male","department":"Support","jobtitle":"Support Analyst"},
  {"id":8,"name":"Adrianna","lastname":"Ruddom","email":"aruddom7@seattletimes.com","gender":"Male","department":"Marketing","jobtitle":"Senior officer"},
  {"id":9,"name":"Dionysus","lastname":"McCory","email":"dmccory8@ox.ac.uk","gender":"Male","department":"Engineering","jobtitle":"Software Engineer"},
  {"id":10,"name":"Claybourne","lastname":"Shellard","email":"cshellard9@rediff.com","gender":"Male","department":"Engineering","jobtitle":"Software Engineer"}];


  displayedColumns: string[] = ['name', 'ean', 'price'];

  dataSource = new MatTableDataSource(this.catalogue2);
  dataSourceFilters = new MatTableDataSource(this.catalogue2);

  // dataSource = new MatTableDataSource(this.EmpData);
  // dataSourceFilters = new MatTableDataSource(this.EmpData);

  private shoppingCart: ShoppingCart;
  private lastScannedCode: string | undefined;
  private lastScannedCodeDate: number  | undefined;
  name = 'World';
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
     console.log(this.dataSource, this.dataSourceFilters)
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '300px',
      data: { callback: this.callBack.bind(this), defaultValue: this.name }
    });
  }
  callBack(name: string) {
    this.name = name;
  }

  applyFilter(event: Event) {
    console.log(event)
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue)
    return this.dataSource.filter = filterValue.trim().toLowerCase();
}



  public getDocsForTable() {
    this.beepService
      .getDocs()
      .subscribe((data) => {
         this.dataSource = new MatTableDataSource(data);
        this.catalogue2 = data;
        console.log('table docs=>', this.dataSource);
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
            top: '25%',    // top offset
            right: '10%',  // right offset
            left: '10%',   // left offset
            bottom: '25%'  // bottom offset
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

    // ignore duplicates for an interval of 1.5 seconds
    const now = new Date().getTime();
    if (code === this.lastScannedCode
      && ((this.lastScannedCodeDate !== undefined) && (now < this.lastScannedCodeDate + 3500))) {
      return;
    }

    // only accept articles from catalogue
    let article = this.catalogue2.find((item) => item.ean === code);
    // alert(code)
    if (!article) {
      if (this.acceptAnyCode) {
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

      alert( eanCheckDigit(code) )
    }else {
      alert(eanCheckDigit(code))
    }

    return {
      ean: code,
      name: `Codul: ${code}`,
      // image: 'assets/classy_crab_unknown.png',
      price:0
    }
  }

}
