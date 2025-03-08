import { Pipe, PipeTransform } from "@angular/core";
import { BgAuthService, BgUser } from "./bg-auth.service";

@Pipe ({
  name: "bgIfUser",
  standalone: false
})
export class BgIfUserPipe implements PipeTransform {
  constructor (private authService: BgAuthService) {}

  transform (expectedUser: BgUser): boolean {
    const condition = expectedUser.id === this.authService.getUser ().id;
    return condition;
  } // transform
} // BgIfUserPipe
