import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AgotCard, AgotPack } from "../agot.models";

@Injectable ({
  providedIn: "root",
})
export class AgotHttpService {
  constructor (private http: HttpClient) {
    // this.http.get<any> ("https://thronesdb.com/api/public/decklists/by_date/2018-05-06")
    // .subscribe (x => {
    //   console.log ("x", x);
    //   x.forEach ((xx: any) => {
    //     console.log ("x", Object.keys (xx.slots).length - 8);
    //   });
    // });
  }

  getCards (): Observable<AgotCard[]> {
    return this.http.get<AgotCard[]> ("https://thronesdb.com/api/public/cards/");
  } // getCards

  getPacks (): Observable<AgotPack[]> {
    return this.http
      .get<AgotPack[]> ("https://thronesdb.com/api/public/packs/")
      .pipe (
        map ((packs) =>
          packs.sort ((a, b) => {
            let comparison = a.cycle_position - b.cycle_position;
            if (comparison !== 0) {
              return comparison;
            }
            comparison = a.position - b.position;
            if (comparison !== 0) {
              return comparison;
            }
            return 0;
          })
        )
      );
  } // getPacks
} // AgotHttpService
