import React from "react";
import { VerticalFlatVessel } from "@/lib/vessels/VerticalFlatVessel";
import { Defs, DimensionArrow, LevelMarker, LEVEL_COLORS } from "./utils";

interface Props {
    vessel: VerticalFlatVessel;
}

export const VerticalFlatVesselDiagram: React.FC<Props> = ({ vessel }) => {
    const { diameter, length, highLiquidLevel, lowLiquidLevel, liquidLevel } = vessel;
    const radius = diameter / 2;

    // Coordinate mapping:
    // Cartesian Y is up (0 at bottom, length at top).
    // SVG Y is down.
    // We map Cartesian Y to SVG Y: y_svg = -y_cartesian
    // So bottom is at 0, top is at -length.

    // ViewBox calculation
    const paddingX = 2.5;
    const paddingY = 1.5;

    // Geometry bounds in SVG coords
    const geoMinX = -radius;
    const geoMaxX = radius;
    const geoMinY = -length; // Top
    const geoMaxY = 0;       // Bottom

    const minX = geoMinX - paddingX;
    const maxX = geoMaxX + paddingX;
    const minY = geoMinY - paddingY;
    const maxY = geoMaxY + paddingY;

    const width = maxX - minX;
    const height = maxY - minY;

    // Helper to flip Y for geometry
    const toSvgY = (y: number) => -y;

    return (
        <svg
            viewBox={`${minX} ${minY} ${width} ${height}`}
            style={{ width: "100%", height: "100%", maxHeight: "80vh" }}
            preserveAspectRatio="xMidYMid meet"
        >
            <Defs />

            {/* Liquid Fill */}
            <rect
                x={-radius}
                y={toSvgY(liquidLevel)}
                width={diameter}
                height={liquidLevel}
                fill="rgba(56, 189, 248, 0.3)" // Light blue transparent
                stroke="none"
            />

            {/* Shell */}
            <rect
                x={-radius}
                y={toSvgY(length)}
                width={diameter}
                height={length}
                fill="none"
                stroke="black"
                strokeWidth="0.05"
            />

            {/* Bottom Head (Flat) */}
            <line
                x1={-radius}
                y1={toSvgY(0)}
                x2={radius}
                y2={toSvgY(0)}
                stroke="black"
                strokeWidth="0.05"
            />

            {/* Top Head (Flat) */}
            <line
                x1={-radius}
                y1={toSvgY(length)}
                x2={radius}
                y2={toSvgY(length)}
                stroke="black"
                strokeWidth="0.05"
            />

            {/* Dimensions */}
            {/* Diameter */}
            <DimensionArrow
                start={{ x: -radius, y: toSvgY(0) + 0.8 }} // Below bottom
                end={{ x: radius, y: toSvgY(0) + 0.8 }}
                text={`D = ${diameter.toFixed(2)} m`}
                textOffset={{ x: 0, y: 0.2 }}
            />

            {/* Length (Tangent-to-Tangent) */}
            <DimensionArrow
                start={{ x: -radius - 1.2, y: toSvgY(0) }}
                end={{ x: -radius - 1.2, y: toSvgY(length) }}
                text={`T-T = ${length.toFixed(2)} m`}
                textOffset={{ x: -0.4, y: 0 }}
                isVertical
            />

            {/* Liquid Levels */}
            <LevelMarker
                y={toSvgY(highLiquidLevel)}
                xMin={-radius}
                xMax={radius}
                label="HLL"
                value={highLiquidLevel}
                color={LEVEL_COLORS.HLL}
            />
            <LevelMarker
                y={toSvgY(lowLiquidLevel)}
                xMin={-radius}
                xMax={radius}
                label="LLL"
                value={lowLiquidLevel}
                color={LEVEL_COLORS.LLL}
            />
            <LevelMarker
                y={toSvgY(liquidLevel)}
                xMin={-radius}
                xMax={radius}
                label="LL"
                value={liquidLevel}
                color={LEVEL_COLORS.LL}
            />
        </svg>
    );
};
