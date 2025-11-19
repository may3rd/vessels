import { Vessel } from "./Vessel";

export class VerticalFlatVessel extends Vessel {
    readonly vesselType: string = "Vertical Flat Vessels";

    constructor(inputDiameter: number = 3, inputLength: number = 9) {
        super();
        this.diameter = inputDiameter;
        this.length = inputLength;
    }

    get headDistance(): number {
        return 0.0;
    }

    get bottomHeadHeight(): number {
        return 0;
    }

    get topHeadHeight(): number {
        return 0;
    }

    // In TS, we can't easily override a setter with a getter-only property if the base has a setter.
    // However, for this port, we'll just ignore the setter or let the base handle it but it won't affect the getter if we override it.
    // Actually, in the Python code, head_distance is a property.
    // In the base TS class, I made it a getter/setter.
    // If I override the getter to return 0, the setter in the base class will still set _headDistance, but the getter will always return 0.
    // That's fine for now.

    get bottomHeadDistance(): number {
        return this.headDistance;
    }

    get topHeadDistance(): number {
        return this.headDistance;
    }

    get totalHeight(): number {
        return this.length + this.bottomHeadDistance + this.topHeadDistance;
    }

    get tangentHeight(): number {
        return this.length + this.bottomHeadDistance;
    }

    get headVolume(): number {
        return (
            this.bottomHeadLiquidVolume(this.totalHeight) +
            this.topHeadLiquidVolume(this.totalHeight)
        );
    }

    get shellVolume(): number {
        return (Math.PI * this.diameter ** 2 / 4) * this.length;
    }

    get effectiveVolume(): number {
        return this.liquidVolume(this.highLiquidLevel + this.bottomHeadDistance);
    }

    get tangentVolume(): number {
        return this.liquidVolume(this.tangentHeight);
    }

    get workingVolume(): number {
        return (
            (Math.PI * this.diameter ** 2 / 4) *
            (this.highLiquidLevel - this.lowLiquidLevel)
        );
    }

    get headSurfaceArea(): number {
        return (
            this.bottomHeadWettedArea(this.totalHeight) +
            this.topHeadWettedArea(this.totalHeight)
        );
    }

    get shellSurfaceArea(): number {
        return Math.PI * this.diameter * this.length;
    }

    bottomHeadLiquidVolume(value: number): number {
        return 0.0;
    }

    topHeadLiquidVolume(value: number): number {
        return 0.0;
    }

    headLiquidVolume(value: number): number {
        return (
            this.bottomHeadLiquidVolume(value) + this.topHeadLiquidVolume(value)
        );
    }

    shellLiquidVolume(value: number): number {
        if (value <= this.bottomHeadDistance) {
            return 0.0;
        } else if (value <= this.bottomHeadDistance + this.length) {
            return (
                (Math.PI * this.diameter ** 2 / 4) *
                (value - this.bottomHeadDistance)
            );
        } else {
            return (Math.PI * this.diameter ** 2 / 4) * this.length;
        }
    }

    bottomHeadWettedArea(value: number): number {
        return value <= 0 ? 0.0 : Math.PI * this.diameter ** 2 / 4;
    }

    topHeadWettedArea(value: number): number {
        return value < this.totalHeight ? 0.0 : Math.PI * this.diameter ** 2 / 4;
    }

    shellWettedArea(value: number): number {
        if (value <= this.bottomHeadDistance) {
            return 0.0;
        } else if (value < this.bottomHeadDistance + this.length) {
            return Math.PI * this.diameter * (value - this.bottomHeadDistance);
        } else {
            return Math.PI * this.diameter * this.length;
        }
    }

    headWettedArea(value: number): number {
        return this.bottomHeadWettedArea(value) + this.topHeadWettedArea(value);
    }
}
