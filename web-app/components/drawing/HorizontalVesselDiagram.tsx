import React from "react";
import { HorizontalFlatVessel } from "@/lib/vessels/HorizontalFlatVessel";
import { HorizontalTorisphericalVessel } from "@/lib/vessels/HorizontalTorisphericalVessel";
import { HorizontalEllipticalVessel } from "@/lib/vessels/HorizontalEllipticalVessel";
import { HorizontalHemisphericalVessel } from "@/lib/vessels/HorizontalHemisphericalVessel";
import { HorizontalConicalVessel } from "@/lib/vessels/HorizontalConicalVessel";
import {
    DimensionArrow,
    LevelMarker,
    Defs,
} from "./utils";
import {
    ellipseProfilePoints,
    torisphericalProfilePoints,
    conicalProfilePoints,
    Point,
} from "./geometry";

interface Props {
    vessel:
    | HorizontalFlatVessel
    | HorizontalTorisphericalVessel
    | HorizontalEllipticalVessel
    | HorizontalHemisphericalVessel
    | HorizontalConicalVessel;
}

export const HorizontalVesselDiagram: React.FC<Props> = ({ vessel }) => {
    const { diameter, length } = vessel;
    const radius = diameter / 2;
    const tangentLeft = -length / 2;
    const tangentRight = length / 2;
    const headDepth = Math.max(0, vessel.headDistance ?? 0);

    const leftTip = tangentLeft - headDepth;
    const rightTip = tangentRight + headDepth;

    const paddingX = 2.8;
    const paddingY = 1.2;

    const minX = leftTip - paddingX;
    const minY = -radius - paddingY;
    const viewWidth = rightTip - leftTip + 2 * paddingX;
    const viewHeight = 2 * radius + 2 * paddingY;

    const toSvgY = (value: number) => -value;
    const clampLevel = (value: number) =>
        Math.max(0, Math.min(value, diameter));
    const levelLineY = (value: number) =>
        toSvgY(-radius + clampLevel(value));

    const baseProfile = getBaseHeadProfile(vessel, radius, headDepth);
    const leftHeadOutline = mapHeadProfile(
        baseProfile,
        true,
        tangentLeft,
        tangentRight,
        radius
    );
    const rightHeadOutline = mapHeadProfile(
        baseProfile,
        false,
        tangentLeft,
        tangentRight,
        radius
    );

    const vesselPath = buildOutlinePath(
        leftHeadOutline,
        rightHeadOutline,
        tangentLeft,
        tangentRight,
        radius,
        toSvgY
    );

    return (
        <svg
            viewBox={`${minX} ${minY} ${viewWidth} ${viewHeight}`}
            style={{ width: "100%", height: "100%", maxHeight: "80vh" }}
            preserveAspectRatio="xMidYMid meet"
        >
            <Defs />
            <defs>
                <clipPath id="hVesselClip">
                    <path d={vesselPath} />
                </clipPath>
            </defs>

            <rect
                x={leftTip}
                y={levelLineY(vessel.liquidLevel)}
                width={rightTip - leftTip}
                height={clampLevel(vessel.liquidLevel)}
                fill="lightblue"
                fillOpacity={0.5}
                clipPath="url(#hVesselClip)"
            />

            <path
                d={vesselPath}
                fill="none"
                stroke="black"
                strokeWidth={0.05}
            />

            <line
                x1={tangentLeft}
                y1={toSvgY(radius + 0.5)}
                x2={tangentLeft}
                y2={toSvgY(-radius - 0.5)}
                stroke="black"
                strokeWidth={0.02}
                strokeDasharray="0.2, 0.1"
            />
            <line
                x1={tangentRight}
                y1={toSvgY(radius + 0.5)}
                x2={tangentRight}
                y2={toSvgY(-radius - 0.5)}
                stroke="black"
                strokeWidth={0.02}
                strokeDasharray="0.2, 0.1"
            />

            <DimensionArrow
                start={{ x: (tangentLeft + tangentRight) / 2, y: toSvgY(-radius + 0.2) }}
                end={{ x: (tangentLeft + tangentRight) / 2, y: toSvgY(radius - 0.2) }}
                text={`D = ${diameter.toFixed(2)} m`}
                textOffset={{ x: 0, y: 0 }}
                isVertical
            />

            <DimensionArrow
                start={{ x: tangentLeft, y: toSvgY(-radius - 0.8) }}
                end={{ x: tangentRight, y: toSvgY(-radius - 0.8) }}
                text={`T-T = ${length.toFixed(2)} m`}
                textOffset={{ x: 0, y: 0.2 }}
            />

            <LevelMarker
                y={levelLineY(vessel.highLiquidLevel)}
                label="HLL"
                value={vessel.highLiquidLevel}
                color="green"
                xMin={leftTip}
                xMax={rightTip}
            />
            <LevelMarker
                y={levelLineY(vessel.lowLiquidLevel)}
                label="LLL"
                value={vessel.lowLiquidLevel}
                color="red"
                xMin={leftTip}
                xMax={rightTip}
            />
            <LevelMarker
                y={levelLineY(vessel.liquidLevel)}
                label="LL"
                value={vessel.liquidLevel}
                color="blue"
                xMin={leftTip}
                xMax={rightTip}
            />
        </svg>
    );
};

function getBaseHeadProfile(
    vessel: Props["vessel"],
    radius: number,
    headDepth: number
): Point[] {
    if (headDepth <= 0) return [];

    if (vessel instanceof HorizontalTorisphericalVessel) {
        const profile = torisphericalProfilePoints({
            diameter: vessel.diameter,
            headDistance: headDepth,
            fd: vessel.fd,
            fk: vessel.fk,
        });
        return profile.x.map((xVal, idx) => ({
            x: xVal,
            y: profile.y[idx],
        }));
    }

    if (
        vessel instanceof HorizontalEllipticalVessel ||
        vessel instanceof HorizontalHemisphericalVessel
    ) {
        return ellipseProfilePoints(radius, headDepth);
    }

    if (vessel instanceof HorizontalConicalVessel) {
        return conicalProfilePoints(radius, headDepth);
    }

    return [];
}

function mapHeadProfile(
    profile: Point[],
    isLeft: boolean,
    tangentLeft: number,
    tangentRight: number,
    radius: number
): Point[] {
    if (!profile.length) {
        return isLeft
            ? [
                { x: tangentLeft, y: radius },
                { x: tangentLeft, y: -radius },
            ]
            : [
                { x: tangentRight, y: -radius },
                { x: tangentRight, y: radius },
            ];
    }

    const mapped = profile.map((point) => ({
        x: isLeft ? tangentLeft + point.y : tangentRight - point.y,
        y: point.x,
    }));

    return isLeft ? mapped : mapped.reverse();
}

function buildOutlinePath(
    leftHead: Point[],
    rightHead: Point[],
    tangentLeft: number,
    tangentRight: number,
    radius: number,
    toSvgY: (value: number) => number
): string {
    const points: string[] = [];

    const start = leftHead[0] ?? { x: tangentLeft, y: radius };
    points.push(`M ${start.x} ${toSvgY(start.y)}`);

    leftHead.slice(1).forEach((point) => {
        points.push(`L ${point.x} ${toSvgY(point.y)}`);
    });

    points.push(`L ${tangentRight} ${toSvgY(-radius)}`);

    rightHead.forEach((point, idx) => {
        if (idx === 0) return;
        points.push(`L ${point.x} ${toSvgY(point.y)}`);
    });

    points.push(`L ${tangentLeft} ${toSvgY(radius)}`);
    points.push("Z");

    return points.join(" ");
}
