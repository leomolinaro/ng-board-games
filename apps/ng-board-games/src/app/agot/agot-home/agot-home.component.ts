import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AgotUtilityService } from '../agot-services/agot-utility.service';

@Component({
  selector: 'agot-home',
  templateUrl: './agot-home.component.html',
  styleUrls: ['./agot-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgotHomeComponent {
  constructor(private agotUtilityService: AgotUtilityService) {}

  utilities = this.agotUtilityService.getUtilities();
} // AgotHomeComponent
