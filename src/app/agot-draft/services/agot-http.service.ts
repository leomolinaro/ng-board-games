import { Injectable } from "@angular/core";
import { Card } from "../models/card";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Pack } from "../models/pack";

@Injectable ({
  providedIn: "root"
})
export class AgotHttpService {

  constructor (private http: HttpClient) { }

  getCards (): Observable<Card[]> {
    return this.http
    .get<Card[]> ("https://thronesdb.com/api/public/cards/");
  } // getCards

  getPacks (): Observable<Pack[]> {
    return this.http
    .get<Pack[]> ("https://thronesdb.com/api/public/packs/");
  } // getPacks

} // AgotHttpService
