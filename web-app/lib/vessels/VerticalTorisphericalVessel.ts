import { VerticalFlatVessel } from "./VerticalFlatVessel";
import { safeIntegrate } from "../math/integration";

const FD_TORI = 1.0;
const FK_TORI = 0.06;

export class VerticalTorisphericalVessel extends VerticalFlatVessel {
    public readonly vesselType: string = "Vertical ToriSpherical Vessels";

    private _fd: number;
    private _fk: number;

    constructor(
        diameter: number = 3,
        length: number = 9,
        fd: number = FD_TORI,
        fk: number = FK_TORI
    ) {
        super(diameter, length);
        this._fd = fd;
        this._fk = fk;
    }

    get fd(): number {
        return this._fd;
    }

    set fd(value: number) {
        this._fd = value;
    }

    get fk(): number {
        return this._fk;
    }

    set fk(value: number) {
        this._fk = value;
    }

    get a1(): number {
        return (
            this.fd *
            (1 -
                Math.sqrt(
                    1 -
                    ((0.5 - this.fk) * (0.5 - this.fk)) /
                    ((this.fd - this.fk) * (this.fd - this.fk))
                ))
        );
    }

    get a2(): number {
        return (
            this.fd -
            Math.sqrt(this.fd ** 2 - 2 * this.fd * this.fk + this.fk - 0.25)
        );
    }

    get a3(): number {
        return this.length / this.diameter + this.a2;
    }

    get a4(): number {
        return this.a3 + (this.a2 - this.a1);
    }

    get a5(): number {
        return this.a3 + this.a2;
    }

    get b1(): number {
        return (this.fd * (0.5 - this.fk)) / (this.fd - this.fk);
    }

    get b2(): number {
        return 0.5;
    }

    get headDistance(): number {
        return this.a2 * this.diameter;
    }

    get bottomHeadHeight(): number {
        return this.headDistance;
    }

    get topHeadHeight(): number {
        return this.headDistance;
    }

    headLiquidVolume(value: number): number {
        return (
            this.bottomHeadLiquidVolume(value) + this.topHeadLiquidVolume(value)
        );
    }

    bottomHeadLiquidVolume(value: number): number {
        if (value <= 0) return 0.0;
        else if (value <= this.bottomHeadHeight) {
            return this.verticalBottomFdHeadVolume(value);
        } else {
            return this.verticalBottomFdHeadVolume(this.bottomHeadHeight);
        }
    }

    topHeadLiquidVolume(value: number): number {
        if (value < this.tangentHeight) return 0.0;
        return this.verticalTopFdHeadVolume(Math.min(value, this.totalHeight));
    }

    headWettedArea(value: number): number {
        return (
            this.bottomHeadWettedArea(value) + this.topHeadWettedArea(value)
        );
    }

    bottomHeadWettedArea(value: number): number {
        return this.verticalBottomFdHeadWettedArea(value);
    }

    topHeadWettedArea(value: number): number {
        return this.verticalTopFdHeadWettedArea(value);
    }

    // --- Helper Methods ---

    private verticalBottomFdHeadVolume(value: number): number {
        if (value < 0) return 0.0;
        return (
            this.diameter *
            safeIntegrate(
                (x) => this.verticalFdHeadSurfaceArea(x),
                0,
                Math.min(value / this.diameter, this.a2)
            )
        );
    }

    private verticalTopFdHeadVolume(value: number): number {
        if (value <= this.bottomHeadHeight + this.length) {
            return 0.0;
        } else {
            const val = this.totalHeight - value;
            const a = val / this.diameter;
            const headVolume = safeIntegrate(
                (x) => this.verticalFdHeadSurfaceArea(x),
                0,
                this.a2
            );
            const subVolume = safeIntegrate(
                (x) => this.verticalFdHeadSurfaceArea(x),
                0,
                a
            );
            return (headVolume - subVolume) * this.diameter;
        }
    }

    private verticalFdHeadSurfaceArea(x: number): number {
        if (x <= this.a1) {
            return (
                Math.PI *
                this.diameter ** 2 *
                (this.fd ** 2 - (x - this.fd) ** 2)
            );
        } else {
            return (
                Math.PI *
                this.diameter ** 2 *
                (0.5 -
                    this.fk +
                    Math.sqrt(this.fk ** 2 - (x - this.a2) ** 2)) **
                2
            );
        }
    }

    private verticalBottomFdHeadWettedArea(value: number): number {
        let wettedArea = 0.0;
        if (value <= 0.0) return 0.0;
        else {
            const a = Math.min(value / this.diameter, this.a2);
            wettedArea += this.verticalSurfaceArea1(a);
            wettedArea += this.verticalSurfaceArea2(a);
            return wettedArea;
        }
    }

    private verticalTopFdHeadWettedArea(value: number): number {
        if (value <= this.bottomHeadHeight + this.length) return 0.0;
        else {
            const val =
                this.totalHeight - Math.min(value, this.totalHeight);
            const sa1 = this.verticalBottomFdHeadWettedArea(this.topHeadHeight);
            const sa2 = this.verticalBottomFdHeadWettedArea(val);
            return sa1 - sa2;
        }
    }

    private verticalSurfaceArea1(a: number): number {
        const val = Math.min(a, this.a1);
        return val < 0
            ? 0.0
            : 2 * Math.PI * this.diameter ** 2 * this.fd * val;
    }

    private verticalSurfaceArea2(a: number): number {
        if (a < this.a1) return 0.0;
        else {
            const val = Math.min(a, this.a2);
            return (
                2 *
                Math.PI *
                this.diameter ** 2 *
                this.fk *
                (val -
                    this.a1 +
                    (0.5 - this.fk) *
                    (Math.asin((val - this.a2) / this.fk) -
                        Math.asin((this.a1 - this.a2) / this.fk)))
            );
        }
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
        // Volume of two heads
        return this.bottomHeadLiquidVolume(this.totalHeight) + this.topHeadLiquidVolume(this.totalHeight);
        // Wait, bottomHeadLiquidVolume(totalHeight) gives full bottom head volume.
        // topHeadLiquidVolume(totalHeight) gives full top head volume.
        // Correct.
    }

    get shellVolume(): number {
        // Shell volume is cylinder volume
        return (Math.PI * this.diameter ** 2 / 4) * this.length;
    }

    get headSurfaceArea(): number {
        return this.verticalBottomFdHeadWettedArea(this.totalHeight) + this.verticalTopFdHeadWettedArea(this.totalHeight);
    }

    get shellSurfaceArea(): number {
        return Math.PI * this.diameter * this.length;
    }

    // Working volume, etc. inherited from Vessel/VerticalFlatVessel?
    // VerticalFlatVessel implements workingVolume, tangentVolume.
    // tangentVolume is shellVolume.
    // workingVolume is effectiveVolume * 0.9 (usually).
    // Let's check VerticalFlatVessel implementation.
}
