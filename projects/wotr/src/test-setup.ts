// // @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
// globalThis.ngJest = {
//   testEnvironmentOptions: {
//     errorOnUnknownElements: true,
//     errorOnUnknownProperties: true
//   }
// };
// import "jest-preset-angular/setup-jest";

import { setupZoneTestEnv } from "jest-preset-angular/setup-env/zone";

setupZoneTestEnv();

jest.mock("@angular/fire/auth", () => ({
  Auth: jest.fn(),
  user: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  User: jest.fn()
}));
