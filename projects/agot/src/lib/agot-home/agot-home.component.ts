import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AgotUtilityService } from "../agot-services/agot-utility.service";
import { MatToolbar } from "@angular/material/toolbar";
import { NgFor } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component ({
  selector: "agot-home",
  templateUrl: "./agot-home.component.html",
  styleUrls: ["./agot-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbar, NgFor, RouterLink]
})
export class AgotHomeComponent {
  constructor (private agotUtilityService: AgotUtilityService) {}

  utilities = this.agotUtilityService.getUtilities ();
} // AgotHomeComponent
