import { VerticalTorisphericalVessel } from "@/lib/vessels/VerticalTorisphericalVessel";

export interface Point {
    x: number;
    y: number;
}

export function toRad(deg: number): number {
    return (deg * Math.PI) / 180;
}

export function toDeg(rad: number): number {
    return (rad * 180) / Math.PI;
}

export function arcPoints(
    cx: number,
    cy: number,
    radius: number,
    startDeg: number,
    endDeg: number,
    steps: number = 30
): Point[] {
    if (radius <= 0) return [];
    if (steps < 2) steps = 2;

    let delta = endDeg - startDeg;
    if (Math.abs(delta) > 180) {
        if (delta > 0) startDeg += 360;
        else endDeg += 360;
    }

    const points: Point[] = [];
    for (let i = 0; i < steps; i++) {
        const angle = toRad(startDeg + (endDeg - startDeg) * (i / (steps - 1)));
        points.push({
            x: cx + radius * Math.cos(angle),
            y: cy + radius * Math.sin(angle),
        });
    }
    return points;
}

export function circleIntersection(
    center1: Point,
    radius1: number,
    center2: Point,
    radius2: number,
    epsilon: number = 1e-9
): Point | null {
    const x1 = center1.x;
    const y1 = center1.y;
    const x2 = center2.x;
    const y2 = center2.y;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);

    if (
        dist < epsilon ||
        dist > radius1 + radius2 + epsilon ||
        dist < Math.abs(radius1 - radius2) - epsilon
    ) {
        return null;
    }

    const a = (radius1 ** 2 - radius2 ** 2 + dist ** 2) / (2 * dist);
    let hSq = radius1 ** 2 - a ** 2;
    if (hSq < 0) hSq = 0;
    const h = Math.sqrt(hSq);

    const x3 = x1 + (a * dx) / dist;
    const y3 = y1 + (a * dy) / dist;

    const rx = -dy * (h / dist);
    const ry = dx * (h / dist);

    const p1 = { x: x3 + rx, y: y3 + ry };
    const p2 = { x: x3 - rx, y: y3 - ry };

    // Sort by x descending (as in Python)
    return p1.x > p2.x ? p1 : p2;
}

export function torisphericalProfilePoints(
    vessel: VerticalTorisphericalVessel,
    stepsKnuckle: number = 30,
    stepsDish: number = 60
): { x: number[]; y: number[] } {
    const d = vessel.diameter;
    const headDepth = vessel.headDistance;
    const dishRadius = vessel.fd * d;
    const knuckleRadius = vessel.fk * d;

    if (Math.min(d, headDepth, dishRadius, knuckleRadius) <= 0) {
        return { x: [], y: [] };
    }

    const dishCenterY = dishRadius - headDepth;
    const knuckleCenterOffset = d / 2 - knuckleRadius;

    const intersection = circleIntersection(
        { x: 0.0, y: dishCenterY },
        dishRadius,
        { x: knuckleCenterOffset, y: 0.0 },
        knuckleRadius
    );

    if (!intersection) return { x: [], y: [] };

    const xi = intersection.x;
    const yi = intersection.y;

    const rightKnuckleEnd = toDeg(Math.atan2(yi, xi - knuckleCenterOffset));
    const rightDishStart = toDeg(Math.atan2(yi - dishCenterY, xi));
    const rightDishEnd = toDeg(Math.atan2(yi - dishCenterY, -xi));
    const leftKnuckleStart = toDeg(Math.atan2(yi, -xi + knuckleCenterOffset));

    const rk = arcPoints(
        knuckleCenterOffset,
        0.0,
        knuckleRadius,
        0.0,
        rightKnuckleEnd,
        stepsKnuckle
    );
    const dish = arcPoints(
        0.0,
        dishCenterY,
        dishRadius,
        rightDishStart,
        rightDishEnd,
        stepsDish
    );
    const lk = arcPoints(
        -knuckleCenterOffset,
        0.0,
        knuckleRadius,
        leftKnuckleStart,
        180.0,
        stepsKnuckle
    );

    if (rk.length === 0 || dish.length === 0 || lk.length === 0) {
        return { x: [], y: [] };
    }

    // Combine points (skipping duplicates at joins if needed, Python code skips 1st point of subsequent arcs)
    const pointsX = [
        ...rk.map((p) => p.x),
        ...dish.slice(1).map((p) => p.x),
        ...lk.slice(1).map((p) => p.x),
    ];
    const pointsY = [
        ...rk.map((p) => p.y),
        ...dish.slice(1).map((p) => p.y),
        ...lk.slice(1).map((p) => p.y),
    ];

    return { x: pointsX, y: pointsY };
}
