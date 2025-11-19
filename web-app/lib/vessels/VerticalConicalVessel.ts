import { VerticalFlatVessel } from "./VerticalFlatVessel";

export class VerticalConicalVessel extends VerticalFlatVessel {
    public readonly vesselType: string = "Vertical Conical Vessels";

    constructor(
        diameter: number = 3,
        length: number = 9,
        headDistance: number = 0.0
    ) {
        super(diameter, length);
        this._headDistance = headDistance;
    }

    // Override headDistance setter/getter to use the local property
    // In base class it's protected _headDistance, but getter returns 0 for FlatVessel.
    // We need to override the getter.
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

    bottomHeadLiquidVolume(value: number): number {
        return value <= 0
            ? 0.0
            : this.headLiquidVolumeFn(Math.min(value, this.bottomHeadHeight), this.bottomHeadHeight);
    }

    topHeadLiquidVolume(value: number): number {
        return value < this.tangentHeight
            ? 0.0
            : (1 / 12) * Math.PI * this.diameter ** 2 * this.topHeadHeight -
            this.headLiquidVolumeFn(
                this.totalHeight - Math.min(value, this.totalHeight),
                this.topHeadHeight
            );
    }

    bottomHeadWettedArea(value: number): number {
        return value < 0
            ? 0.0
            : this.verticalConeSurfaceArea(Math.min(value, this.bottomHeadHeight));
    }

    topHeadWettedArea(value: number): number {
        return value < this.tangentHeight
            ? 0.0
            : this.verticalConeSurfaceArea(this.topHeadHeight) -
            this.verticalConeSurfaceArea(
                this.totalHeight - Math.min(value, this.totalHeight)
            );
    }

    private headLiquidVolumeFn(value: number, headHeight: number): number {
        if (value <= 0.0 || headHeight <= 0.0) return 0.0;
        return (
            (1 / 3) *
            Math.PI *
            value *
            ((value * this.diameter) / 2 / headHeight) ** 2
        );
    }

    // Override totalHeight to include heads
    get totalHeight(): number {
        return this.length + this.bottomHeadHeight + this.topHeadHeight;
    }

    get tangentHeight(): number {
        return this.bottomHeadHeight + this.length;
    }

    // Override headVolume and shellVolume
    get headVolume(): number {
        return this.bottomHeadLiquidVolume(this.totalHeight) + this.topHeadLiquidVolume(this.totalHeight);
    }

    get shellVolume(): number {
        return (Math.PI * this.diameter ** 2 / 4) * this.length;
    }

    get headSurfaceArea(): number {
        return this.bottomHeadWettedArea(this.totalHeight) + this.topHeadWettedArea(this.totalHeight);
    }

    get shellSurfaceArea(): number {
        return Math.PI * this.diameter * this.length;
    }
}
