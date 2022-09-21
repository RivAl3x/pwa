import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BeepService {


  getMagazine(): Observable<any> {
    const url = environment.mongoUrlLocal + "magazine";
    return this.http.get<any>(url)
      .pipe(
        map((response: any) => {

          return response;
        }),
        catchError(errorRes => {
          return throwError(() => new Error('test'))
        })
      );
  }


  produsId: any;

  constructor(public http: HttpClient) {
  }

  beep() {
    const audio = new Audio();
    audio.src = 'assets/beep.wav';
    audio.load();
    audio.play();
  }

  getDocs(): Observable<any> {
    const url = environment.mongoUrlLocal + "business";


    let params = new HttpParams();

    var magazin = localStorage.getItem('magazin') as string;
    if(magazin == "ambele"){
      params = params;
    } else{
      params = params.append('magazin', magazin );
    }


    console.log(params.toString())



    return this.http.get<any>(url, { params })
      .pipe(
        map((response: any) => {
          return response;
        }),

        catchError(errorRes => {
          return throwError(() => new Error('test'))
        })
      );
  }


  getDocById(id: any): Observable<any> {
    // const url = environment.mongoUrl;
    const url = environment.mongoUrlLocal + "business" + "/edit/" + id;

    return this.http.get<any>(url)
      .pipe(
        map((response: any) => {
          console.warn("Mongo DB by ID:", response)
          this.produsId = response._id;
          return response;
        }),


        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }


  saveListing(listing: any): Observable<any> {

    listing.magazin = localStorage.getItem('magazin')
    console.log(listing)
    const url = environment.mongoUrlLocal + 'business' + '/add';
    // console.log(url, "URL", "listing:", listing)
    return this.http.post('http://localhost:4000/business/add', listing)
      .pipe(

        map((res: any) => {
          console.log(listing)
          return res;
        })
      );
  }

  updateListing(listing: any): Observable<any> {


    const url = environment.mongoUrlLocal + 'business' + '/update/' + this.produsId;
    console.log("listing.value", listing)
    // console.log("id", id)
    console.log("this.produsId", this.produsId)
    return this.http.put(url, listing)
      .pipe(
        map((res: any) => {
          console.log("res:", res)
          return res;
        }),
        catchError(errorRes => {
          return throwError(() => new Error('test'))
        })
      );
  }


  deleteListing(): Observable<any> {

    const url = environment.mongoUrlLocal + 'business' + '/delete/' + this.produsId;
    // console.log(url, "URL", "listing:", listing)
    return this.http.delete(url, this.produsId)
      .pipe(

        map((res: any) => {
          console.log("STERS")
          return res;
        })
      );
  }












}
