export abstract class Vessel {
    abstract readonly vesselType: string;

    protected _diameter: number = 0.0;
    protected _length: number = 0.0;
    protected _headDistance: number = 0.0;
    protected _highLiquidLevel: number = 0.0;
    protected _lowLiquidLevel: number = 0.0;
    protected _liquidLevel: number = 0.0;
    protected _overflowFlag: boolean = false;

    constructor() { }

    get diameter(): number {
        return this._diameter;
    }

    set diameter(value: number) {
        if (value <= 0) {
            throw new Error("Diameter must be positive");
        }
        this._diameter = value;
    }

    get length(): number {
        return this._length;
    }

    set length(value: number) {
        if (value <= 0) {
            throw new Error("Length must be positive");
        }
        this._length = value;
    }

    get headDistance(): number {
        return this._headDistance;
    }

    set headDistance(value: number) {
        if (value < 0) {
            throw new Error("Head distance must be non-negative");
        }
        this._headDistance = value;
    }

    get highLiquidLevel(): number {
        return this._highLiquidLevel;
    }

    set highLiquidLevel(value: number) {
        if (value < 0) {
            throw new Error("High liquid level must be non-negative");
        }
        this._highLiquidLevel = value;
    }

    get lowLiquidLevel(): number {
        return this._lowLiquidLevel;
    }

    set lowLiquidLevel(value: number) {
        if (value < 0) {
            throw new Error("Low liquid level must be non-negative");
        }
        this._lowLiquidLevel = value;
    }

    get liquidLevel(): number {
        return this._liquidLevel;
    }

    set liquidLevel(value: number) {
        if (value < 0) {
            throw new Error("Liquid level must be non-negative");
        }
        this._liquidLevel = value;
    }

    get overflowFlag(): boolean {
        return this._overflowFlag;
    }

    set overflowFlag(value: boolean) {
        this._overflowFlag = value;
    }

    get overflowVolume(): number {
        return this._overflowFlag ? this.totalVolume * 0.02 : 0.0;
    }

    abstract get totalHeight(): number;
    abstract get tangentHeight(): number;
    abstract get headVolume(): number;
    abstract get shellVolume(): number;

    get totalVolume(): number {
        return this.shellVolume + this.headVolume;
    }

    get effectiveVolume(): number {
        return this.liquidVolume(this.highLiquidLevel);
    }

    get efficiencyVolume(): number {
        return this.totalVolume > 0
            ? (this.effectiveVolume / this.totalVolume) * 100.0
            : 0.0;
    }

    abstract get workingVolume(): number;
    abstract get tangentVolume(): number;
    abstract get headSurfaceArea(): number;
    abstract get shellSurfaceArea(): number;

    get totalSurfaceArea(): number {
        return this.shellSurfaceArea + this.headSurfaceArea;
    }

    abstract headLiquidVolume(value: number): number;
    abstract shellLiquidVolume(value: number): number;

    liquidVolume(value: number): number {
        return this.shellLiquidVolume(value) + this.headLiquidVolume(value);
    }

    abstract headWettedArea(value: number): number;
    abstract shellWettedArea(value: number): number;

    wettedArea(value: number): number {
        return this.shellWettedArea(value) + this.headWettedArea(value);
    }

    protected verticalConeSurfaceArea(value: number): number {
        if (value <= 0.0 || this.headDistance <= 0.0) {
            return 0.0;
        } else {
            const v = Math.min(value, this._headDistance);
            if (this.headDistance === 0) {
                return 0.0;
            }
            const r = (v / this.headDistance) * this.diameter / 2;
            return Math.PI * r * Math.sqrt(v ** 2 + r ** 2);
        }
    }
}
