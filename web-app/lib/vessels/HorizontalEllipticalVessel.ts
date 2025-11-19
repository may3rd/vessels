import { HorizontalFlatVessel } from "./HorizontalFlatVessel";
import { calculateHorizontalHeadArea } from "./horizontal_integration";

export class HorizontalEllipticalVessel extends HorizontalFlatVessel {
    public readonly vesselType: string = "Horizontal Elliptical Vessel";

    constructor(diameter: number = 3, length: number = 9) {
        super(diameter, length);
    }

    get headDistance(): number {
        return this.diameter / 4;
    }

    get bottomHeadHeight(): number {
        return this.headDistance;
    }

    get topHeadHeight(): number {
        return this.headDistance;
    }

    headLiquidVolume(value: number): number {
        // Volume of liquid in two elliptical heads = Scaled volume of sphere.
        // V_ell = V_sphere * (L / R)
        // Since there are two heads, total length of heads is 2*L.
        // Total volume = V_sphere(h) * (L / R)
        if (value <= 0) return 0;

        const R = this.diameter / 2;
        const L = this.headDistance;

        // Sphere volume for depth h
        const h = Math.min(value, this.diameter);
        const vSphere = (Math.PI * h ** 2 / 3) * (3 * R - h);

        return vSphere * (L / R);
    }

    headWettedArea(value: number): number {
        // Numerical integration for surface area
        // Two heads
        const R = this.diameter / 2;
        const L = this.headDistance;

        const areaOneHead = calculateHorizontalHeadArea(
            (x) => {
                // x is distance from tangent (0 to L)
                // r(x) = R * sqrt(1 - (x/L)^2)
                // Clamp x to avoid NaN at L
                const xClamped = Math.min(x, L - 1e-6);
                return R * Math.sqrt(1 - (xClamped / L) ** 2);
            },
            (x) => {
                // dr/dx = - (R * x) / (L^2 * sqrt(1 - (x/L)^2))
                const xClamped = Math.min(x, L - 1e-6);
                const sqrtTerm = Math.sqrt(1 - (xClamped / L) ** 2);
                return - (R * xClamped) / (L ** 2 * sqrtTerm);
            },
            L,
            this.diameter,
            value
        );

        return 2 * areaOneHead;
    }

    get totalHeight(): number {
        return this.diameter;
    }

    get tangentHeight(): number {
        return this.diameter;
    }

    get headVolume(): number {
        // Full volume
        return this.headLiquidVolume(this.diameter);
    }

    get headSurfaceArea(): number {
        // Full area
        return this.headWettedArea(this.diameter);
    }
}
