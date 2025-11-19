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

interface Props {
    vessel:
    | HorizontalFlatVessel
    | HorizontalTorisphericalVessel
    | HorizontalEllipticalVessel
    | HorizontalHemisphericalVessel
    | HorizontalConicalVessel;
}

export const HorizontalVesselDiagram: React.FC<Props> = ({ vessel }) => {
    const { diameter, length, headDistance } = vessel;

    // For horizontal vessels, headDistance is the length of the head.
    // We draw the vessel horizontally.
    // Center of vessel at (0, 0).
    // Shell from x = -length/2 to x = length/2.
    // Left head from x = -length/2 - headDistance to -length/2.
    // Right head from x = length/2 to length/2 + headDistance.

    const R = diameter / 2;
    const L = length;
    const H = headDistance;

    const viewBoxX = -L / 2 - H - 1.0;
    const viewBoxY = -R - 1.5;
    const viewBoxWidth = L + 2 * H + 2.0;
    const viewBoxHeight = diameter + 3.0;

    // Generate paths based on vessel type
    let leftHeadPath = "";
    let rightHeadPath = "";

    if (vessel instanceof HorizontalFlatVessel) {
        leftHeadPath = `M ${-L / 2} ${-R} L ${-L / 2} ${R}`;
        rightHeadPath = `M ${L / 2} ${-R} L ${L / 2} ${R}`;
    } else if (vessel instanceof HorizontalConicalVessel) {
        leftHeadPath = `M ${-L / 2} ${-R} L ${-L / 2 - H} 0 L ${-L / 2} ${R}`;
        rightHeadPath = `M ${L / 2} ${-R} L ${L / 2 + H} 0 L ${L / 2} ${R}`;
    } else if (vessel instanceof HorizontalHemisphericalVessel || vessel instanceof HorizontalEllipticalVessel) {
        // Elliptical/Hemispherical arc
        // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
        leftHeadPath = `M ${-L / 2} ${R} A ${H} ${R} 0 0 0 ${-L / 2} ${-R}`;
        rightHeadPath = `M ${L / 2} ${-R} A ${H} ${R} 0 0 0 ${L / 2} ${R}`;
    } else if (vessel instanceof HorizontalTorisphericalVessel) {
        // Approximate torispherical as elliptical for drawing simplicity, 
        // or we could generate points like in vertical.
        // Given the complexity and visual similarity at small scales, elliptical arc is a reasonable approximation for the diagram.
        // Or we can use a slightly flattened ellipse.
        leftHeadPath = `M ${-L / 2} ${R} A ${H} ${R} 0 0 0 ${-L / 2} ${-R}`;
        rightHeadPath = `M ${L / 2} ${-R} A ${H} ${R} 0 0 0 ${L / 2} ${R}`;
    }

    const vesselPath = `
    ${leftHeadPath}
    L ${L / 2} ${-R}
    ${rightHeadPath.replace("M", "L")}
    L ${-L / 2} ${R}
    Z
  `;

    // Liquid Level
    // In side view, liquid level is a horizontal line at y = liquidLevel - R.
    // We clip the vessel path with a rectangle from bottom to liquid level.
    const liquidY = vessel.liquidLevel - R;

    // Clip rect for liquid
    // x: -infinity to infinity (or large enough)
    // y: -R to liquidY

    return (
        <svg
            viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
            className="w-full h-full"
            transform="scale(1, -1)"
            style={{ overflow: "visible" }}
        >
            <Defs />
            <defs>
                <clipPath id="hVesselClip">
                    <path d={vesselPath} />
                </clipPath>
            </defs>

            {/* Liquid Fill */}
            <rect
                x={-L / 2 - H - 1}
                y={-R}
                width={L + 2 * H + 2}
                height={Math.max(0, vessel.liquidLevel)}
                fill="lightblue"
                fillOpacity={0.5}
                clipPath="url(#hVesselClip)"
            />

            {/* Vessel Outline */}
            <path
                d={vesselPath}
                fill="none"
                stroke="black"
                strokeWidth={0.05}
            />

            {/* Tangent Lines */}
            <line
                x1={-L / 2}
                y1={-R - 0.5}
                x2={-L / 2}
                y2={R + 0.5}
                stroke="black"
                strokeWidth={0.02}
                strokeDasharray="0.2, 0.1"
            />
            <line
                x1={L / 2}
                y1={-R - 0.5}
                x2={L / 2}
                y2={R + 0.5}
                stroke="black"
                strokeWidth={0.02}
                strokeDasharray="0.2, 0.1"
            />

            <g transform="scale(1, -1)">
                {/* Diameter Dimension */}
                <DimensionArrow
                    start={{ x: L / 2 + H + 0.5, y: -R }}
                    end={{ x: L / 2 + H + 0.5, y: R }}
                    text={`D = ${diameter.toFixed(2)} m`}
                    textOffset={{ x: 0.2, y: 0 }}
                    isVertical
                />

                {/* Length Dimension */}
                <DimensionArrow
                    start={{ x: -L / 2, y: -R - 0.8 }}
                    end={{ x: L / 2, y: -R - 0.8 }}
                    text={`T-T = ${length.toFixed(2)} m`}
                    textOffset={{ x: 0, y: 0.2 }}
                />
            </g>

            <g transform="scale(1, -1)">
                <LevelMarker
                    y={-(vessel.highLiquidLevel - R)}
                    label="HLL"
                    value={vessel.highLiquidLevel}
                    color="green"
                    xMin={-L / 2 - H}
                    xMax={L / 2 + H}
                />
                <LevelMarker
                    y={-(vessel.lowLiquidLevel - R)}
                    label="LLL"
                    value={vessel.lowLiquidLevel}
                    color="red"
                    xMin={-L / 2 - H}
                    xMax={L / 2 + H}
                />
                <LevelMarker
                    y={-(vessel.liquidLevel - R)}
                    label="LL"
                    value={vessel.liquidLevel}
                    color="blue"
                    xMin={-L / 2 - H}
                    xMax={L / 2 + H}
                />
            </g>
        </svg>
    );
};
