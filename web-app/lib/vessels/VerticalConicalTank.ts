import { VerticalConicalVessel } from "./VerticalConicalVessel";

export class VerticalConicalTank extends VerticalConicalVessel {
    public readonly vesselType: string = "Vertical Conical Tank";

    constructor(diameter: number = 3, length: number = 9, headDistance: number = 0) {
        super(diameter, length, headDistance);
    }

    get bottomHeadHeight(): number {
        return 0;
    }

    bottomHeadLiquidVolume(value: number): number {
        return 0;
    }

    bottomHeadWettedArea(value: number): number {
        return value > 0 ? (Math.PI * this.diameter ** 2) / 4 : 0;
    }
}
