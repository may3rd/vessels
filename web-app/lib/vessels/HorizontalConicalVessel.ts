import { HorizontalFlatVessel } from "./HorizontalFlatVessel";
import { calculateHorizontalHeadVolume, calculateHorizontalHeadArea } from "./horizontal_integration";

export class HorizontalConicalVessel extends HorizontalFlatVessel {
    public readonly vesselType: string = "Horizontal Conical Vessel";

    constructor(
        diameter: number = 3,
        length: number = 9,
        headDistance: number = 0.0
    ) {
        super(diameter, length);
        this.headDistance = headDistance;
    }

    get headDistance(): number {
        return this._headDistance;
    }

    set headDistance(value: number) {
        if (value < 0) throw new Error("Head distance must be non-negative");
        this._headDistance = value;
    }

    get bottomHeadHeight(): number {
        return this.headDistance;
    }

    get topHeadHeight(): number {
        return this.headDistance;
    }

    private getRadiusAt(z: number): number {
        // z is distance from tip (0) to tangent (headDistance)
        // r(z) = (D/2) * (z / headDistance)
        if (this.headDistance <= 0) return 0;
        return (this.diameter / 2) * (z / this.headDistance);
    }

    private getDerivativeAt(z: number): number {
        // dr/dz = (D/2) / headDistance
        if (this.headDistance <= 0) return 0;
        return (this.diameter / 2) / this.headDistance;
    }

    headLiquidVolume(value: number): number {
        // 2 heads
        return 2 * calculateHorizontalHeadVolume(
            (z) => this.getRadiusAt(z),
            this.headDistance,
            this.diameter,
            value
        );
    }

    headWettedArea(value: number): number {
        // 2 heads
        return 2 * calculateHorizontalHeadArea(
            (z) => this.getRadiusAt(z),
            (z) => this.getDerivativeAt(z),
            this.headDistance,
            this.diameter,
            value
        );
    }

    get totalHeight(): number {
        return this.diameter;
    }

    get tangentHeight(): number {
        return this.diameter;
    }

    get headVolume(): number {
        return this.headLiquidVolume(this.diameter);
    }

    get headSurfaceArea(): number {
        return this.headWettedArea(this.diameter);
    }
}
