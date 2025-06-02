import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AgotCard, AgotPack } from "../agot.models";

@Injectable({
  providedIn: "root"
})
export class AgotHttpService {
  private http = inject(HttpClient);

  getCards(): Observable<AgotCard[]> {
    return this.http.get<AgotCard[]>("https://thronesdb.com/api/public/cards/");
  } // getCards

  getPacks(): Observable<AgotPack[]> {
    return this.http.get<AgotPack[]>("https://thronesdb.com/api/public/packs/").pipe(
      map(packs =>
        packs.sort((a, b) => {
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
