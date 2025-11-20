import React from "react";
import { VerticalConicalVessel } from "@/lib/vessels/VerticalConicalVessel";
import {
    DimensionArrow,
    LevelMarker,
    Defs,
} from "./utils";
import { pointsToPath, Point, conicalProfilePoints } from "./geometry";

interface Props {
    vessel: VerticalConicalVessel;
}

export const VerticalConicalVesselDiagram: React.FC<Props> = ({
    vessel,
}) => {
    const { diameter, length } = vessel;
    const bottomHeadDistance = vessel.bottomHeadHeight;
    const totalHeight = vessel.totalHeight;
    const topHeadDistance = vessel.topHeadHeight;
    const radius = diameter / 2;
    const shellTop = bottomHeadDistance + length;

    const paddingX = 2.5;
    const paddingY = 1.5;
    const minX = -radius - paddingX;
    const minY = -totalHeight - paddingY;
    const width = diameter + 2 * paddingX;
    const height = totalHeight + 2 * paddingY;

    const toSvgY = (value: number) => -value;
    const clampLevel = (value: number) =>
        Math.max(0, Math.min(value, totalHeight));

    const baseBottomProfile =
        bottomHeadDistance > 0
            ? conicalProfilePoints(radius, bottomHeadDistance)
            : [];
    const baseTopProfile =
        topHeadDistance > 0
            ? conicalProfilePoints(radius, topHeadDistance)
            : [];

    const bottomHeadPoints: Point[] = baseBottomProfile.map((point) => ({
        x: point.x,
        y: point.y + bottomHeadDistance,
    }));
    const topHeadPoints: Point[] = baseTopProfile
        .map((point) => ({
            x: point.x,
            y: totalHeight - topHeadDistance - point.y,
        }))
        .reverse();

    const bottomHeadPath =
        bottomHeadPoints.length > 0
            ? pointsToPath(bottomHeadPoints, toSvgY)
            : `M ${radius} ${toSvgY(0)} L ${-radius} ${toSvgY(0)}`;
    const topHeadPath =
        topHeadPoints.length > 0
            ? pointsToPath(topHeadPoints, toSvgY)
            : `M ${-radius} ${toSvgY(totalHeight)} L ${radius} ${toSvgY(totalHeight)}`;

    const vesselPath = [
        bottomHeadPath,
        `L ${-radius} ${toSvgY(shellTop)}`,
        topHeadPath.replace(/^M/, "L"),
        `L ${radius} ${toSvgY(bottomHeadDistance)}`,
        "Z",
    ].join(" ");

    return (
        <svg
            viewBox={`${minX} ${minY} ${width} ${height}`}
            style={{ width: "100%", height: "100%", maxHeight: "80vh" }}
            preserveAspectRatio="xMidYMid meet"
        >
            <Defs />
            <defs>
                <clipPath id="conicalVesselClip">
                    <path d={vesselPath} />
                </clipPath>
            </defs>

            <rect
                x={-radius}
                y={toSvgY(clampLevel(vessel.liquidLevel))}
                width={diameter}
                height={clampLevel(vessel.liquidLevel)}
                fill="lightblue"
                fillOpacity={0.5}
                clipPath="url(#conicalVesselClip)"
            />

            <rect
                x={-radius}
                y={toSvgY(shellTop)}
                width={diameter}
                height={length}
                fill="none"
                stroke="black"
                strokeWidth={0.05}
            />

            <path d={bottomHeadPath} fill="none" stroke="black" strokeWidth={0.05} />
            <path d={topHeadPath} fill="none" stroke="black" strokeWidth={0.05} />

            <line
                x1={0}
                y1={toSvgY(0) - 0.5}
                x2={0}
                y2={toSvgY(totalHeight) + 0.5}
                stroke="black"
                strokeWidth={0.02}
                strokeDasharray="0.2, 0.1"
            />

            <DimensionArrow
                start={{ x: -radius, y: toSvgY(0) + 0.8 }}
                end={{ x: radius, y: toSvgY(0) + 0.8 }}
                text={`D = ${diameter.toFixed(2)} m`}
                textOffset={{ x: 0, y: 0.2 }}
            />
            <DimensionArrow
                start={{ x: -radius - 1.2, y: toSvgY(bottomHeadDistance) }}
                end={{ x: -radius - 1.2, y: toSvgY(shellTop) }}
                text={`T-T = ${length.toFixed(2)} m`}
                textOffset={{ x: -0.4, y: 0 }}
                isVertical
            />

            <LevelMarker
                y={toSvgY(clampLevel(vessel.highLiquidLevel))}
                label="HLL"
                value={vessel.highLiquidLevel}
                color="green"
                xMin={-radius}
                xMax={radius}
            />
            <LevelMarker
                y={toSvgY(clampLevel(vessel.lowLiquidLevel))}
                label="LLL"
                value={vessel.lowLiquidLevel}
                color="red"
                xMin={-radius}
                xMax={radius}
            />
            <LevelMarker
                y={toSvgY(clampLevel(vessel.liquidLevel))}
                label="LL"
                value={vessel.liquidLevel}
                color="blue"
                xMin={-radius}
                xMax={radius}
            />
        </svg>
    );
};
