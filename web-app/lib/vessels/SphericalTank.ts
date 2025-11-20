import { Vessel } from "./Vessel";

export class SphericalTank extends Vessel {
    public readonly vesselType: string = "Spherical Tank";

    constructor(diameter: number = 3) {
        super();
        this.diameter = diameter;
        this.length = diameter; // ensure base class validations succeed
    }

    get headDistance(): number {
        return this.diameter / 2;
    }

    get bottomHeadHeight(): number {
        return this.diameter / 2;
    }

    get topHeadHeight(): number {
        return this.diameter / 2;
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

    get shellVolume(): number {
        return 0;
    }

    get headSurfaceArea(): number {
        return Math.PI * this.diameter ** 2;
    }

    get shellSurfaceArea(): number {
        return 0;
    }

    get workingVolume(): number {
        return this.liquidVolume(this.liquidLevel);
    }

    get tangentVolume(): number {
        return this.totalVolume;
    }

    headLiquidVolume(value: number): number {
        // Volume of liquid in a sphere of diameter D filled to height h
        // V = (pi * h^2 / 3) * (3*R - h)
        if (value <= 0) return 0;
        if (value >= this.diameter) return this.headVolume;

        const h = value;
        const R = this.diameter / 2;
        return (Math.PI * h ** 2 / 3) * (3 * R - h);
    }

    shellLiquidVolume(value: number): number {
        return 0;
    }

    headWettedArea(value: number): number {
        // Surface area of spherical cap
        // A = 2 * pi * R * h? No, that's for the curved surface area of a spherical cap.
        // Yes, A = 2 * pi * R * h.
        // Wait, let's verify.
        // Area of sphere = 4 * pi * R^2.
        // If h = 2R, A = 2 * pi * R * 2R = 4 * pi * R^2. Correct.
        if (value <= 0) return 0;
        if (value >= this.diameter) return this.headSurfaceArea;

        const R = this.diameter / 2;
        return 2 * Math.PI * R * value;
    }

    shellWettedArea(value: number): number {
        return 0;
    }
}
