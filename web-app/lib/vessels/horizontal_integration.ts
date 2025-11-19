import { safeIntegrate } from "../math/integration";

/**
 * Calculates the liquid volume in a horizontal head using numerical integration.
 * @param radiusFn Function returning the radius of the head cross-section at axial position x (0 to length).
 * @param length Length of the head (depth).
 * @param diameter Diameter of the vessel (to determine liquid depth relative to center).
 * @param liquidLevel Liquid level from the bottom of the vessel.
 */
export function calculateHorizontalHeadVolume(
    radiusFn: (x: number) => number,
    length: number,
    diameter: number,
    liquidLevel: number
): number {
    if (liquidLevel <= 0) return 0;
    if (liquidLevel >= diameter) {
        // Full volume - integrate pi * r(x)^2
        return safeIntegrate(
            (x) => Math.PI * radiusFn(x) ** 2,
            0,
            length
        );
    }

    const R = diameter / 2;

    return safeIntegrate(
        (x) => {
            const r = radiusFn(x);
            if (r <= 0) return 0;

            // Calculate local liquid height in this cross-section
            // The cross-section is a circle of radius r centered at (0, 0) in local coords?
            // No, the head is centered on the vessel axis.
            // So the circle is centered at y=R (if y=0 is bottom of vessel).
            // Wait, if vessel axis is at y=R.
            // Liquid level is h.
            // Distance from axis to liquid surface is d = |R - h|.
            // If h < R, surface is below axis. d = R - h.
            // If h > R, surface is above axis. d = h - R.

            // In the cross section of radius r:
            // The circle is centered at the vessel axis.
            // So the distance from the center of the circle to the liquid surface is also d = |R - h|.
            // But we need to check if the liquid intersects this circle.
            // If d >= r, then:
            //   If h < R (below axis) and d >= r, then liquid is below the circle -> Area = 0.
            //   If h > R (above axis) and d >= r, then liquid covers the circle -> Area = pi * r^2.

            const dist = Math.abs(R - liquidLevel);

            if (dist >= r) {
                if (liquidLevel > R) return Math.PI * r ** 2; // Full
                return 0; // Empty
            }

            // Intersection
            // Local liquid depth inside the circle of radius r:
            // If h < R: depth = r - dist
            // If h > R: depth = r + dist

            let localDepth = 0;
            if (liquidLevel < R) {
                localDepth = r - dist;
            } else {
                localDepth = r + dist;
            }

            // Area of circular segment
            // A = r^2 * acos((r - depth)/r) - (r - depth) * sqrt(2*r*depth - depth^2)
            const term1 = r ** 2 * Math.acos((r - localDepth) / r);
            const term2 = (r - localDepth) * Math.sqrt(2 * r * localDepth - localDepth ** 2);
            return term1 - term2;
        },
        0,
        length
    );
}

/**
 * Calculates the wetted surface area in a horizontal head using numerical integration.
 * @param radiusFn Function returning the radius of the head cross-section at axial position x.
 * @param derivativeFn Function returning the derivative of the radius (dr/dx) at x.
 * @param length Length of the head.
 * @param diameter Diameter of the vessel.
 * @param liquidLevel Liquid level from the bottom of the vessel.
 */
export function calculateHorizontalHeadArea(
    radiusFn: (x: number) => number,
    derivativeFn: (x: number) => number,
    length: number,
    diameter: number,
    liquidLevel: number
): number {
    if (liquidLevel <= 0) return 0;

    // If full, we integrate full circumference * arc factor
    const isFull = liquidLevel >= diameter;

    const R = diameter / 2;

    return safeIntegrate(
        (x) => {
            const r = radiusFn(x);
            const dr = derivativeFn(x);
            const arcFactor = Math.sqrt(1 + dr ** 2);

            if (r <= 0) return 0;

            if (isFull) {
                return 2 * Math.PI * r * arcFactor;
            }

            const dist = Math.abs(R - liquidLevel);

            if (dist >= r) {
                if (liquidLevel > R) return 2 * Math.PI * r * arcFactor; // Full wetted
                return 0; // Empty
            }

            // Partial wetted perimeter
            // Arc length S = 2 * r * acos((r - localDepth)/r) ?
            // No, acos gives the angle. Arc length = r * angle.
            // Angle theta is the angle subtended by the wetted arc at the center.
            // If h < R (less than half full):
            //   localDepth = r - dist.
            //   cos(alpha) = dist / r.
            //   Wetted angle = 2 * alpha? No.
            //   Wetted angle is the angle at the bottom.
            //   cos(theta/2) = (r - localDepth) / r? No.
            //   Let's use the standard formula:
            //   S = 2 * r * acos(d / r) where d is distance from center to surface.
            //   If surface is below center, wetted arc is the smaller one.
            //   If surface is above center, wetted arc is the larger one.

            // dist = |R - h| is the distance from center.
            // alpha = acos(dist / r).
            // If h < R (below center): Wetted arc = 2 * r * (pi - alpha)? No.
            //   Below center means we wet the bottom.
            //   The angle subtended by the dry part is...
            //   Actually, let's use the formula: S = r * theta.
            //   theta = 2 * acos((r - localDepth)/r)? No.

            // Let's stick to:
            // cos(alpha) = dist / r.
            // alpha is angle from vertical radius to the intersection point.
            // If h < R: Wetted angle is 2 * (pi - alpha)? No, 2 * alpha?
            //   At h=0, dist=r, alpha=0. Wetted=0. Correct.
            //   At h=R, dist=0, alpha=pi/2. Wetted=pi*r. Correct.
            //   Wait, acos(0) = pi/2.
            //   acos(1) = 0.
            //   So if h < R, wetted angle = 2 * acos(dist/r).

            // If h > R: Wetted angle = 2 * pi - (2 * acos(dist/r)).
            //   At h=R, dist=0, alpha=pi/2. Wetted = 2pi - pi = pi. Correct.
            //   At h=2R, dist=r, alpha=0. Wetted = 2pi - 0 = 2pi. Correct.

            const alpha = Math.acos(dist / r);
            let wettedArc = 0;

            if (liquidLevel < R) {
                wettedArc = 2 * r * alpha; // Wait, checking my logic.
                // If h=0, dist=r, alpha=0. Wetted=0.
                // If h=R, dist=0, alpha=pi/2. Wetted=pi*r.
                // Seems correct for "bottom" arc?
                // Let's verify.
                // Circle center (0,0). Liquid at y = -dist.
                // Intersection x^2 + dist^2 = r^2 => x = sqrt(r^2 - dist^2).
                // Angle from -y axis?
                // acos(dist/r) is angle from y axis?
                // cos(theta) = adj/hyp.
                // Triangle: center, intersection, projection on y axis.
                // adj = dist. hyp = r.
                // So angle from vertical axis to intersection is acos(dist/r).
                // So the sector angle is 2 * acos(dist/r).
                // Yes, this is the arc length at the bottom (if h < R).
            } else {
                wettedArc = 2 * Math.PI * r - 2 * r * alpha;
            }

            return wettedArc * arcFactor;
        },
        0,
        length
    );
}
