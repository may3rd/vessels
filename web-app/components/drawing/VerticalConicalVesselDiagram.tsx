import React from "react";
import { VerticalConicalVessel } from "@/lib/vessels/VerticalConicalVessel";
import {
    DimensionArrow,
    LevelMarker,
    Defs,
} from "./utils";

interface Props {
    vessel: VerticalConicalVessel;
}

export const VerticalConicalVesselDiagram: React.FC<Props> = ({
    vessel,
}) => {
    const { diameter, length } = vessel;
    const bottomHeadDistance = vessel.bottomHeadHeight;
    const topHeadDistance = vessel.topHeadHeight;

    const viewBoxX = -diameter / 2 - 2.0;
    const viewBoxY = -bottomHeadDistance - 1.0;
    const viewBoxWidth = diameter + 4.5;
    const viewBoxHeight = length + bottomHeadDistance + topHeadDistance + 2.5;

    const bottomHeadPath = `M ${-diameter / 2} 0 L 0 ${-bottomHeadDistance} L ${diameter / 2} 0`;
    const topHeadPath = `M ${diameter / 2} ${length} L 0 ${length + topHeadDistance} L ${-diameter / 2} ${length}`;

    const vesselPath = `
    ${bottomHeadPath}
    L ${diameter / 2} ${length}
    ${topHeadPath.replace("M", "L")}
    L ${-diameter / 2} 0
    Z
  `;

    const liquidY = Math.min(
        Math.max(vessel.liquidLevel, 0),
        vessel.totalHeight
    );
    const liquidHeight = liquidY;

    return (
        <svg
            viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
            className="w-full h-full"
            transform="scale(1, -1)"
            style={{ overflow: "visible" }}
        >
            <Defs />
            <defs>
                <clipPath id="conicalVesselClip">
                    <path d={vesselPath} />
                </clipPath>
            </defs>

            <rect
                x={-diameter / 2}
                y={-bottomHeadDistance}
                width={diameter}
                height={liquidHeight}
                fill="lightblue"
                fillOpacity={0.5}
                clipPath="url(#conicalVesselClip)"
            />

            <rect
                x={-diameter / 2}
                y={0}
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
                y1={-bottomHeadDistance - 0.5}
                x2={0}
                y2={length + topHeadDistance + 0.5}
                stroke="black"
                strokeWidth={0.02}
                strokeDasharray="0.2, 0.1"
            />

            <g transform="scale(1, -1)">
                <DimensionArrow
                    start={{ x: -diameter / 2, y: bottomHeadDistance + 0.8 }}
                    end={{ x: diameter / 2, y: bottomHeadDistance + 0.8 }}
                    text={`D = ${diameter.toFixed(2)} m`}
                    textOffset={{ x: 0, y: 0.2 }}
                />
                <DimensionArrow
                    start={{ x: diameter / 2 + 1.2, y: 0 }}
                    end={{ x: diameter / 2 + 1.2, y: -length }}
                    text={`T-T = ${length.toFixed(2)} m`}
                    textOffset={{ x: 0.4, y: 0 }}
                />
            </g>

            <g transform="scale(1, -1)">
                <LevelMarker
                    y={-(vessel.highLiquidLevel - bottomHeadDistance)}
                    label="HLL"
                    value={vessel.highLiquidLevel}
                    color="green"
                    xMin={-diameter / 2}
                    xMax={diameter / 2}
                />
                <LevelMarker
                    y={-(vessel.lowLiquidLevel - bottomHeadDistance)}
                    label="LLL"
                    value={vessel.lowLiquidLevel}
                    color="red"
                    xMin={-diameter / 2}
                    xMax={diameter / 2}
                />
                <LevelMarker
                    y={-(vessel.liquidLevel - bottomHeadDistance)}
                    label="LL"
                    value={vessel.liquidLevel}
                    color="blue"
                    xMin={-diameter / 2}
                    xMax={diameter / 2}
                />
            </g>
        </svg>
    );
};
