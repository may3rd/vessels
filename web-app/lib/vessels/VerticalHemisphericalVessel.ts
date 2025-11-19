import { VerticalEllipticalVessel } from "./VerticalEllipticalVessel";

export class VerticalHemisphericalVessel extends VerticalEllipticalVessel {
    public readonly vesselType: string = "Vertical HemiSpherical Vessels";

    constructor(diameter: number = 3, length: number = 9) {
        super(diameter, length);
    }

    get headDistance(): number {
        return this.diameter / 2;
    }

    bottomHeadWettedArea(value: number): number {
        return value < 0
            ? 0.0
            : Math.PI * this.diameter * Math.min(value, this.headDistance);
    }

    topHeadWettedArea(value: number): number {
        return value < this.tangentHeight
            ? 0.0
            : Math.PI *
            this.diameter *
            (this.headDistance -
                (this.totalHeight - Math.min(value, this.totalHeight)));
    }
}
