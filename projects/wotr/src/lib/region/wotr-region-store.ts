import { computed, inject, Injectable, Signal } from "@angular/core";
import { immutableUtil } from "@leobg/commons/utils";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrCharacterStore } from "../character/wotr-character-store";
import { WotrFrontId } from "../front/wotr-front-models";
import { frontOfNation, WotrNation, WotrNationId } from "../nation/wotr-nation-models";
import { WotrArmy, WotrFreeUnits, WotrUnits } from "../unit/wotr-unit-models";
import { WotrUnitUtils } from "../unit/wotr-unit-utils";
import { WotrNeighbor, WotrRegion, WotrRegionId, WotrSettlentType } from "./wotr-region-models";

export interface WotrRegionState {
  map: Record<WotrRegionId, WotrRegion>;
  ids: WotrRegionId[];
}

export function initialeState(): WotrRegionState {
  return {
    // prettier-ignore
    ids: [
      "forlindon", "north-ered-luin", "ered-luin", "grey-havens", "harlindon", "tower-hills",
      "evendim", "arnor", "north-downs", "bree", "buckland", "the-shire", "south-ered-luin",
      "minhiriath", "cardolan", "old-forest", "south-downs", "weather-hills", "ettenmoors",
      "angmar", "mount-gram", "mount-gundabad", "troll-shaws", "rivendell", "fords-of-bruinen",
      "hollin", "moria", "north-dunland", "tharbad", "south-dunland", "enedwaith", "gap-of-rohan",
      "orthanc", "druwaith-iaur", "andrast", "high-pass", "goblins-gate", "eagles-eyre",
      "old-ford", "gladden-fields", "dimrill-dale", "lorien", "parth-celebrant", "fangorn",
      "fords-of-isen", "helms-deep", "westemnet", "edoras", "folde", "eastemnet", "anfalas",
      "erech", "dol-amroth", "lamedon", "pelargir", "lossarnach", "minas-tirith", "druadan-forest",
      "carrock", "rhosgobel", "north-anduin-vale", "south-anduin-vale", "western-brown-lands",
      "western-emyn-muil", "dead-marshes", "osgiliath", "south-ithilien", "north-ithilien",
      "eastern-emyn-muil", "eastern-brown-lands", "dagorlad", "ash-mountains", "noman-lands",
      "southern-dorwinion", "northern-dorwinion", "southern-rhovanion", "northern-rhovanion",
      "vale-of-the-celduin", "vale-of-the-carnen", "eastern-mirkwood", "narrows-of-the-forest",
      "dol-guldur", "southern-mirkwood", "old-forest-road", "western-mirkwood", "northern-mirkwood",
      "withered-heath", "woodland-realm", "dale", "erebor", "iron-hills", "north-rhun", "east-rhun",
      "south-rhun", "morannon", "minas-morgul", "gorgoroth", "nurn", "barad-dur", "west-harondor",
      "east-harondor", "umbar", "near-harad", "far-harad", "khand"
    ],
    map: {
      // prettier-ignore
      "forlindon": initialRegion("forlindon", "Forlindon", "elves", false, null,
        ["grey-havens"],
        ["north-ered-luin", "ered-luin"], true),
      // prettier-ignore
      "north-ered-luin": initialRegion("north-ered-luin", "North Ered Luin", "dwarves", false, null,
        ["ered-luin", "evendim"],
        ["forlindon"], true),
      // prettier-ignore
      "ered-luin": initialRegion("ered-luin", "Ered Luin", "dwarves", false, "town",
        ["north-ered-luin", "evendim", "tower-hills", "grey-havens"],
        ["forlindon"], false),
      // prettier-ignore
      "grey-havens": initialRegion("grey-havens", "Grey Havens", "elves", false, "stronghold",
        ["forlindon", "ered-luin", "tower-hills", "harlindon"],
        [], true),
      // prettier-ignore
      "harlindon": initialRegion("harlindon", "Harlindon", null, false, null,
        ["grey-havens", "south-ered-luin"],
        ["tower-hills"], true),
      // prettier-ignore
      "tower-hills": initialRegion("tower-hills", "Tower Hills", null, false, null,
        ["grey-havens", "ered-luin", "evendim", "the-shire", "south-ered-luin"],
        ["harlindon"], false),
      // prettier-ignore
      "evendim": initialRegion("evendim", "Evendim", null, false, null,
        ["arnor", "north-downs", "buckland", "the-shire", "tower-hills", "ered-luin", "north-ered-luin"],
        [], true),
      // prettier-ignore
      "arnor": initialRegion("arnor", "Arnor", null, false, null,
        ["angmar", "ettenmoors", "north-downs", "evendim"],
        [], false),
      // prettier-ignore
      "north-downs": initialRegion("north-downs", "North Downs", "north", false, null,
        ["arnor", "ettenmoors", "weather-hills", "bree", "buckland", "evendim"],
        [], false),
      // prettier-ignore
      "bree": initialRegion("bree", "Bree", "north", false, "town",
        ["north-downs", "weather-hills", "south-downs", "buckland"],
        [], false),
      // prettier-ignore
      "buckland": initialRegion("buckland", "Buckland", "north", false, null,
        ["north-downs", "bree", "south-downs", "cardolan", "old-forest", "the-shire", "evendim"],
        [], false),
      // prettier-ignore
      "the-shire": initialRegion("the-shire", "The Shire", "north", false, "city",
        ["evendim", "buckland", "old-forest", "south-ered-luin", "tower-hills"],
        [], false),
      // prettier-ignore
      "south-ered-luin": initialRegion("south-ered-luin", "South Ered Luin", null, false, null,
        ["the-shire", "old-forest", "cardolan", "minhiriath", "harlindon", "tower-hills"],
        [], true),
      // prettier-ignore
      "minhiriath": initialRegion("minhiriath", "Minhiriath", null, false, null,
        ["south-ered-luin", "cardolan", "tharbad", "enedwaith"],
        [], true),
      // prettier-ignore
      "cardolan": initialRegion("cardolan", "Cardolan", null, false, null,
        ["old-forest", "buckland", "south-downs", "north-dunland", "tharbad", "minhiriath", "south-ered-luin"],
        [], false),
      // prettier-ignore
      "old-forest": initialRegion("old-forest", "Old Forest", null, false, null,
        ["buckland", "cardolan", "south-ered-luin", "the-shire"],
        [], false),
      // prettier-ignore
      "south-downs": initialRegion("south-downs", "South Downs", null, false, null,
        ["bree", "weather-hills", "troll-shaws", "hollin", "north-dunland", "cardolan", "buckland"],
        [], false),
      // prettier-ignore
      "weather-hills": initialRegion("weather-hills", "Weather Hills", null, false, null,
        ["ettenmoors", "troll-shaws", "south-downs", "bree", "north-downs"],
        [], false),
      // prettier-ignore
      "ettenmoors": initialRegion("ettenmoors", "Ettenmoors", null, false, null,
        ["angmar", "mount-gram", "troll-shaws", "weather-hills", "north-downs", "arnor"],
        ["mount-gundabad"], false),
      // prettier-ignore
      "angmar": initialRegion("angmar", "Angmar", "sauron", false, "city",
        ["mount-gram", "ettenmoors", "arnor"],
        [], false),
      // prettier-ignore
      "mount-gram": initialRegion("mount-gram", "Mount Gram", "sauron", false, null,
        ["angmar", "mount-gundabad", "ettenmoors"],
        [], false),
      // prettier-ignore
      "mount-gundabad": initialRegion("mount-gundabad", "Mount Gundabad", "sauron", false, "stronghold",
        ["mount-gram", "eagles-eyre"],
        ["ettenmoors", "troll-shaws", "rivendell", "carrock"], false),
      // prettier-ignore
      "troll-shaws": initialRegion("troll-shaws", "Troll Shaws", null, false, null,
        ["rivendell", "fords-of-bruinen", "hollin", "south-downs", "weather-hills", "ettenmoors"],
        ["mount-gundabad"], false),
      // prettier-ignore
      "rivendell": initialRegion("rivendell", "Rivendell", "elves", false, "stronghold",
        ["fords-of-bruinen", "troll-shaws"],
        ["mount-gundabad", "eagles-eyre", "old-ford", "goblins-gate", "high-pass"], false),
      // prettier-ignore
      "fords-of-bruinen": initialRegion("fords-of-bruinen", "Fords of Bruinen", null, false, null,
        ["rivendell", "high-pass", "hollin", "troll-shaws"],
        ["moria"], false),
      // prettier-ignore
      "hollin": initialRegion("hollin", "Hollin", null, false, null,
        ["fords-of-bruinen", "moria", "north-dunland", "south-downs", "troll-shaws"],
        [], false),
      // prettier-ignore
      "moria": initialRegion("moria", "Moria", "sauron", false, "stronghold",
        ["hollin", "dimrill-dale", "north-dunland"],
        ["fords-of-bruinen", "high-pass", "goblins-gate", "old-ford", "gladden-fields"], false),
      // prettier-ignore
      "north-dunland": initialRegion("north-dunland", "North Dunland", "isengard", false, "town",
        ["hollin", "moria", "south-dunland", "tharbad", "cardolan", "south-downs"],
        ["lorien", "parth-celebrant", "fangorn"], false),
      // prettier-ignore
      "tharbad": initialRegion("tharbad", "Tharbad", null, false, null,
        ["cardolan", "north-dunland", "south-dunland", "enedwaith", "minhiriath"],
        [], false),
      // prettier-ignore
      "south-dunland": initialRegion("south-dunland", "South Dunland", "isengard", false, "town",
        ["north-dunland", "gap-of-rohan", "enedwaith", "tharbad"],
        ["fangorn", "orthanc"], false),
      // prettier-ignore
      "enedwaith": initialRegion("enedwaith", "Enedwaith", null, false, null,
        ["tharbad", "south-dunland", "gap-of-rohan", "druwaith-iaur", "minhiriath"],
        [], true),
      // prettier-ignore
      "gap-of-rohan": initialRegion("gap-of-rohan", "Gap of Rohan", "isengard", false, null,
        ["south-dunland", "orthanc", "fords-of-isen", "druwaith-iaur", "enedwaith"],
        [], false),
      // prettier-ignore
      "orthanc": initialRegion("orthanc", "Orthanc", "isengard", false, "stronghold",
        ["fords-of-isen", "gap-of-rohan"],
        ["south-dunland", "fangorn"], false),
      // prettier-ignore
      "druwaith-iaur": initialRegion("druwaith-iaur", "Druwaith Iaur", null, false, null,
        ["enedwaith", "gap-of-rohan", "fords-of-isen", "andrast"],
        ["anfalas"], true),
      // prettier-ignore
      "andrast": initialRegion("andrast", "Andrast", null, false, null,
        ["druwaith-iaur", "anfalas"],
        [], true),
      // prettier-ignore
      "high-pass": initialRegion("high-pass", "High-pass", null, false, null,
        ["goblins-gate", "fords-of-bruinen"],
        ["rivendell", "moria"], false),
      // prettier-ignore
      "goblins-gate": initialRegion("goblins-gate", "Goblins Gate", null, false, null,
        ["high-pass", "old-ford"],
        ["rivendell", "moria"], false),
      // prettier-ignore
      "eagles-eyre": initialRegion("eagles-eyre", "Eagle's Eyre", null, false, null,
        ["mount-gundabad", "carrock", "old-ford"],
        ["rivendell"], false),
      // prettier-ignore
      "old-ford": initialRegion("old-ford", "Old Ford", null, false, null,
        ["eagles-eyre", "carrock", "rhosgobel", "gladden-fields", "goblins-gate"],
        ["moria", "rivendell"], false),
      // prettier-ignore
      "gladden-fields": initialRegion("gladden-fields", "Gladden Fields", null, false, null,
        ["old-ford", "rhosgobel", "north-anduin-vale", "dimrill-dale"],
        ["moria"], false),
      // prettier-ignore
      "dimrill-dale": initialRegion("dimrill-dale", "Dimrill Dale", null, false, null,
        ["gladden-fields", "north-anduin-vale", "south-anduin-vale", "parth-celebrant", "lorien", "moria"],
        [], false),
      // prettier-ignore
      "lorien": initialRegion("lorien", "Lorien", "elves", false, "stronghold",
        ["dimrill-dale", "parth-celebrant"],
        ["moria", "north-dunland"], false),
      // prettier-ignore
      "parth-celebrant": initialRegion("parth-celebrant", "Parth Celebrant", null, false, null,
        ["lorien", "south-anduin-vale", "western-brown-lands", "eastemnet", "fangorn"],
        ["north-dunland"], false),
      // prettier-ignore
      "fangorn": initialRegion("fangorn", "Fangorn", null, false, null,
        ["parth-celebrant", "eastemnet", "westemnet", "fords-of-isen"],
        ["north-dunland", "south-dunland", "orthanc"], false),
      // prettier-ignore
      "fords-of-isen": initialRegion("fords-of-isen", "Fords of Isen", "rohan", true, null,
        ["gap-of-rohan", "orthanc", "fangorn", "westemnet", "helms-deep", "druwaith-iaur"],
        ["anfalas"], false),
      // prettier-ignore
      "helms-deep": initialRegion("helms-deep", "Helms Deep", "rohan", false, "stronghold",
        ["fords-of-isen", "westemnet"],
        ["anfalas", "erech"], false),
      // prettier-ignore
      "westemnet": initialRegion("westemnet", "Westemnet", "rohan", false, "town",
        ["fangorn", "eastemnet", "folde", "edoras", "helms-deep", "fords-of-isen"],
        ["erech"], false),
      // prettier-ignore
      "edoras": initialRegion("edoras", "Edoras", "rohan", false, "city",
        ["westemnet", "folde"],
        ["erech", "lamedon"], false),
      // prettier-ignore
      "folde": initialRegion("folde", "Folde", "rohan", false, "town",
        ["edoras", "westemnet", "eastemnet", "druadan-forest"],
        ["lamedon"], false),
      // prettier-ignore
      "eastemnet": initialRegion("eastemnet", "Eastemnet", "rohan", false, null,
        ["fangorn", "parth-celebrant", "western-brown-lands", "western-emyn-muil", "druadan-forest", "folde", "westemnet"],
        [], false),
      // prettier-ignore
      "anfalas": initialRegion("anfalas", "Anfalas", "gondor", false, null,
        ["andrast", "erech", "dol-amroth"],
        ["fords-of-isen", "helms-deep"], true),
      // prettier-ignore
      "erech": initialRegion("erech", "Erech", "gondor", false, null,
        ["anfalas", "dol-amroth", "lamedon"],
        ["helms-deep", "westemnet", "edoras"], false),
      // prettier-ignore
      "dol-amroth": initialRegion("dol-amroth", "Dol Amroth", "gondor", false, "stronghold",
        ["anfalas", "erech", "lamedon"],
        [], true),
      // prettier-ignore
      "lamedon": initialRegion("lamedon", "Lamedon", "gondor", false, "town",
        ["erech", "dol-amroth", "pelargir"],
        ["edoras", "folde", "lossarnach", "minas-tirith", "druadan-forest"], true),
      // prettier-ignore
      "pelargir": initialRegion("pelargir", "Pelargir", "gondor", false, "city",
        ["lamedon", "lossarnach", "osgiliath", "west-harondor"],
        [], true),
      // prettier-ignore
      "lossarnach": initialRegion("lossarnach", "Lossarnach", "gondor", false, "town",
        ["minas-tirith", "osgiliath", "pelargir"],
        ["lamedon"], false),
      // prettier-ignore
      "minas-tirith": initialRegion("minas-tirith", "Minas Tirith", "gondor", false, "stronghold",
        ["druadan-forest", "osgiliath", "lossarnach"],
        ["lamedon"], false),
      // prettier-ignore
      "druadan-forest": initialRegion("druadan-forest", "Druadan Forest", "gondor", false, null,
        ["folde", "eastemnet", "western-emyn-muil", "dead-marshes", "osgiliath", "minas-tirith"],
        ["lamedon"], false),
      // prettier-ignore
      "carrock": initialRegion("carrock", "Carrock", "north", false, "town",
        ["eagles-eyre", "old-ford", "rhosgobel", "old-forest-road", "western-mirkwood", "northern-mirkwood"],
        ["mount-gundabad"], false),
      // prettier-ignore
      "rhosgobel": initialRegion("rhosgobel", "Rhosgobel", "north", false, null,
        ["carrock", "old-forest-road", "narrows-of-the-forest", "north-anduin-vale", "gladden-fields", "old-ford"],
        [], false),
      // prettier-ignore
      "north-anduin-vale": initialRegion("north-anduin-vale", "North Anduin Vale", null, false, null,
        ["rhosgobel", "narrows-of-the-forest", "dol-guldur", "south-anduin-vale", "dimrill-dale", "gladden-fields"],
        [], false),
      // prettier-ignore
      "south-anduin-vale": initialRegion("south-anduin-vale", "South Anduin Vale", null, false, null,
        ["north-anduin-vale", "dol-guldur", "western-brown-lands", "parth-celebrant", "dimrill-dale"],
        [], false),
      // prettier-ignore
      "western-brown-lands": initialRegion("western-brown-lands", "Western Brown Lands", null, false, null,
        ["south-anduin-vale", "dol-guldur", "eastern-brown-lands", "western-emyn-muil", "eastemnet", "parth-celebrant"],
        [], false),
      // prettier-ignore
      "western-emyn-muil": initialRegion("western-emyn-muil", "Western Emyn Muil", null, false, null,
        ["western-brown-lands", "eastern-brown-lands", "eastern-emyn-muil", "dead-marshes", "druadan-forest", "eastemnet"],
        [], false),
      // prettier-ignore
      "dead-marshes": initialRegion("dead-marshes", "Dead Marshes", null, false, null,
        ["western-emyn-muil", "eastern-emyn-muil", "north-ithilien", "osgiliath", "druadan-forest"],
        [], false),
      // prettier-ignore
      "osgiliath": initialRegion("osgiliath", "Osgiliath", null, true, null,
        ["dead-marshes", "north-ithilien", "south-ithilien", "west-harondor", "pelargir", "lossarnach", "minas-tirith", "druadan-forest"],
        [], false),
      // prettier-ignore
      "south-ithilien": initialRegion("south-ithilien", "South Ithilien", null, false, null,
        ["north-ithilien", "minas-morgul", "east-harondor", "west-harondor", "osgiliath"],
        ["gorgoroth", "nurn"], false),
      // prettier-ignore
      "north-ithilien": initialRegion("north-ithilien", "North Ithilien", null, false, null,
        ["eastern-emyn-muil", "dagorlad", "minas-morgul", "south-ithilien", "osgiliath", "dead-marshes"],
        ["morannon"], false),
      // prettier-ignore
      "eastern-emyn-muil": initialRegion("eastern-emyn-muil", "Eastern Emyn Muil", null, false, null,
        ["eastern-brown-lands", "noman-lands", "dagorlad", "north-ithilien", "dead-marshes", "western-emyn-muil"],
        [], false),
      // prettier-ignore
      "eastern-brown-lands": initialRegion("eastern-brown-lands", "Eastern Brown Lands", null, false, null,
        ["southern-mirkwood", "southern-rhovanion", "noman-lands", "eastern-emyn-muil", "western-emyn-muil", "western-brown-lands", "dol-guldur"],
        [], false),
      // prettier-ignore
      "dagorlad": initialRegion("dagorlad", "Dagorlad", null, false, null,
        ["noman-lands", "ash-mountains", "morannon", "north-ithilien", "eastern-emyn-muil"],
        [], false),
      // prettier-ignore
      "ash-mountains": initialRegion("ash-mountains", "Ash Mountains", null, false, null,
        ["dagorlad", "noman-lands", "southern-dorwinion", "south-rhun"],
        ["morannon", "barad-dur"], false),
      // prettier-ignore
      "noman-lands": initialRegion("noman-lands", "Noman-Lands", null, false, null,
        ["southern-rhovanion", "southern-dorwinion", "ash-mountains", "dagorlad", "eastern-emyn-muil", "eastern-brown-lands"],
        [], false),
      // prettier-ignore
      "southern-dorwinion": initialRegion("southern-dorwinion", "Southern Dorwinion", null, false, null,
        ["northern-dorwinion", "south-rhun", "ash-mountains", "noman-lands", "southern-rhovanion"],
        [], false),
      // prettier-ignore
      "northern-dorwinion": initialRegion("northern-dorwinion", "Northern Dorwinion", null, false, null,
        ["vale-of-the-celduin", "north-rhun", "southern-dorwinion", "southern-rhovanion"],
        [], false),
      // prettier-ignore
      "southern-rhovanion": initialRegion("southern-rhovanion", "Southern Rhovanion", null, false, null,
        ["northern-rhovanion", "vale-of-the-celduin", "northern-dorwinion", "southern-dorwinion", "noman-lands", "eastern-brown-lands", "southern-mirkwood"],
        [], false),
      // prettier-ignore
      "northern-rhovanion": initialRegion("northern-rhovanion", "Northern Rhovanion", null, false, null,
        ["dale", "vale-of-the-carnen", "vale-of-the-celduin", "southern-rhovanion", "southern-mirkwood", "eastern-mirkwood"],
        [], false),
      // prettier-ignore
      "vale-of-the-celduin": initialRegion("vale-of-the-celduin", "Vale of the Celduin", null, false, null,
        ["vale-of-the-carnen", "north-rhun", "northern-dorwinion", "southern-rhovanion", "northern-rhovanion"],
        [], false),
      // prettier-ignore
      "vale-of-the-carnen": initialRegion("vale-of-the-carnen", "Vale of the Carnen", null, false, null,
        ["iron-hills", "east-rhun", "north-rhun", "vale-of-the-celduin", "northern-rhovanion", "dale"],
        [], false),
      // prettier-ignore
      "eastern-mirkwood": initialRegion("eastern-mirkwood", "Eastern Mirkwood", null, false, null,
        ["old-forest-road", "northern-rhovanion", "southern-mirkwood", "dol-guldur", "narrows-of-the-forest"],
        [], false),
      // prettier-ignore
      "narrows-of-the-forest": initialRegion("narrows-of-the-forest", "Narrows of the Forest", null, false, null,
        ["old-forest-road", "eastern-mirkwood", "dol-guldur", "north-anduin-vale", "rhosgobel"],
        [], false),
      // prettier-ignore
      "dol-guldur": initialRegion("dol-guldur", "Dol Guldur", "sauron", false, "stronghold",
        ["north-anduin-vale", "narrows-of-the-forest", "eastern-mirkwood", "southern-mirkwood", "eastern-brown-lands", "western-brown-lands", "south-anduin-vale"],
        [], false),
      // prettier-ignore
      "southern-mirkwood": initialRegion("southern-mirkwood", "Southern Mirkwood", null, false, null,
        ["eastern-mirkwood", "northern-rhovanion", "southern-rhovanion", "eastern-brown-lands", "dol-guldur"],
        [], false),
      // prettier-ignore
      "old-forest-road": initialRegion("old-forest-road", "Old Forest Road", "north", false, null,
        ["woodland-realm", "dale", "northern-rhovanion", "eastern-mirkwood", "narrows-of-the-forest", "rhosgobel", "carrock", "western-mirkwood"],
        [], false),
      // prettier-ignore
      "western-mirkwood": initialRegion("western-mirkwood", "Western Mirkwood", null, false, null,
        ["northern-mirkwood", "woodland-realm", "old-forest-road", "carrock"],
        [], false),
      // prettier-ignore
      "northern-mirkwood": initialRegion("northern-mirkwood", "Northern Mirkwood", null, false, null,
        ["carrock", "western-mirkwood", "woodland-realm", "withered-heath"],
        [], false),
      // prettier-ignore
      "withered-heath": initialRegion("withered-heath", "Withered Heath", null, false, null,
        ["northern-mirkwood", "woodland-realm", "dale", "erebor"],
        [], false),
      // prettier-ignore
      "woodland-realm": initialRegion("woodland-realm", "Woodland Realm", "elves", false, "stronghold",
        ["northern-mirkwood", "withered-heath", "dale", "old-forest-road", "western-mirkwood"],
        [], false),
      // prettier-ignore
      "dale": initialRegion("dale", "Dale", "north", false, "city",
        ["erebor", "iron-hills", "vale-of-the-carnen", "northern-rhovanion", "old-forest-road", "woodland-realm", "withered-heath"],
        [], false),
      // prettier-ignore
      "erebor": initialRegion("erebor", "Erebor", "dwarves", false, "stronghold",
        ["iron-hills", "dale", "withered-heath"],
        [], false),
      // prettier-ignore
      "iron-hills": initialRegion("iron-hills", "Iron Hills", "dwarves", false, "town",
        ["east-rhun", "vale-of-the-carnen", "dale", "erebor"],
        [], false),
      // prettier-ignore
      "north-rhun": initialRegion("north-rhun", "North Rhun", "southrons", false, "town",
        ["east-rhun", "northern-rhovanion", "vale-of-the-celduin", "vale-of-the-carnen"],
        [], false),
      // prettier-ignore
      "east-rhun": initialRegion("east-rhun", "East Rhun", "southrons", false, null,
        ["iron-hills", "south-rhun", "north-rhun", "vale-of-the-carnen"],
        [], false),
      // prettier-ignore
      "south-rhun": initialRegion("south-rhun", "South Rhun", "southrons", false, "town",
        ["east-rhun", "ash-mountains", "southern-dorwinion"],
        ["barad-dur"], false),
      // prettier-ignore
      "morannon": initialRegion("morannon", "Morannon", "sauron", false, "stronghold",
        ["dagorlad", "gorgoroth"],
        ["ash-mountains", "barad-dur", "minas-morgul", "north-ithilien"], false),
      // prettier-ignore
      "minas-morgul": initialRegion("minas-morgul", "Minas Morgul", "sauron", false, "stronghold",
        ["gorgoroth", "south-ithilien", "north-ithilien"],
        ["morannon"], false),
      // prettier-ignore
      "gorgoroth": initialRegion("gorgoroth", "Gorgoroth", "sauron", false, null,
        ["barad-dur", "nurn", "minas-morgul", "morannon"],
        ["south-ithilien", "south-rhun", "khand"], false),
      // prettier-ignore
      "nurn": initialRegion("nurn", "Nurn", "sauron", false, "town",
        ["gorgoroth"],
        ["khand", "east-harondor", "south-ithilien"], false),
      // prettier-ignore
      "barad-dur": initialRegion("barad-dur", "Barad-dur", "sauron", false, "stronghold",
        ["gorgoroth"],
        ["south-rhun", "morannon", "ash-mountains"], false),
      // prettier-ignore
      "west-harondor": initialRegion("west-harondor", "West Harondor", null, false, null,
        ["pelargir", "osgiliath", "south-ithilien", "east-harondor", "near-harad", "umbar"],
        [], true),
      // prettier-ignore
      "east-harondor": initialRegion("east-harondor", "East Harondor", null, false, null,
        ["south-ithilien", "near-harad", "west-harondor"],
        ["nurn", "khand"], false),
      // prettier-ignore
      "umbar": initialRegion("umbar", "Umbar", "southrons", false, "stronghold",
        ["west-harondor", "near-harad"],
        [], true),
      // prettier-ignore
      "near-harad": initialRegion("near-harad", "Near Harad", "southrons", false, "town",
        ["east-harondor", "khand", "far-harad", "umbar", "west-harondor"],
        [], false),
      // prettier-ignore
      "far-harad": initialRegion("far-harad", "Far Harad", "southrons", false, "city",
        ["khand", "near-harad"],
        [], false),
      // prettier-ignore
      "khand": initialRegion("khand", "Khand", "southrons", false, null,
        ["far-harad", "near-harad"],
        ["east-harondor", "nurn"], false)
    }
  };
}

function initialRegion(
  id: WotrRegionId,
  name: string,
  nationId: WotrNationId | null,
  fortification: boolean,
  settlement: WotrSettlentType | null,
  passableNeighbors: WotrRegionId[],
  impassableNeighbors: WotrRegionId[],
  seaside: boolean
): WotrRegion {
  const neighbors: WotrNeighbor[] = [];
  passableNeighbors.forEach(neighborId => neighbors.push({ id: neighborId, impassable: false }));
  impassableNeighbors.forEach(neighborId => neighbors.push({ id: neighborId, impassable: true }));
  const region: WotrRegion = {
    id: id,
    name: name,
    ...(nationId ? { nationId, frontId: frontOfNation(nationId) } : {}),
    ...(fortification ? { fortification } : {}),
    ...(settlement ? { settlement } : {}),
    neighbors: neighbors,
    seaside: seaside,
    fellowship: false
  };
  if (settlement && nationId) {
    region.controlledBy = frontOfNation(nationId);
  }
  return region;
}

@Injectable({ providedIn: "root" })
export class WotrRegionStore {
  private unitUtils = inject(WotrUnitUtils);
  private characterStore = inject(WotrCharacterStore);

  update!: (actionName: string, updater: (a: WotrRegionState) => WotrRegionState) => void;
  state!: Signal<WotrRegionState>;

  regions = computed(() => {
    const s = this.state();
    return s.ids.map(id => s.map[id]);
  });
  region(regionId: WotrRegionId): WotrRegion {
    return this.state().map[regionId];
  }
  isCharacterInRegion(character: WotrCharacterId, regionId: WotrRegionId) {
    const region = this.region(regionId);
    return (
      region.army?.characters?.includes(character) ||
      region.underSiegeArmy?.characters?.includes(character) ||
      region.freeUnits?.characters?.includes(character) ||
      false
    );
  }
  characterRegion(character: WotrCharacterId): WotrRegion | null {
    return this.regions().find(r => this.isCharacterInRegion(character, r.id)) || null;
  }
  isNazgulInRegion(regionId: WotrRegionId) {
    const region = this.region(regionId);
    return (
      !!region.army?.nNazgul ||
      !!region.freeUnits?.nNazgul ||
      this.isCharacterInRegion("the-witch-king", regionId)
    );
  }
  isArmyInRegion(frontId: WotrFrontId, regionId: WotrRegionId) {
    const region = this.region(regionId);
    return region.army?.front === frontId;
  }
  canMoveNazgul() {
    return this.regions().some(region => this.isNazgulInRegion(region.id));
  }
  isUnconquered(regionId: WotrRegionId) {
    const region = this.region(regionId);
    return region.frontId === region.controlledBy;
  }
  isFreeForArmyMovement(id: WotrRegionId, frontId: WotrFrontId): boolean {
    return this.isFree(id, frontId);
  }
  isFreeForRecruitment(id: WotrRegionId, frontId: WotrFrontId): boolean {
    return this.isFree(id, frontId);
  }
  isFreeForRecruitmentByCard(id: WotrRegionId, frontId: WotrFrontId): boolean {
    const region = this.region(id);
    if (!region.army) return true;
    return region.army.front === frontId || region.underSiegeArmy?.front === frontId;
  }
  isFreeForArmyRetreat(neighbor: WotrNeighbor, frontId: WotrFrontId): boolean {
    if (neighbor.impassable) return false;
    return this.isFree(neighbor.id, frontId);
  }
  private isFree(id: WotrRegionId, frontId: WotrFrontId): boolean {
    const region = this.region(id);
    if (!region.army) return true;
    return region.army.front === frontId;
  }
  hasRecruitmentSettlement(nation: WotrNation, exludedRegions: Set<WotrRegionId>): boolean {
    return this.regions()
      .filter(r => !exludedRegions.has(r.id))
      .some(r => this.isRecruitmentRegion(r, nation));
  }
  isRecruitmentRegion(region: WotrRegion, nation: WotrNation): boolean {
    return (
      region.nationId === nation.id &&
      region.controlledBy === nation.front &&
      !!region.settlement &&
      this.isFreeForRecruitment(region.id, nation.front)
    );
  }
  recruitmentRegions(nation: WotrNation): WotrRegion[] {
    return this.regions().filter(r => this.isRecruitmentRegion(r, nation));
  }
  isUnderSiege(regionId: WotrRegionId): boolean {
    const region = this.region(regionId);
    return !!region.underSiegeArmy;
  }
  strongholdRegions(nationId: WotrNationId): WotrRegion[] {
    return this.regions().filter(r => r.nationId === nationId && r.settlement === "stronghold");
  }

  private updateRegion(
    actionName: string,
    regionId: WotrRegionId,
    updater: (a: WotrRegion) => WotrRegion
  ) {
    this.update(actionName, s => ({
      ...s,
      map: { ...s.map, [regionId]: updater(s.map[regionId]) }
    }));
  }

  private updateArmy(
    actionName: string,
    regionId: WotrRegionId,
    updater: (a: WotrArmy | undefined) => WotrArmy | undefined
  ) {
    this.updateRegion(actionName, regionId, region => {
      const { army, ...restRegion } = region;
      const newArmy = updater(army);
      return newArmy ? { ...restRegion, army: newArmy } : restRegion;
    });
    this.joinNazgulToArmy(regionId);
    this.joinCharactersToArmy(regionId);
  }

  private updateArmyUnderSiege(
    actionName: string,
    regionId: WotrRegionId,
    updater: (a: WotrArmy | undefined) => WotrArmy | undefined
  ) {
    this.updateRegion(actionName, regionId, region => {
      const { underSiegeArmy, ...restRegion } = region;
      const newArmy = updater(underSiegeArmy);
      return newArmy ? { ...restRegion, underSiegeArmy: newArmy } : restRegion;
    });
    this.joinNazgulToArmy(regionId);
    this.joinCharactersToArmy(regionId);
  }

  private updateFreeUnits(
    actionName: string,
    regionId: WotrRegionId,
    updater: (a: WotrFreeUnits | undefined) => WotrFreeUnits
  ) {
    this.updateRegion(actionName, regionId, region => {
      const { freeUnits, ...restRegion } = region;
      const newFreeUnits = updater(freeUnits);
      if (!newFreeUnits.characters?.length && !newFreeUnits.nNazgul) {
        return restRegion;
      }
      return { ...restRegion, freeUnits: newFreeUnits };
    });
  }

  private joinNazgulToArmy(regionId: WotrRegionId) {
    const region = this.region(regionId);
    if (region.army?.front === "shadow") {
      const nNazgul = region.freeUnits?.nNazgul;
      if (nNazgul) {
        this.removeNazgulFromFreeUnits(nNazgul, regionId);
        this.addNazgulToArmy(nNazgul, regionId);
      }
    }
  }

  private joinCharactersToArmy(regionId: WotrRegionId) {
    const region = this.region(regionId);
    if (!region.army?.front) {
      return;
    }
    const characters = region.freeUnits?.characters;
    characters?.forEach(characterId => {
      const character = this.characterStore.character(characterId);
      if (character.front === region.army?.front) {
        this.removeCharacterFromFreeUnits(characterId, regionId);
        this.addCharacterToArmy(characterId, regionId);
      }
    });
  }
  addRegularsToArmy(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    this.updateArmy("addRegularsToArmy", regionId, army =>
      this.unitUtils.addRegulars(quantity, nation, army)
    );
  }
  removeRegularsFromArmy(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    this.updateArmy("removeRegularsFromArmy", regionId, army =>
      this.unitUtils.removeRegulars(quantity, nation, army)
    );
  }
  addElitesToArmy(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    this.updateArmy("addElitesToArmy", regionId, army =>
      this.unitUtils.addElites(quantity, nation, army)
    );
  }
  removeElitesFromArmy(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    this.updateArmy("removeElitesFromArmy", regionId, army =>
      this.unitUtils.removeElites(quantity, nation, army)
    );
  }
  addLeadersToArmy(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    this.updateArmy("addLeadersToArmy", regionId, army =>
      this.unitUtils.addLeaders(quantity, nation, army)
    );
  }
  removeLeadersFromArmy(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    this.updateArmy("removeLeadersFromArmy", regionId, army =>
      this.unitUtils.removeLeaders(quantity, nation, army)
    );
  }
  addNazgulToArmy(quantity: number, regionId: WotrRegionId) {
    this.updateArmy("addNazgulToArmy", regionId, army => this.unitUtils.addNazgul(quantity, army));
  }
  removeNazgulFromArmy(quantity: number, regionId: WotrRegionId) {
    this.updateArmy("removeNazgulFromArmy", regionId, army =>
      this.unitUtils.removeNazgul(quantity, army)
    );
  }

  addRegularsToArmyUnderSiege(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    this.updateArmyUnderSiege("addRegularsToArmyUnderSiege", regionId, army =>
      this.unitUtils.addRegulars(quantity, nation, army)
    );
  }
  removeRegularsFromArmyUnderSiege(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    this.updateArmyUnderSiege("removeRegularsFromArmyUnderSiege", regionId, army =>
      this.unitUtils.removeRegulars(quantity, nation, army)
    );
  }
  addElitesToArmyUnderSiege(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    this.updateArmyUnderSiege("addElitesToArmyUnderSiege", regionId, army =>
      this.unitUtils.addElites(quantity, nation, army)
    );
  }
  removeElitesFromArmyUnderSiege(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    this.updateArmyUnderSiege("removeElitesFromArmyUnderSiege", regionId, army =>
      this.unitUtils.removeElites(quantity, nation, army)
    );
  }
  addLeadersToArmyUnderSiege(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    this.updateArmyUnderSiege("addLeadersToArmyUnderSiege", regionId, army =>
      this.unitUtils.addLeaders(quantity, nation, army)
    );
  }
  removeLeadersFromArmyUnderSiege(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    this.updateArmyUnderSiege("removeLeadersFromArmyUnderSiege", regionId, army =>
      this.unitUtils.removeLeaders(quantity, nation, army)
    );
  }
  addNazgulToArmyUnderSiege(quantity: number, regionId: WotrRegionId) {
    this.updateArmyUnderSiege("addNazgulToArmyUnderSiege", regionId, army =>
      this.unitUtils.addNazgul(quantity, army)
    );
  }
  removeNazgulFromArmyUnderSiege(quantity: number, regionId: WotrRegionId) {
    this.updateArmyUnderSiege("removeNazgulFromArmyUnderSiege", regionId, army =>
      this.unitUtils.removeNazgul(quantity, army)
    );
  }

  addNazgulToFreeUnits(quantity: number, regionId: WotrRegionId) {
    this.updateFreeUnits("addNazgulToFreeUnits", regionId, freeUnits => {
      if (!freeUnits) {
        freeUnits = {};
      }
      return { ...freeUnits, nNazgul: (freeUnits.nNazgul || 0) + quantity };
    });
  }

  removeNazgulFromFreeUnits(quantity: number, regionId: WotrRegionId) {
    this.updateFreeUnits("removeNazgulFromFreeUnits", regionId, freeUnits => {
      if (!freeUnits) {
        throw new Error("removeNazgulFromFreeUnits");
      }
      return { ...freeUnits, nNazgul: (freeUnits.nNazgul || 0) - quantity };
    });
  }

  addCharacterToArmy(characterId: WotrCharacterId, regionId: WotrRegionId) {
    this.updateArmy("addCharacterToArmy", regionId, army =>
      this.unitUtils.addCharacter(characterId, army)
    );
  }

  addCharacterToUnderSiegeArmy(characterId: WotrCharacterId, regionId: WotrRegionId) {
    this.updateArmyUnderSiege("addCharacterToUnderSiegeArmy", regionId, army =>
      this.unitUtils.addCharacter(characterId, army)
    );
  }

  removeCharacterFromArmy(characterId: WotrCharacterId, regionId: WotrRegionId) {
    this.updateArmy("removeCharacterFromArmy", regionId, army =>
      this.unitUtils.removeCharacter(characterId, army)
    );
  }
  removeCharacterFromUnderSiegeArmy(characterId: WotrCharacterId, regionId: WotrRegionId) {
    this.updateArmyUnderSiege("removeCharacterFromUnderSiegeArmy", regionId, army =>
      this.unitUtils.removeCharacter(characterId, army)
    );
  }

  moveArmy(fromRegionId: WotrRegionId, toRegionId: WotrRegionId, leftUnits?: WotrUnits) {
    const fromRegion = this.region(fromRegionId);
    const toRegion = this.region(toRegionId);
    const fromArmy = fromRegion.army;
    const movingArmy = this.unitUtils.splitUnits(fromArmy, leftUnits);
    if (leftUnits && this.unitUtils.hasArmyUnits(leftUnits)) {
      this.updateArmy("moveArmy", fromRegionId, () => this.unitUtils.unitsToArmy(leftUnits));
    } else {
      this.updateArmy("moveArmy", fromRegionId, () => leftUnits as any);
      this.freeNazgulFromArmy(fromRegionId);
      this.freeCharactersFromArmy(fromRegionId);
    }

    const toArmy = toRegion.army;
    const mergedArmy = this.unitUtils.mergeArmies(toArmy, movingArmy);
    this.updateArmy("moveArmy", toRegionId, () => mergedArmy);
  }

  private freeNazgulFromArmy(regionId: WotrRegionId) {
    const region = this.region(regionId);
    const army = region.army;
    if (army?.nNazgul && !this.unitUtils.hasArmyUnits(army)) {
      this.removeNazgulFromArmy(army.nNazgul, regionId);
      this.addNazgulToFreeUnits(army.nNazgul, regionId);
    }
  }

  private freeCharactersFromArmy(regionId: WotrRegionId) {
    const region = this.region(regionId);
    const army = region.army;
    if (army?.characters && !this.unitUtils.hasArmyUnits(army)) {
      for (const character of army.characters) {
        this.removeCharacterFromArmy(character, regionId);
        this.addCharacterToFreeUnits(character, regionId);
      }
    }
  }

  addCharacterToFreeUnits(characterId: WotrCharacterId, regionId: WotrRegionId) {
    this.updateFreeUnits("addCharacterToFreeUnits", regionId, freeunits => {
      if (!freeunits) {
        freeunits = {};
      }
      return {
        ...freeunits,
        characters: immutableUtil.listPush([characterId], freeunits.characters || [])
      };
    });
  }

  removeCharacterFromFreeUnits(characterId: WotrCharacterId, regionId: WotrRegionId) {
    this.updateFreeUnits("removeCharacterFromFreeUnits", regionId, freeunits => {
      if (!freeunits?.characters) throw new Error("No characters in free units to remove");
      return {
        ...freeunits,
        characters: immutableUtil.listRemoveFirst(
          c => c === characterId,
          freeunits.characters || []
        )
      };
    });
  }

  moveArmyIntoSiege(regionId: WotrRegionId) {
    this.updateRegion("moveArmyIntoSiege", regionId, region => {
      const { army, ...newRegion } = region;
      if (!army) {
        throw new Error("moveArmyIntoSiege");
      }
      return {
        ...newRegion,
        underSiegeArmy: army
      };
    });
  }

  moveArmyOutOfSiege(regionId: WotrRegionId) {
    this.updateRegion("moveArmyOutOfSiege", regionId, region => {
      const { underSiegeArmy, ...newRegion } = region;
      if (!underSiegeArmy) {
        throw new Error("moveArmyOutOfSiege");
      }
      return {
        ...newRegion,
        army: underSiegeArmy
      };
    });
  }

  addFellowshipToRegion(regionId: WotrRegionId) {
    this.updateRegion("addFellowshipToRegion", regionId, units => ({
      ...units,
      fellowship: true
    }));
  }

  removeFellowshipFromRegion() {
    this.updateRegion("removeFellowshipFromRegion", this.fellowshipRegion(), units => ({
      ...units,
      fellowship: false
    }));
  }

  fellowshipRegion() {
    const state = this.state();
    return this.state().ids.find(r => state.map[r].fellowship)!;
  }

  moveFellowshipToRegion(regionId: WotrRegionId) {
    this.update("moveFellowshipToRegion", state => {
      const fromRegionId = state.ids.find(r => state.map[r].fellowship)!;
      const toRegionId = state.ids.find(r => r === regionId)!;
      return {
        ...state,
        map: {
          ...state.map,
          [fromRegionId]: { ...state.map[fromRegionId], fellowship: false },
          [toRegionId]: { ...state.map[toRegionId], fellowship: true }
        }
      };
    });
  }

  setControlledBy(front: WotrFrontId, regionId: WotrRegionId) {
    this.updateRegion("setControlledBy", regionId, region => ({
      ...region,
      controlledBy: front
    }));
  }

  reachableRegions(
    startRegionId: WotrRegionId,
    maxDistance: number,
    canEnter?: (region: WotrRegion, distance: number) => boolean,
    canLeave?: (region: WotrRegion, distance: number) => boolean
  ): WotrRegionId[] {
    const reachable: WotrRegionId[] = [];
    const visited = new Set<WotrRegionId>();
    const queue: { regionId: WotrRegionId; distance: number }[] = [
      { regionId: startRegionId, distance: 0 }
    ];
    while (queue.length > 0) {
      const { regionId, distance } = queue.shift()!;
      if (visited.has(regionId) || distance > maxDistance) continue;
      visited.add(regionId);
      const region = this.region(regionId);
      if (!canEnter || canEnter(region, distance)) {
        reachable.push(regionId);
      }

      if (!canLeave || canLeave(region, distance)) {
        const neighbors = region.neighbors;
        for (const neighbor of neighbors) {
          if (neighbor.impassable) {
            continue;
          }
          if (!visited.has(neighbor.id)) {
            queue.push({ regionId: neighbor.id, distance: distance + 1 });
          }
        }
      }
    }
    return Array.from(reachable);
  }

  pathsBetweenRegions(
    startRegionId: WotrRegionId,
    endRegionId: WotrRegionId,
    maxDistance: number
  ): WotrRegionId[][] {
    const allPaths: WotrRegionId[][] = [];
    const visited = new Set<WotrRegionId>();
    const queue: { path: WotrRegionId[]; distance: number }[] = [
      { path: [startRegionId], distance: 0 }
    ];
    while (queue.length > 0) {
      const { path, distance } = queue.shift()!;
      const currentRegionId = path[path.length - 1];
      if (currentRegionId === endRegionId && distance <= maxDistance) {
        allPaths.push(path);
      }
      if (distance < maxDistance) {
        const neighbors = this.region(currentRegionId).neighbors;
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor.id)) {
            visited.add(neighbor.id);
            queue.push({ path: [...path, neighbor.id], distance: distance + 1 });
          }
        }
      }
    }
    return allPaths;
  }
}
