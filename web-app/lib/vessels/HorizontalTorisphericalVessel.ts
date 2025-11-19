import { HorizontalFlatVessel } from "./HorizontalFlatVessel";
import { calculateHorizontalHeadVolume, calculateHorizontalHeadArea } from "./horizontal_integration";

const FD_TORI = 1.0;
const FK_TORI = 0.06;

export class HorizontalTorisphericalVessel extends HorizontalFlatVessel {
    public readonly vesselType: string = "Horizontal ToriSpherical Vessel";

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

    get fd(): number { return this._fd; }
    set fd(value: number) { this._fd = value; }
    get fk(): number { return this._fk; }
    set fk(value: number) { this._fk = value; }

    // Geometric constants (same as Vertical)
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

    get headDistance(): number {
        return this.a2 * this.diameter;
    }

    get bottomHeadHeight(): number {
        return this.headDistance;
    }

    get topHeadHeight(): number {
        return this.headDistance;
    }

    // Radius function r(z) where z is distance from tangent line (0 to headDistance)
    // For torispherical head, the profile is composed of two circular arcs.
    // But usually it's defined as r(h) in vertical.
    // Here z is the axial coordinate. r is the radial coordinate.
    // The profile is:
    // Knuckle part: z from 0 to ...
    // Dish part: z from ... to headDistance.

    // Let's reverse the vertical logic.
    // In vertical: x is axial distance (normalized by D).
    // verticalFdHeadSurfaceArea gives area at x.
    // We need r(z).
    // z = x * D.
    // r(z) is the radius of the cross section at z.
    // In verticalFdHeadSurfaceArea, the formula for area is pi * (radius)^2?
    // Let's check VerticalTorisphericalVessel.ts again.
    // verticalFdHeadSurfaceArea returns:
    // if x <= a1: pi * D^2 * (fd^2 - (x - fd)^2)
    // This implies r(x)^2 = D^2 * (fd^2 - (x - fd)^2)
    // So r(x) = D * sqrt(fd^2 - (x - fd)^2)
    // This looks like circle equation: y^2 + (x-fd)^2 = fd^2.
    // This is the dish part (large radius).

    // if x > a1: pi * D^2 * (0.5 - fk + sqrt(fk^2 - (x - a2)^2))^2
    // This implies r(x) = D * (0.5 - fk + sqrt(fk^2 - (x - a2)^2))
    // This is the knuckle part.

    // Wait, a1 is the transition point.
    // In vertical, x goes from 0 (tangent?) to a2 (top of head).
    // Actually, in vertical, x=0 is the "bottom" of the head?
    // Let's check `verticalBottomFdHeadVolume`.
    // It integrates from 0 to value/D.
    // If value is small (near bottom of vessel), x is small.
    // So x=0 is the tip of the head?
    // Or x=0 is the tangent?
    // If x=0 is the tip, then as x increases, we go towards the cylinder.
    // But `verticalFdHeadSurfaceArea` formulas:
    // (x - fd)^2 ... centered at fd.
    // If x=0, r = D * sqrt(fd^2 - fd^2) = 0.
    // So x=0 is the tip of the head (center of dish).
    // And x=a2 is the tangent line?
    // Let's check a2.
    // a2 is head height / D.
    // So x goes from 0 (tip) to a2 (tangent).

    // So z (distance from tangent) = headDistance - (x * D).
    // Or we can just integrate x from 0 to a2, and use the same r(x).
    // The volume integral doesn't care about direction if we integrate full head.
    // But for partial liquid level, we need the cross section at specific z?
    // No, for horizontal vessel, the liquid level `h` determines the fill of the cross-section.
    // The cross-section is a circle of radius `r(z)`.
    // `calculateHorizontalHeadVolume` integrates along z (axis).
    // It calls `radiusFn(z)`.
    // We can define `z` starting from the tip (0) to tangent (headDistance).
    // Then `radiusFn(z)` is exactly `r(x)` where `x = z / D`.

    private getRadiusAt(z: number): number {
        // z is distance from tip (0) to tangent (headDistance)
        const x = z / this.diameter;

        if (x <= this.a1) {
            // Dish part (near tip)
            // r(x) = D * sqrt(fd^2 - (x - fd)^2)
            // Check for negative inside sqrt
            const val = this.fd ** 2 - (x - this.fd) ** 2;
            return val < 0 ? 0 : this.diameter * Math.sqrt(val);
        } else {
            // Knuckle part (near tangent)
            // r(x) = D * (0.5 - fk + sqrt(fk^2 - (x - a2)^2))
            const val = this.fk ** 2 - (x - this.a2) ** 2;
            return val < 0 ? 0 : this.diameter * (0.5 - this.fk + Math.sqrt(val));
        }
    }

    private getDerivativeAt(z: number): number {
        // dr/dz = (dr/dx) * (dx/dz) = (dr/dx) * (1/D)
        const x = z / this.diameter;

        if (x <= this.a1) {
            // r = D * (fd^2 - (x-fd)^2)^0.5
            // dr/dx = D * 0.5 * (fd^2 - (x-fd)^2)^-0.5 * (-2*(x-fd))
            //       = -D * (x-fd) / sqrt(...)
            //       = -D * (x-fd) / (r/D) = -D^2 * (x-fd) / r
            const r = this.getRadiusAt(z);
            if (r === 0) return 0; // singularity at tip
            return -(this.diameter ** 2) * (x - this.fd) / r / this.diameter;
        } else {
            // r = D * (C + sqrt(fk^2 - (x-a2)^2))
            // dr/dx = D * 0.5 * ... * (-2*(x-a2))
            //       = -D * (x-a2) / sqrt(...)
            const val = this.fk ** 2 - (x - this.a2) ** 2;
            const sqrtTerm = val <= 0 ? 1e-9 : Math.sqrt(val);
            return -(this.diameter) * (x - this.a2) / sqrtTerm / this.diameter;
        }
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
