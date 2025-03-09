import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatToolbar } from "@angular/material/toolbar";
import { RouterLink } from "@angular/router";
import { AgotUtilityService } from "../agot-services/agot-utility.service";

@Component ({
  selector: "agot-home",
  templateUrl: "./agot-home.component.html",
  styleUrls: ["./agot-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbar, NgFor, RouterLink]
})
export class AgotHomeComponent {
  
  private agotUtilityService = inject (AgotUtilityService);

  utilities = this.agotUtilityService.getUtilities ();
} // AgotHomeComponent
