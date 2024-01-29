import { WotrFellowship } from "./wotr-fellowhip.models";

export function initFellowshipState (): WotrFellowship {
  return {
    status: "hidden",
    companions: [],
    guide: "gandalf-the-grey"
  };
}
