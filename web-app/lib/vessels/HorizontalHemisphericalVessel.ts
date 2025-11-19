import { HorizontalFlatVessel } from "./HorizontalFlatVessel";

export class HorizontalHemisphericalVessel extends HorizontalFlatVessel {
    public readonly vesselType: string = "Horizontal HemiSpherical Vessel";

    constructor(diameter: number = 3, length: number = 9) {
        super(diameter, length);
    }

    get headDistance(): number {
        return this.diameter / 2;
    }

    get bottomHeadHeight(): number {
        return this.headDistance;
    }

    get topHeadHeight(): number {
        return this.headDistance;
    }

    headLiquidVolume(value: number): number {
        // Volume of liquid in two hemispherical heads = Volume of liquid in a sphere.
        // V = (pi * h^2 / 3) * (3R - h)
        if (value <= 0) return 0;
        if (value >= this.diameter) return (4 / 3) * Math.PI * (this.diameter / 2) ** 3;

        const h = value;
        const R = this.diameter / 2;
        return (Math.PI * h ** 2 / 3) * (3 * R - h);
    }

    headWettedArea(value: number): number {
        // Surface area of liquid in two hemispherical heads = Surface area of liquid in a sphere.
        // A = pi * D * h
        if (value <= 0) return 0;
        if (value >= this.diameter) return Math.PI * this.diameter ** 2;

        return Math.PI * this.diameter * value;
    }

    get totalHeight(): number {
        return this.diameter;
    }

    get tangentHeight(): number {
        return this.diameter;
    }

    get headVolume(): number {
        return (4 / 3) * Math.PI * (this.diameter / 2) ** 3;
    }

    get headSurfaceArea(): number {
        return Math.PI * this.diameter ** 2;
    }
}
