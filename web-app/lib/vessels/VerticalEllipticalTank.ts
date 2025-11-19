import { VerticalEllipticalVessel } from "./VerticalEllipticalVessel";

export class VerticalEllipticalTank extends VerticalEllipticalVessel {
    public readonly vesselType: string = "Vertical Elliptical Tank";

    constructor(diameter: number = 3, length: number = 9) {
        super(diameter, length);
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
