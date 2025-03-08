export type AgotPackCode =
  | "Core"
  | "WotN"
  | "LoCR"
  | "WotW"
  | "HoT"
  | "SoD"
  | "KotI"
  | "FotS"
  | "DotE"
  | "TtB"
  | "TRtW"
  | "TKP"
  | "NMG"
  | "CoW"
  | "TS"
  | "AtSK"
  | "CtA"
  | "FFH"
  | "TIMC"
  | "GoH"
  | "TC"
  | "AMAF"
  | "GtR"
  | "TFoA"
  | "TRW"
  | "OR"
  | "TBWB"
  | "TAK"
  | "JtO"
  | "Km"
  | "FotOG"
  | "TFM"
  | "SAT"
  | "TSC"
  | "TMoW"
  | "SoKL"
  | "MoD"
  | "IDP"
  | "DitD"
  | "AtG"
  | "CoS"
  | "PoS"
  | "BtRK"
  | "TB"
  | "LMHR";

export type AgotFactionCode =
  | "stark"
  | "lannister"
  | "thenightswatch"
  | "tyrell"
  | "martell"
  | "greyjoy"
  | "baratheon"
  | "targaryen"
  | "neutral";

export const agotAgendaCode = {
  Fealty: "01027",
  BannerOfTheStag: "01198",
  BannerOfTheKraken: "01199",
  BannerOfTheLion: "01200",
  BannerOfTheSun: "01201",
  BannerOfTheWatch: "01202",
  BannerOfTheWolf: "01203",
  BannerOfTheDragon: "01204",
  BannerOfTheRose: "01205",
  TheLordOfTheCrossing: "02060",
  KingsOfSummer: "04037",
  KingsOfWinter: "04038",
  TheRainsOfCastamere: "05045",
  Alliance: "06018",
  TheBrotherhoodWithoutBanners: "06119",
  TheHouseWithTheRedDoor: "08039",
  Greensight: "08079",
  TheFaithMilitant: "08099",
  TheConclave: "09045",
  TheWarsToCome: "10045",
  TradingWithQohor: "11039",
  TheFreeFolk: "11079",
  AssaultFromTheShadows: "11118",
  SeaOfBlood: "12045",
  KnightsOfTheHollowHill: "13039",
  KingdomOfShadows: "13079",
  TheWhiteBook: "13099",
  ValyrianSteel: "13118",
  ThePrinceThatWasPromised: "14045",
};

export type AgotTypeCode =
  | "agenda"
  | "character"
  | "plot"
  | "event"
  | "attachment"
  | "location"
  | "title";

export interface AgotCard {
  pack_code: AgotPackCode;
  pack_name: string;
  type_code: AgotTypeCode;
  type_name: string;
  faction_code: AgotFactionCode;
  faction_name: string;
  position: number;
  code: string;
  name: string;
  cost: number;
  text: string;
  quantity: number;
  income: number;
  initiative: number;
  claim: number;
  reserve: number;
  deck_limit: number;
  designer: string;
  strength: number;
  traits: string;
  flavor: string;
  illustrator: string;
  is_unique: boolean;
  is_loyal: boolean;
  is_military: boolean;
  is_intrigue: boolean;
  is_power: boolean;
  octgn_id: string;
  url: string;
  imagesrc: string;
  image_url: string;
  label: string;
  ci: number;
  si: number;
} // AgotCard

export interface AgotFaction {
  code: AgotFactionCode;
  name: string;
} // AgotFaction

export interface AgotPack {
  name: string;
  code: AgotPackCode;
  cycle_position: number;
  position: number;
} // AgotPack

export interface AgotType {
  code: AgotTypeCode;
  name: string;
} // AgotType
