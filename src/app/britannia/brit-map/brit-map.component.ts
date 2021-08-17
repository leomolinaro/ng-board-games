import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, TrackByFunction, ViewChild } from "@angular/core";
import { BgSvgComponent } from "@bg-components/svg";
import { arrayUtil, SimpleChanges } from "@bg-utils";
import { BritArea, BritAreaId, BritUnit, BritUnitId } from "../brit-models";
import { BritMapService } from "./brit-map.service";

export interface BritAreaNode {
  id: BritAreaId;
  area: BritArea;
  path: string;
  unitNodes: BritUnitNode[];
  unitNodeMap: Record<BritUnitId, BritUnitNode>;
} // BritAreaNode

interface BritUnitNode {
  x: number;
  y: number;
  id: BritUnitId;
  unit: BritUnit;
  imageSource: string;
} // BritUnitNode

type BritAreaSlot = 0;

@Component ({
  selector: "brit-map",
  templateUrl: "./brit-map.component.html",
  styleUrls: ["./brit-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritMapComponent implements OnChanges {

  constructor (
    private mapService: BritMapService
  ) { }

  @Input () areas!: BritArea[];
  @Input () unitsMap!: Record<BritUnitId, BritUnit>;
  // in caso di update dell'unità in un'area, bisogna cambiare il riferimento delle BritArea.units

  areaNodes!: BritAreaNode[];
  private areaNodeMap!: Record<BritAreaId, BritAreaNode>;
  viewBox = this.mapService.getViewBox ();
  mapWidth = this.mapService.getWidth ();

  @ViewChild (BgSvgComponent) bgSvg!: BgSvgComponent;
  @ViewChild ("britMapMap") mapElementRef!: ElementRef<SVGGElement>;

  areaTrackBy: TrackByFunction<BritAreaNode> = (index: number, areaNode: BritAreaNode) => areaNode.id;
  unitTrackBy: TrackByFunction<BritUnitNode> = (index: number, unitNode: BritUnitNode) => unitNode.id;

  ngOnChanges (changes: SimpleChanges<BritMapComponent>) {
    if (changes.areas) {
      const { nodes, map } = arrayUtil.entitiesToNodes (
        this.areas, this.areaNodeMap || { },
        area => area.id,
        (area, node) => area === node.area,
        (area, index, oldNode) => this.areaToNode (area, oldNode)
      );
      this.areaNodes = nodes;
      this.areaNodeMap = map;
    } // if
  } // ngOnChanges

  private areaToNode (area: BritArea, oldNode: BritAreaNode | null): BritAreaNode {
    const path = this.mapService.getPath (area.id);
    let unitNodes: BritUnitNode[];
    let unitNodeMap: Record<BritUnitId, BritUnitNode>;
    if (area.units === oldNode?.area.units) {
      unitNodes = oldNode.unitNodes;
      unitNodeMap = oldNode.unitNodeMap;
    } else {
      const { nodes, map } = arrayUtil.entitiesToNodes<string, BritUnitNode> (
        area.units, oldNode?.unitNodeMap || { },
        unitId => unitId,
        (unitId, node) => this.unitsMap[unitId] === node.unit,
        (unitId, index, oldNode) => this.unitToNode (unitId, index, oldNode, area)
      );
      unitNodes = nodes;
      unitNodeMap = map;
    } // if - else
    return {
      id: area.id,
      area,
      path,
      unitNodes,
      unitNodeMap
    };
  } // areaToNode

  private unitToNode (unitId: BritUnitId, index: number, oldNode: BritUnitNode | null, area: BritArea): BritUnitNode {
    const unit = this.unitsMap[unitId]
    const imageSource = this.getUnitImageSource (unit);
    return {
      id: unitId,
      unit,
      imageSource,
      ...this.getUnitCoordinates (index as BritAreaSlot, area.id)
    };
  } // unitToNode

  private getUnitImageSource (unit: BritUnit) {
    switch (unit.type) {
      case "infantry": return `assets/britannia/infantries/${unit.nation}.png`;
      case "cavalry": return `assets/britannia/cavalries/${unit.nation}.png`;
      case "roman-fort": return `assets/britannia/buildings/roman-fort.png`;
      case "saxon-buhr": return `assets/britannia/buildings/saxon-buhr.png`;
      case "leader": return `assets/britannia/leaders/${unit.id}.png`;
    } // switch
  } // getUnitImageSource

  onAreaClick (areaNode: BritAreaNode, event: MouseEvent) {
    // const map = this.mapElementRef.nativeElement;
    // const pt = this.bgSvg.createSVGPoint ();
    // pt.x = event.clientX;
    // pt.y = event.clientY;
    // let svgP = pt.matrixTransform (map.getScreenCTM ()!.inverse ());
    // this.addSlot (svgP.x, svgP.y, areaNode.id);
  } // onAreaClick

  getUnitCoordinates (slot: BritAreaSlot, areaId: BritAreaId) {
    const areaSlots = this.slotsByArea[areaId];
    const coordinates = areaSlots ? areaSlots[slot] : null;
    if (coordinates) { return coordinates; }
    return { x: 0, y: 0 };
  } // getUnitCoordinates

  slotsByArea: Record<BritAreaId, { x: number; y: number }[]> = {
    "wessex": [{ x: 451, y: 1051 }, { x: 395, y: 1059 }, { x: 366, y: 1079 }, { x: 406, y: 1090 }, { x: 461, y: 1081 }],
    "sussex": [{ x: 578, y: 1091 }, { x: 530, y: 1053 }, { x: 511, y: 1079 }, { x: 570, y: 1054 }, { x: 600, y: 1069 }],
    "essex": [{ x: 573, y: 976 }, { x: 534, y: 996 }, { x: 521, y: 1027 }, { x: 573, y: 1013 }, { x: 613, y: 969 }],
    "kent": [{ x: 654, y: 1040 }, { x: 613, y: 1014 }, { x: 598, y: 1034 }, { x: 629, y: 1049 }, { x: 666, y: 1014 }],
    "avalon": [{ x: 346, y: 1017 }, { x: 340, y: 1058 }, { x: 325, y: 1036 }, { x: 371, y: 1037 }, { x: 371, y: 1008 }],
    "downlands": [{ x: 459, y: 1028 }, { x: 416, y: 1027 }, { x: 399, y: 1001 }, { x: 438, y: 1000 }, { x: 488, y: 1021 }],
    "south-mercia": [{ x: 504, y: 971 }, { x: 464, y: 985 }, { x: 458, y: 958 }, { x: 496, y: 994 }, { x: 497, y: 949 }],
    "suffolk": [{ x: 631, y: 933 }, { x: 562, y: 913 }, { x: 548, y: 949 }, { x: 608, y: 904 }, { x: 661, y: 908 }],
    "devon": [{ x: 294, y: 1096 }, { x: 273, y: 1042 }, { x: 243, y: 1064 }, { x: 300, y: 1061 }, { x: 262, y: 1125 }],
    "cornwall": [{ x: 167, y: 1155 }, { x: 202, y: 1122 }, { x: 213, y: 1088 }, { x: 174, y: 1121 }, { x: 134, y: 1146 }],
    "gwent": [{ x: 337, y: 976 }, { x: 294, y: 952 }, { x: 267, y: 974 }, { x: 322, y: 950 }, { x: 302, y: 992 }],
    "powys": [{ x: 333, y: 847 }, { x: 322, y: 909 }, { x: 297, y: 920 }, { x: 307, y: 887 }, { x: 299, y: 860 }],
    "dyfed": [{ x: 194, y: 943 }, { x: 261, y: 926 }, { x: 270, y: 894 }, { x: 234, y: 947 }, { x: 222, y: 922 }],
    "clwyd": [{ x: 342, y: 813 }, { x: 333, y: 784 }, { x: 307, y: 782 }, { x: 356, y: 786 }, { x: 312, y: 810 }],
    "march": [{ x: 401, y: 869 }, { x: 422, y: 822 }, { x: 376, y: 833 }, { x: 433, y: 862 }, { x: 364, y: 865 }],
    "hwicce": [{ x: 390, y: 966 }, { x: 402, y: 913 }, { x: 364, y: 907 }, { x: 361, y: 937 }, { x: 419, y: 950 }],
    "norfolk": [{ x: 660, y: 874 }, { x: 642, y: 841 }, { x: 606, y: 845 }, { x: 675, y: 846 }, { x: 617, y: 874 }],
    "lindsey": [{ x: 542, y: 848 }, { x: 571, y: 784 }, { x: 534, y: 791 }, { x: 550, y: 815 }, { x: 571, y: 871 }],
    "york": [{ x: 477, y: 726 }, { x: 502, y: 768 }, { x: 456, y: 789 }, { x: 537, y: 751 }, { x: 524, y: 714 }],
    "cheshire": [{ x: 413, y: 792 }, { x: 378, y: 752 }, { x: 354, y: 751 }, { x: 397, y: 757 }, { x: 385, y: 798 }],
    "pennines": [{ x: 411, y: 654 }, { x: 425, y: 725 }, { x: 451, y: 756 }, { x: 442, y: 690 }, { x: 397, y: 610 }],
    "bernicia": [{ x: 512, y: 661 }, { x: 471, y: 617 }, { x: 436, y: 615 }, { x: 448, y: 644 }, { x: 474, y: 680 }],
    "cumbria": [{ x: 372, y: 684 }, { x: 340, y: 607 }, { x: 319, y: 633 }, { x: 364, y: 636 }, { x: 382, y: 716 }],
    "lothian": [{ x: 430, y: 564 }, { x: 379, y: 517 }, { x: 346, y: 527 }, { x: 417, y: 516 }, { x: 394, y: 566 }],
    "galloway": [{ x: 301, y: 563 }, { x: 242, y: 591 }, { x: 212, y: 591 }, { x: 272, y: 590 }, { x: 333, y: 564 }],
    "strathclyde": [{ x: 271, y: 492 }, { x: 274, y: 534 }, { x: 239, y: 545 }, { x: 302, y: 514 }, { x: 234, y: 487 }],
    "dunedin": [{ x: 295, y: 455 }, { x: 292, y: 416 }, { x: 343, y: 406 }, { x: 349, y: 435 }, { x: 343, y: 472 }],
    "dalriada": [{ x: 191, y: 473 }, { x: 249, y: 425 }, { x: 220, y: 387 }, { x: 189, y: 421 }, { x: 147, y: 462 }],
    "alban": [{ x: 302, y: 376 }, { x: 327, y: 341 }, { x: 270, y: 344 }, { x: 269, y: 369 }, { x: 341, y: 369 }],
    "mar": [{ x: 366, y: 323 }, { x: 381, y: 282 }, { x: 349, y: 284 }, { x: 417, y: 287 }, { x: 398, y: 336 }],
    "gwynedd": [{ x: 267, y: 843 }, { x: 269, y: 788 }, { x: 234, y: 771 }, { x: 276, y: 818 }, { x: 229, y: 825 }],
    "north-mercia": [{ x: 482, y: 905 }, { x: 499, y: 830 }, { x: 466, y: 839 }, { x: 446, y: 900 }, { x: 514, y: 898 }],
    "moray": [{ x: 308, y: 294 }, { x: 247, y: 275 }, { x: 262, y: 251 }, { x: 277, y: 277 }, { x: 275, y: 310 }],
    "skye": [{ x: 153, y: 342 }, { x: 182, y: 284 }, { x: 149, y: 294 }, { x: 218, y: 297 }, { x: 147, y: 389 }],
    "hebrides": [{ x: 119, y: 193 }, { x: 74, y: 269 }, { x: 66, y: 304 }, { x: 94, y: 238 }, { x: 145, y: 162 }],
    "caithness": [{ x: 284, y: 173 }, { x: 288, y: 211 }, { x: 229, y: 206 }, { x: 236, y: 169 }, { x: 330, y: 171 }],
    "orkneys": [{ x: 331, y: 112 }, { x: 361, y: 75 }, { x: 333, y: 66 }, { x: 355, y: 103 }, { x: 314, y: 92 }],
    "north-sea": [{ x: 458, y: 368 }, { x: 496, y: 369 }, { x: 544, y: 368 }, { x: 624, y: 366 }, { x: 445, y: 421 }, { x: 509, y: 421 }, { x: 577, y: 424 }, { x: 649, y: 424 }, { x: 496, y: 518 }, { x: 543, y: 519 }, { x: 613, y: 519 }, { x: 673, y: 515 }, { x: 525, y: 588 }, { x: 578, y: 588 }, { x: 637, y: 588 }, { x: 695, y: 588 }],
    "frisian-sea": [{ x: 600, y: 741 }, { x: 630, y: 737 }, { x: 666, y: 736 }, { x: 703, y: 734 }, { x: 604, y: 790 }, { x: 640, y: 791 }, { x: 665, y: 791 }, { x: 707, y: 792 }, { x: 713, y: 834 }, { x: 709, y: 866 }, { x: 714, y: 895 }, { x: 706, y: 934 }, { x: 665, y: 973 }, { x: 706, y: 953 }, { x: 692, y: 993 }, { x: 719, y: 1020 }],
    "english-channel": [{ x: 340, y: 1129 }, { x: 374, y: 1129 }, { x: 414, y: 1129 }, { x: 461, y: 1126 }, { x: 496, y: 1125 }, { x: 553, y: 1121 }, { x: 599, y: 1118 }, { x: 652, y: 1114 }, { x: 341, y: 1166 }, { x: 379, y: 1166 }, { x: 427, y: 1167 }, { x: 472, y: 1167 }, { x: 512, y: 1169 }, { x: 566, y: 1169 }, { x: 600, y: 1168 }, { x: 658, y: 1165 }],
    "atlantic-ocean": [{ x: 87, y: 839 }, { x: 116, y: 843 }, { x: 165, y: 846 }, { x: 209, y: 861 }, { x: 77, y: 898 }, { x: 107, y: 897 }, { x: 164, y: 897 }, { x: 48, y: 939 }, { x: 89, y: 946 }, { x: 137, y: 958 }, { x: 17, y: 993 }, { x: 43, y: 1028 }, { x: 96, y: 1024 }, { x: 147, y: 1020 }, { x: 58, y: 1070 }, { x: 138, y: 1066 }],
    "irish-sea": [{ x: 21, y: 463 }, { x: 60, y: 461 }, { x: 16, y: 500 }, { x: 65, y: 499 }, { x: 122, y: 523 }, { x: 44, y: 543 }, { x: 138, y: 557 }, { x: 187, y: 551 }, { x: 153, y: 595 }, { x: 183, y: 624 }, { x: 169, y: 658 }, { x: 276, y: 666 }, { x: 265, y: 704 }, { x: 213, y: 711 }, { x: 171, y: 713 }, { x: 126, y: 717 }],
    "icelandic-sea": [{ x: 25, y: 27 }, { x: 64, y: 27 }, { x: 105, y: 31 }, { x: 151, y: 31 }, { x: 26, y: 61 }, { x: 74, y: 62 }, { x: 113, y: 62 }, { x: 180, y: 58 }, { x: 32, y: 93 }, { x: 79, y: 92 }, { x: 134, y: 87 }, { x: 191, y: 87 }, { x: 29, y: 122 }, { x: 73, y: 121 }, { x: 114, y: 118 }, { x: 167, y: 118 }],
  };


  // slotsByArea: Record<BritAreaId, { x: number; y: number }[]> = {
  //   "avalon": [{ x: 360, y: 1038 }],
  //   "downlands": [{ x: 444, y: 1020 }],
  //   "wessex": [{ x: 428, y: 1071 }],
  //   "sussex": [{ x: 553, y: 1065 }],
  //   "kent": [{ x: 627, y: 1037 }],
  //   "essex": [{ x: 565, y: 1003 }],
  //   "lindsey": [{ x: 554, y: 826 }],
  //   "suffolk": [{ x: 601, y: 927 }],
  //   "norfolk": [{ x: 642, y: 864 }],
  //   "south-mercia": [{ x: 490, y: 975 }],
  //   "north-mercia": [{ x: 488, y: 880 }],
  //   "hwicce": [{ x: 398, y: 947 }],
  //   "devon": [{ x: 281, y: 1088 }],
  //   "cornwall": [{ x: 196, y: 1118 }],
  //   "gwent": [{ x: 317, y: 980 }],
  //   "dyfed": [{ x: 247, y: 937 }],
  //   "powys": [{ x: 325, y: 890 }],
  //   "gwynedd": [{ x: 276, y: 813 }],
  //   "clwyd": [{ x: 333, y: 803 }],
  //   "march": [{ x: 403, y: 856 }],
  //   "cheshire": [{ x: 396, y: 783 }],
  //   "york": [{ x: 508, y: 757 }],
  //   "bernicia": [{ x: 477, y: 661 }],
  //   "pennines": [{ x: 425, y: 690 }],
  //   "cumbria": [{ x: 363, y: 658 }],
  //   "lothian": [{ x: 407, y: 544 }],
  //   "galloway": [{ x: 294, y: 582 }],
  //   "dunedin": [{ x: 326, y: 439 }],
  //   "strathclyde": [{ x: 279, y: 522 }],
  //   "dalriada": [{ x: 234, y: 423 }],
  //   "alban": [{ x: 314, y: 368 }],
  //   "mar": [{ x: 389, y: 310 }],
  //   "moray": [{ x: 282, y: 297 }],
  //   "skye": [{ x: 225, y: 312 }],
  //   "caithness": [{ x: 277, y: 199 }],
  //   "orkneys": [{ x: 346, y: 95 }],
  //   "hebrides": [{ x: 114, y: 212 }],
  //   "english-channel": []
  // } as any;

  // printSlots () {
  //   console.log (
  //     BRIT_AREAS.map (areaId => {
  //       const slots = this.slotsByArea[areaId];
  //       return slots ? `"${areaId}": [${slots.map (slot => `{ x: ${slot.x}, y: ${slot.y} }`).join (", ")}]` : null;
  //     })
  //     .filter (x => !!x)
  //     .join (",\n")
  //   );
  // } // printSlots

  // private addSlot (x: number, y: number, areaId: BritAreaId) {
  //   x = Math.round (x);
  //   y = Math.round (y);
  //   this.slotsByArea = {
  //     ...this.slotsByArea,
  //     [areaId]: immutableUtil.listPush ([{ x, y }], this.slotsByArea[areaId])
  //   };
  // } // addSlot

  // private removeSlot (index: number, areaId: BritAreaId) {
  //   this.slotsByArea = {
  //     ...this.slotsByArea,
  //     [areaId]: immutableUtil.listRemoveByIndex (index, this.slotsByArea[areaId])
  //   };
  // } // removeSlot

  // onSlotRectClick (index: number, areaNode: BritAreaNode) {
  //   this.removeSlot (index, areaNode.id);
  // } // onSlotRectClick

  // getSlotByArea: (areaId: BritAreaId, slotsByArea: Record<BritAreaId, { x: number; y: number }[]>) => { x: number; y: number }[] =
  //   (areaId, slotsByArea) => slotsByArea[areaId] || [];
  

} // BritMapComponent
