export class BgAuthServiceMock {
  getUser(): { id: string } {
    return { id: 'me' };
  }
}
