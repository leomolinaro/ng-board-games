import { Pipe, PipeTransform, inject } from "@angular/core";
import { BgAuthService, BgUser } from "./bg-auth.service";

@Pipe({ name: "bgIfUser" })
export class BgIfUserPipe implements PipeTransform {
  private authService = inject(BgAuthService);

  transform(expectedUser: BgUser): boolean {
    const condition = expectedUser.id === this.authService.getUser().id;
    return condition;
  } // transform
} // BgIfUserPipe
