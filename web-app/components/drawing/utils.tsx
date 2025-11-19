import React from "react";

export const DIMENSION_COLOR = "#004f9f";
export const LEVEL_COLORS = {
    HLL: "#2ca02c",
    LLL: "#d62728",
    LL: "#1f77b4",
};

// Helper to calculate text width roughly (SVG doesn't support auto-width background easily without JS)
// We'll use a fixed padding approach or a rough estimate.
// For a robust solution, we'd need to measure text, but for this simple app, we can estimate.
export const CHAR_WIDTH_ESTIMATE = 0.6; // relative to font size

export const DimensionArrow = ({
    start,
    end,
    text,
    textOffset = { x: 0, y: 0 },
    isVertical = false,
}: {
    start: { x: number; y: number };
    end: { x: number; y: number };
    text: string;
    textOffset?: { x: number; y: number };
    isVertical?: boolean;
}) => {
    const midX = (start.x + end.x) / 2 + textOffset.x;
    const midY = (start.y + end.y) / 2 + textOffset.y;
    const fontSize = 0.25; // Meters (user units)

    // Rotate text if vertical dimension?
    // Usually dimensions are horizontal or aligned with the line.
    // For this simple version, we keep text horizontal but positioned.

    return (
        <g>
            <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={DIMENSION_COLOR}
                strokeWidth="0.02"
                markerStart="url(#arrow)"
                markerEnd="url(#arrow)"
            />
            <g transform={`translate(${midX}, ${midY})`}>
                {/* Background for text */}
                <rect
                    x={-(text.length * fontSize * CHAR_WIDTH_ESTIMATE) / 2 - 0.1}
                    y={-fontSize / 2 - 0.05}
                    width={text.length * fontSize * CHAR_WIDTH_ESTIMATE + 0.2}
                    height={fontSize + 0.1}
                    fill="rgba(255,255,255,0.9)"
                    rx="0.05"
                />
                <text
                    x="0"
                    y="0"
                    fill={DIMENSION_COLOR}
                    fontSize={fontSize}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontFamily: "sans-serif" }}
                >
                    {text}
                </text>
            </g>
        </g>
    );
};

export const LevelMarker = ({
    y,
    xMin,
    xMax,
    label,
    value,
    color,
}: {
    y: number;
    xMin: number;
    xMax: number;
    label: string;
    value: number;
    color: string;
}) => {
    const fontSize = 0.25;
    const text = `${label} = ${value.toFixed(2)} m`;
    const textX = xMax + 0.2;

    return (
        <g>
            <line
                x1={xMin}
                y1={y}
                x2={xMax}
                y2={y}
                stroke={color}
                strokeWidth="0.02"
                strokeDasharray="0.1, 0.1"
            />
            <g transform={`translate(${textX}, ${y})`}>
                <rect
                    x="-0.1"
                    y={-fontSize / 2 - 0.05}
                    width={text.length * fontSize * CHAR_WIDTH_ESTIMATE + 0.2}
                    height={fontSize + 0.1}
                    fill="white"
                    stroke={color}
                    strokeWidth="0.01"
                    rx="0.05"
                />
                <text
                    x="0" // Padding inside rect
                    y="0"
                    dx="0.1" // slight offset from left edge of rect
                    fill={color}
                    fontSize={fontSize}
                    textAnchor="start"
                    dominantBaseline="middle"
                    style={{ fontFamily: "sans-serif" }}
                >
                    {text}
                </text>
            </g>
        </g>
    );
};

export const Defs = () => (
    <defs>
        <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
        >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={DIMENSION_COLOR} />
        </marker>
    </defs>
);
