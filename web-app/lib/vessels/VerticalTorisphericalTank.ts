import { VerticalTorisphericalVessel } from "./VerticalTorisphericalVessel";

export class VerticalTorisphericalTank extends VerticalTorisphericalVessel {
    public readonly vesselType: string = "Vertical ToriSpherical Tank";

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
