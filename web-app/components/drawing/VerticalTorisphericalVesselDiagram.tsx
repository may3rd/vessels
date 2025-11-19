import React from "react";
import { VerticalTorisphericalVessel } from "@/lib/vessels/VerticalTorisphericalVessel";
import {
    DimensionArrow,
    LevelMarker,
    Defs,
} from "./utils";
import { torisphericalProfilePoints, pointsToPath } from "./geometry";

interface Props {
    vessel: VerticalTorisphericalVessel;
}

export const VerticalTorisphericalVesselDiagram: React.FC<Props> = ({
    vessel,
}) => {
    const { diameter, length } = vessel;
    const bottomHeadDistance = vessel.bottomHeadHeight;
    const totalHeight = vessel.totalHeight;
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

    const { x: headX, y: headY } = torisphericalProfilePoints(vessel);

    const bottomHeadPoints = headX.map((x, idx) => ({
        x,
        y: headY[idx] + bottomHeadDistance,
    }));
    const topHeadPoints = bottomHeadPoints
        .map((point) => ({
            x: point.x,
            y: totalHeight - point.y,
        }))
        .reverse();

    const bottomHeadPath = pointsToPath(bottomHeadPoints, toSvgY);
    const topHeadPath = pointsToPath(topHeadPoints, toSvgY);

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
                <clipPath id="vesselClip">
                    <path d={vesselPath} />
                </clipPath>
            </defs>

            <rect
                x={-diameter / 2}
                y={toSvgY(clampLevel(vessel.liquidLevel))}
                width={diameter}
                height={clampLevel(vessel.liquidLevel)}
                fill="lightblue"
                fillOpacity={0.5}
                clipPath="url(#vesselClip)"
            />

            <rect
                x={-diameter / 2}
                y={toSvgY(shellTop)}
                width={diameter}
                height={length}
                fill="none"
                stroke="black"
                strokeWidth={0.05}
            />

            <path
                d={bottomHeadPath}
                fill="none"
                stroke="black"
                strokeWidth={0.05}
            />
            <path
                d={topHeadPath}
                fill="none"
                stroke="black"
                strokeWidth={0.05}
            />

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
                start={{ x: radius + 1.2, y: toSvgY(bottomHeadDistance) }}
                end={{ x: radius + 1.2, y: toSvgY(shellTop) }}
                text={`T-T = ${length.toFixed(2)} m`}
                textOffset={{ x: 0.4, y: 0 }}
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
