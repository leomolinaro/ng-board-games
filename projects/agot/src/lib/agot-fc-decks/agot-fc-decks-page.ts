import { AsyncPipe } from "@angular/common";
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import { BgTransformFn, Loading, SingleEvent, UntilDestroy } from "@leobg/commons/utils";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { BgTransformPipe } from "../../../../commons/utils/src/lib/bg-transform.pipe";
import { AgotDataService } from "../agot-services/agot-data.service";
import { AgotFactionCode, agotAgendaCode as agenda } from "../agot.models";

interface AgotFcDeck {
  name: string;
  description: string;
  faction: AgotFactionCode;
  agenda: string;
}

@Component({
  selector: "agot-fc-decks",
  imports: [
    MatTable,
    MatColumnDef,
    MatCellDef,
    MatCell,
    MatRowDef,
    MatRow,
    AsyncPipe,
    BgTransformPipe
  ],
  template: `
    <table
      mat-table
      [dataSource]="(loading$ | async) ? [] : decks"
      class="agot-fc-table mat-elevation-z8">
      <ng-container matColumnDef="faction">
        <!-- <th mat-header-cell *matHeaderCellDef> No. </th> -->
        <td
          mat-cell
          *matCellDef="let deck">
          <div class="agot-fc-faction-cell">
            <img
              class="agot-fc-card-image"
              [src]="deck | bgTransform: getDeckFactionImage"
              width="100" />
            <img
              class="agot-fc-card-image"
              [src]="deck | bgTransform: getDeckAgendaImage"
              width="100" />
          </div>
        </td>
      </ng-container>

      <ng-container matColumnDef="name">
        <!-- <th mat-header-cell *matHeaderCellDef> Name </th> -->
        <td
          mat-cell
          *matCellDef="let deck">
          {{ deck.name }}
        </td>
      </ng-container>

      <!-- <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr> -->
      <tr
        mat-row
        *matRowDef="let row; columns: deckColumns"></tr>
    </table>
  `,
  styles: `
    .agot-fc-table {
      width: 100%;

      .mat-column-faction {
        width: 120px;
        .agot-fc-faction-cell {
          display: flex;
          justify-content: space-evenly;
          padding: 5px;
          .agot-fc-card-image {
            width: 50px;
          }
        }
      }
    }
  `
})
@UntilDestroy
export class AgotFcDecksPage implements OnInit, OnDestroy {
  private data = inject(AgotDataService);

  deckColumns: string[] = ["faction", "name"];
  decks: AgotFcDeck[] = [
    { faction: "stark", agenda: agenda.Fealty, name: "A", description: "" },
    {
      faction: "stark",
      agenda: agenda.TheLordOfTheCrossing,
      name: "House Stark, Catelyn and Tully",
      description: ""
    },
    {
      faction: "stark",
      agenda: agenda.KingsOfWinter,
      name: "A",
      description: ""
    },
    {
      faction: "stark",
      agenda: agenda.Alliance,
      name: "Stark, Baratheon and The Night's Watch Alliance",
      description: ""
    },
    {
      faction: "lannister",
      agenda: agenda.TheRainsOfCastamere,
      name: "House Lannister, Intrigue",
      description: ""
    },
    {
      faction: "lannister",
      agenda: agenda.TheLordOfTheCrossing,
      name: "House Lannister, Clansmem",
      description: ""
    },
    {
      faction: "lannister",
      agenda: agenda.TheWhiteBook,
      name: "House Lannister, Kingsguards",
      description: ""
    },
    {
      faction: "lannister",
      agenda: agenda.Alliance,
      name: "Lannister, Tyrell and Bolton Alliance",
      description: ""
    },
    {
      faction: "thenightswatch",
      agenda: agenda.KingsOfWinter,
      name: "A",
      description: ""
    },
    {
      faction: "thenightswatch",
      agenda: agenda.KnightsOfTheHollowHill,
      name: "A",
      description: ""
    },
    {
      faction: "thenightswatch",
      agenda: agenda.ValyrianSteel,
      name: "A",
      description: ""
    },
    {
      faction: "thenightswatch",
      agenda: agenda.TheFreeFolk,
      name: "The Free Folk",
      description: ""
    },
    {
      faction: "tyrell",
      agenda: agenda.TheRainsOfCastamere,
      name: "A",
      description: ""
    },
    {
      faction: "tyrell",
      agenda: agenda.KingsOfSummer,
      name: "A",
      description: ""
    },
    {
      faction: "tyrell",
      agenda: agenda.AssaultFromTheShadows,
      name: "A",
      description: ""
    },
    {
      faction: "tyrell",
      agenda: agenda.TheFaithMilitant,
      name: "The Faith Militant",
      description: ""
    },
    {
      faction: "martell",
      agenda: agenda.TheWarsToCome,
      name: "A",
      description: ""
    },
    {
      faction: "martell",
      agenda: agenda.KingsOfSummer,
      name: "A",
      description: ""
    },
    {
      faction: "martell",
      agenda: agenda.KnightsOfTheHollowHill,
      name: "A",
      description: ""
    },
    {
      faction: "martell",
      agenda: agenda.KingdomOfShadows,
      name: "Dayne, Aegon Shadows",
      description: ""
    },
    {
      faction: "greyjoy",
      agenda: agenda.SeaOfBlood,
      name: "A",
      description: ""
    },
    { faction: "greyjoy", agenda: agenda.Fealty, name: "A", description: "" },
    {
      faction: "greyjoy",
      agenda: agenda.Greensight,
      name: "A",
      description: ""
    },
    {
      faction: "greyjoy",
      agenda: agenda.TheConclave,
      name: "The Conclave",
      description: ""
    },
    {
      faction: "baratheon",
      agenda: agenda.ThePrinceThatWasPromised,
      name: "A",
      description: ""
    },
    {
      faction: "baratheon",
      agenda: agenda.AssaultFromTheShadows,
      name: "A",
      description: ""
    },
    { faction: "baratheon", agenda: agenda.Fealty, name: "A", description: "" },
    {
      faction: "baratheon",
      agenda: agenda.TheBrotherhoodWithoutBanners,
      name: "A",
      description: ""
    },
    {
      faction: "targaryen",
      agenda: agenda.TheHouseWithTheRedDoor,
      name: "A",
      description: ""
    },
    {
      faction: "targaryen",
      agenda: agenda.TradingWithQohor,
      name: "A",
      description: ""
    },
    {
      faction: "targaryen",
      agenda: agenda.SeaOfBlood,
      name: "House Targaryen, Dothraki",
      description: ""
    },
    {
      faction: "targaryen",
      agenda: agenda.Alliance,
      name: "Targaryen, Martell, Qohor Alliance",
      description: ""
    }
  ];

  getDeckFactionImage: BgTransformFn<AgotFcDeck, string> = deck => {
    return `assets/agot/factions/${deck.faction}.png`;
  };
  getDeckAgendaImage: BgTransformFn<AgotFcDeck, string> = deck => {
    const card = this.data.getCard(deck.agenda);
    return card?.image_url;
  };

  @Loading() loading$!: Observable<boolean>;

  @SingleEvent()
  ngOnInit() {
    return this.data.load$().pipe(
      tap(() => {
        const cards = this.data.getCards({ onlyOfficial: true });
        let nAgendas = 0;
        let nAttachments = 0;
        let nCharacters = 0;
        let nEvents = 0;
        let nLocations = 0;
        let nPlots = 0;
        const nByFaction: Record<AgotFactionCode, number> = {
          stark: 0,
          lannister: 0,
          thenightswatch: 0,
          tyrell: 0,
          martell: 0,
          greyjoy: 0,
          baratheon: 0,
          targaryen: 0,
          neutral: 0
        };
        if (cards) {
          cards.forEach(card => {
            switch (card.type_code) {
              case "agenda":
                nAgendas++;
                console.log(card.name);
                break;
              case "attachment":
                nAttachments++;
                nByFaction[card.faction_code]++;
                break;
              case "character":
                nCharacters++;
                nByFaction[card.faction_code]++;
                break;
              case "event":
                nEvents++;
                nByFaction[card.faction_code]++;
                break;
              case "location":
                nLocations++;
                nByFaction[card.faction_code]++;
                break;
              case "plot":
                nPlots++;
                break;
            }
          });
          console.log("nAgendas", nAgendas);
          console.log("nAttachments", nAttachments);
          console.log("nCharacters", nCharacters);
          console.log("nEvents", nEvents);
          console.log("nLocations", nLocations);
          console.log("nPlots", nPlots);

          const n = 40;
          console.log("nAgendas", nAgendas / n);
          console.log("nAttachments", nAttachments / n);
          console.log("nCharacters", nCharacters / n);
          console.log("nEvents", nEvents / n);
          console.log("nLocations", nLocations / n);
          console.log("nPlots", nPlots / n);

          console.log("nByFaction", nByFaction);
        }
      })
    );
  }

  ngOnDestroy() {}
}
