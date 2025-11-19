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

    const viewBoxX = -R - 1.5;
    const viewBoxY = -R - 1.0;
    const viewBoxWidth = diameter + 3.0;
    const viewBoxHeight = diameter + 2.0;

    // Sphere path is just a circle
    // Center at (0, R) relative to bottom? 
    // In vertical diagrams, we usually put bottom at y=0.
    // But here let's center it at (0, R) so bottom is at 0.
    // Or center at (0, 0) and bottom is at -R.
    // Let's stick to center at (0, 0) for symmetry, so bottom is -R, top is R.

    const vesselPath = `M 0 ${-R} A ${R} ${R} 0 1 0 0 ${R} A ${R} ${R} 0 1 0 0 ${-R} Z`;

    // Liquid Level
    // Liquid level is measured from bottom.
    // If bottom is -R, then liquid surface is at y = -R + liquidLevel.
    const liquidY = -R + vessel.liquidLevel;

    return (
        <svg
            viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
            className="w-full h-full"
            transform="scale(1, -1)"
            style={{ overflow: "visible" }}
        >
            <Defs />
            <defs>
                <clipPath id="sphereClip">
                    <path d={vesselPath} />
                </clipPath>
            </defs>

            {/* Liquid Fill */}
            <rect
                x={-R}
                y={-R}
                width={diameter}
                height={Math.max(0, vessel.liquidLevel)}
                fill="lightblue"
                fillOpacity={0.5}
                clipPath="url(#sphereClip)"
            />

            {/* Vessel Outline */}
            <path
                d={vesselPath}
                fill="none"
                stroke="black"
                strokeWidth={0.05}
            />

            <g transform="scale(1, -1)">
                {/* Diameter Dimension */}
                <DimensionArrow
                    start={{ x: -R, y: -R - 0.5 }}
                    end={{ x: R, y: -R - 0.5 }}
                    text={`D = ${diameter.toFixed(2)} m`}
                    textOffset={{ x: 0, y: 0.2 }}
                />
            </g>

            <g transform="scale(1, -1)">
                <LevelMarker
                    y={-(vessel.highLiquidLevel - R)}
                    label="HLL"
                    value={vessel.highLiquidLevel}
                    color="green"
                    xMin={-R}
                    xMax={R}
                />
                <LevelMarker
                    y={-(vessel.lowLiquidLevel - R)}
                    label="LLL"
                    value={vessel.lowLiquidLevel}
                    color="red"
                    xMin={-R}
                    xMax={R}
                />
                <LevelMarker
                    y={-(vessel.liquidLevel - R)}
                    label="LL"
                    value={vessel.liquidLevel}
                    color="blue"
                    xMin={-R}
                    xMax={R}
                />
            </g>
        </svg>
    );
};
