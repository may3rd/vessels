import React from "react";
import { SphericalTank } from "@/lib/vessels/SphericalTank";
import {
    DimensionArrow,
    LevelMarker,
    Defs,
} from "./utils";

interface Props {
    vessel: SphericalTank;
}

export const SphericalTankDiagram: React.FC<Props> = ({ vessel }) => {
    const { diameter } = vessel;
    const R = diameter / 2;

    const totalHeight = vessel.totalHeight;
    const paddingX = 1.5;
    const paddingY = 1.2;

    const minX = -R - paddingX;
    const minY = -totalHeight - paddingY;
    const viewBoxWidth = diameter + 2 * paddingX;
    const viewBoxHeight = totalHeight + 2 * paddingY;

    const toSvgY = (value: number) => -value;
    const clampLevel = (value: number) =>
        Math.max(0, Math.min(value, totalHeight));

    const circleCenterY = totalHeight / 2;

    return (
        <svg
            viewBox={`${minX} ${minY} ${viewBoxWidth} ${viewBoxHeight}`}
            style={{ width: "100%", height: "100%", maxHeight: "80vh" }}
            preserveAspectRatio="xMidYMid meet"
        >
            <Defs />
            <circle
                cx={0}
                cy={toSvgY(circleCenterY)}
                r={R}
                fill="none"
                stroke="black"
                strokeWidth={0.05}
            />

            <text
                x={0}
                y={toSvgY(totalHeight) - 0.5}
                fontSize={0.4}
                textAnchor="middle"
                fill="#1f2937"
                style={{ fontFamily: "sans-serif" }}
            >
                Spherical Tanks
            </text>

            <DimensionArrow
                start={{ x: -R, y: toSvgY(-0.5) }}
                end={{ x: R, y: toSvgY(-0.5) }}
                text={`D = ${diameter.toFixed(2)} m`}
                textOffset={{ x: 0, y: 0.2 }}
            />

            <LevelMarker
                y={toSvgY(clampLevel(vessel.highLiquidLevel))}
                label="HLL"
                value={vessel.highLiquidLevel}
                color="green"
                xMin={-R}
                xMax={R}
            />
            <LevelMarker
                y={toSvgY(clampLevel(vessel.lowLiquidLevel))}
                label="LLL"
                value={vessel.lowLiquidLevel}
                color="red"
                xMin={-R}
                xMax={R}
            />
            <LevelMarker
                y={toSvgY(clampLevel(vessel.liquidLevel))}
                label="LL"
                value={vessel.liquidLevel}
                color="blue"
                xMin={-R}
                xMax={R}
            />
        </svg>
    );
};
