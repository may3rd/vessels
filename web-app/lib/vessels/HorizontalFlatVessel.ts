import { Vessel } from "./Vessel";

export class HorizontalFlatVessel extends Vessel {
    public readonly vesselType: string = "Horizontal Flat Vessel";

    constructor(diameter: number = 3, length: number = 9) {
        super();
        this.diameter = diameter;
        this.length = length;
    }

    get headDistance(): number {
        return 0;
    }

    get bottomHeadHeight(): number {
        return 0;
    }

    get topHeadHeight(): number {
        return 0;
    }

    headLiquidVolume(value: number): number {
        return 0;
    }

    headWettedArea(value: number): number {
        // Two flat heads.
        // Area of circular segment on each head.
        if (value <= 0) return 0;
        if (value >= this.diameter) return 2 * (Math.PI * this.diameter ** 2 / 4);

        const r = this.diameter / 2;
        const h = value;

        // Area of circular segment
        // A = r^2 * acos((r-h)/r) - (r-h) * sqrt(2rh - h^2)
        const term1 = r ** 2 * Math.acos((r - h) / r);
        const term2 = (r - h) * Math.sqrt(2 * r * h - h ** 2);
        const area = term1 - term2;

        return 2 * area;
    }

    shellLiquidVolume(value: number): number {
        // Area of circular segment * length
        if (value <= 0) return 0;
        if (value >= this.diameter) return this.shellVolume;

        const r = this.diameter / 2;
        const h = value;

        const term1 = r ** 2 * Math.acos((r - h) / r);
        const term2 = (r - h) * Math.sqrt(2 * r * h - h ** 2);
        const area = term1 - term2;

        return area * this.length;
    }

    shellWettedArea(value: number): number {
        // Arc length * length
        // S = 2r * acos((r-h)/r)
        if (value <= 0) return 0;
        if (value >= this.diameter) return Math.PI * this.diameter * this.length;

        const r = this.diameter / 2;
        const h = value;

        const arcLength = 2 * r * Math.acos((r - h) / r);
        return arcLength * this.length;
    }

    // For horizontal vessels, total height is diameter?
    // The "height" property in Vessel usually refers to the vertical dimension.
    // For horizontal, it's diameter.
    get totalHeight(): number {
        return this.diameter;
    }

    get tangentHeight(): number {
        return this.diameter; // Or 0? It's not really used in the same way.
    }

    get headVolume(): number {
        return 0;
    }

    get shellVolume(): number {
        return (Math.PI * this.diameter ** 2 / 4) * this.length;
    }

    get headSurfaceArea(): number {
        return 2 * (Math.PI * this.diameter ** 2 / 4);
    }

    get shellSurfaceArea(): number {
        return Math.PI * this.diameter * this.length;
    }

    get workingVolume(): number {
        return this.shellLiquidVolume(this.liquidLevel);
    }

    get tangentVolume(): number {
        return this.shellVolume;
    }
}
