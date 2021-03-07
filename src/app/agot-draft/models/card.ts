export interface Card {
  pack_code: PackCode;
  pack_name: string;
  type_code: string;
  type_name: string;
  faction_code: string;
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
} // Card

export type PackCode = "Core" |"WotN" |"LoCR" |"WotW" |"HoT" |"SoD" |"KotI" |"TtB" |"TRtW" |"TKP" |"NMG"
|"CoW" |"TS" |"AtSK" |"CtA" |"FFH" |"TIMC" |"GoH" |"TC" |"AMAF" |"GtR" |"TFoA" |"TRW" |"OR" |"TBWB"
|"TAK" |"JtO" |"Km" |"FotOG" | "TFM" |"SAT" |"TSC" |"TMoW" |"SoKL" |"MoD" |"IDP" |"DitD";
