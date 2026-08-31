import type { PipeTransform} from '@angular/core';
import { Pipe, inject } from '@angular/core';
import type { BgUser } from './bg-auth.service';
import { BgAuthService } from './bg-auth.service';

@Pipe({ name: 'bgIfUser' })
export class BgIfUserPipe implements PipeTransform {
  private authService = inject(BgAuthService);

  transform(expectedUser: BgUser): boolean {
    const condition = expectedUser.id === this.authService.getUser().id;
    return condition;
  }
}
