import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { map } from "rxjs/operators";
import { AgotCard, AgotPack } from "../agot.models";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AgotHttp {
  private http = inject(HttpClient);

  getCards(): Promise<AgotCard[]> {
    return lastValueFrom(this.http.get<AgotCard[]>("https://thronesdb.com/api/public/cards/"));
  }

  getPacks(): Promise<AgotPack[]> {
    return lastValueFrom(
      this.http.get<AgotPack[]>("https://thronesdb.com/api/public/packs/").pipe(
        map(packs =>
          packs.sort((a, b) => {
            let comparison = a.cycle_position - b.cycle_position;
            if (comparison !== 0) return comparison;
            comparison = a.position - b.position;
            if (comparison !== 0) return comparison;
            return 0;
          })
        )
      )
    );
  }
}
