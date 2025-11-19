"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    VESSEL_OPTIONS,
    VesselOption,
} from "@/lib/vessels/types";
import { VerticalFlatVessel } from "@/lib/vessels/VerticalFlatVessel";
import { VerticalTorisphericalVessel } from "@/lib/vessels/VerticalTorisphericalVessel";
import { VerticalEllipticalVessel } from "@/lib/vessels/VerticalEllipticalVessel";
import { VerticalHemisphericalVessel } from "@/lib/vessels/VerticalHemisphericalVessel";
import { VerticalConicalVessel } from "@/lib/vessels/VerticalConicalVessel";
import { VerticalFlatTank } from "@/lib/vessels/VerticalFlatTank";
import { VerticalTorisphericalTank } from "@/lib/vessels/VerticalTorisphericalTank";
import { VerticalEllipticalTank } from "@/lib/vessels/VerticalEllipticalTank";
import { VerticalHemisphericalTank } from "@/lib/vessels/VerticalHemisphericalTank";
import { VerticalConicalTank } from "@/lib/vessels/VerticalConicalTank";
import { HorizontalFlatVessel } from "@/lib/vessels/HorizontalFlatVessel";
import { HorizontalTorisphericalVessel } from "@/lib/vessels/HorizontalTorisphericalVessel";
import { HorizontalEllipticalVessel } from "@/lib/vessels/HorizontalEllipticalVessel";
import { HorizontalHemisphericalVessel } from "@/lib/vessels/HorizontalHemisphericalVessel";
import { HorizontalConicalVessel } from "@/lib/vessels/HorizontalConicalVessel";
import { SphericalTank } from "@/lib/vessels/SphericalTank";
import { VesselDiagram } from "@/components/drawing";
import { Settings, Info, Calculator, AlertCircle, AlertTriangle } from "lucide-react";

export default function Home() {
    const [selectedOptionKey, setSelectedOptionKey] = useState<string>(
        "vertical-flat-vessel"
    );
    const [diameter, setDiameter] = useState<number>(3.0);
    const [length, setLength] = useState<number>(9.0);
    const [headDistance, setHeadDistance] = useState<number>(0.0);
    const [highLevel, setHighLevel] = useState<number>(7.0);
    const [lowLevel, setLowLevel] = useState<number>(1.0);
    const [liquidLevel, setLiquidLevel] = useState<number>(5.0);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [warnings, setWarnings] = useState<Record<string, string>>({});

    const selectedOption = VESSEL_OPTIONS.find(
        (opt) => opt.key === selectedOptionKey
    );

    // Validation Effect
    useEffect(() => {
        const newErrors: Record<string, string> = {};
        const newWarnings: Record<string, string> = {};

        // Basic dimension validation
        if (diameter <= 0) newErrors.diameter = "Diameter must be positive";
        if (selectedOption?.requiresLength && length <= 0)
            newErrors.length = "Length must be positive";
        if (selectedOption?.requiresHeadDistance && headDistance < 0)
            newErrors.headDistance = "Head distance must be non-negative";

        // Level validation (requires vessel height)
        if (!newErrors.diameter && !newErrors.length) {
            try {
                // Create a temporary vessel to calculate height
                let v;
                if (selectedOptionKey === "vertical-flat-vessel") {
                    v = new VerticalFlatVessel(diameter, length);
                } else {
                    v = new VerticalFlatVessel(diameter, length);
                }

                const totalHeight = v.totalHeight;

                // Errors (Invalid values)
                if (highLevel < 0) newErrors.highLevel = "Must be ≥ 0";
                else if (highLevel > totalHeight)
                    newErrors.highLevel = `Must be ≤ ${totalHeight.toFixed(2)}m`;

                if (lowLevel < 0) newErrors.lowLevel = "Must be ≥ 0";
                else if (lowLevel > totalHeight)
                    newErrors.lowLevel = `Must be ≤ ${totalHeight.toFixed(2)}m`;

                if (liquidLevel < 0) newErrors.liquidLevel = "Must be ≥ 0";
                else if (liquidLevel > totalHeight)
                    newErrors.liquidLevel = `Must be ≤ ${totalHeight.toFixed(2)}m`;

                // Warnings (Logical inconsistencies)
                if (!newErrors.liquidLevel && !newErrors.highLevel && liquidLevel > highLevel) {
                    newWarnings.liquidLevel = "Exceeds High Level (HLL)";
                }
                if (!newErrors.liquidLevel && !newErrors.lowLevel && liquidLevel < lowLevel) {
                    newWarnings.liquidLevel = "Below Low Level (LLL)";
                }

            } catch (e) {
                // If vessel creation fails, we can't validate levels against height
            }
        }

        setErrors(newErrors);
        setWarnings(newWarnings);
    }, [
        diameter,
        length,
        headDistance,
        highLevel,
        lowLevel,
        liquidLevel,
        selectedOption,
        selectedOptionKey,
    ]);

    const vessel = useMemo(() => {
        let v;
        try {
            switch (selectedOptionKey) {
                case "vertical-flat-vessel":
                    v = new VerticalFlatVessel(diameter, length);
                    break;
                case "vertical-torispherical-vessel":
                    v = new VerticalTorisphericalVessel(diameter, length);
                    break;
                case "vertical-elliptical-vessel":
                    v = new VerticalEllipticalVessel(diameter, length);
                    break;
                case "vertical-hemispherical-vessel":
                    v = new VerticalHemisphericalVessel(diameter, length);
                    break;
                case "vertical-conical-vessel":
                    v = new VerticalConicalVessel(diameter, length, headDistance);
                    break;
                case "vertical-flat-tank":
                    v = new VerticalFlatTank(diameter, length);
                    break;
                case "vertical-torispherical-tank":
                    v = new VerticalTorisphericalTank(diameter, length);
                    break;
                case "vertical-elliptical-tank":
                    v = new VerticalEllipticalTank(diameter, length);
                    break;
                case "vertical-hemispherical-tank":
                    v = new VerticalHemisphericalTank(diameter, length);
                    break;
                case "vertical-conical-tank":
                    v = new VerticalConicalTank(diameter, length, headDistance);
                    break;
                case "horizontal-flat-vessel":
                    v = new HorizontalFlatVessel(diameter, length);
                    break;
                case "horizontal-torispherical-vessel":
                    v = new HorizontalTorisphericalVessel(diameter, length);
                    break;
                case "horizontal-elliptical-vessel":
                    v = new HorizontalEllipticalVessel(diameter, length);
                    break;
                case "horizontal-hemispherical-vessel":
                    v = new HorizontalHemisphericalVessel(diameter, length);
                    break;
                case "horizontal-conical-vessel":
                    v = new HorizontalConicalVessel(diameter, length, headDistance);
                    break;
                case "spherical-tank":
                    v = new SphericalTank(diameter);
                    break;
                default:
                    // Fallback for unimplemented types
                    v = new VerticalFlatVessel(diameter, length);
                    break;
            }

            // Only set levels if they are non-negative (to avoid creation errors)
            // We allow them to exceed height in the object (it just looks weird),
            // but the validation UI will warn the user.
            if (highLevel >= 0) v.highLiquidLevel = highLevel;
            if (lowLevel >= 0) v.lowLiquidLevel = lowLevel;
            if (liquidLevel >= 0) v.liquidLevel = liquidLevel;

            // For conical, headDistance is set in constructor, but we might want to update it if it changes?
            // The constructor takes it, so recreating the object handles it.

            return v;
        } catch (e) {
            // Return a default safe vessel if creation fails (e.g. diameter <= 0)
            // This prevents the UI from crashing while the user fixes the input
            return new VerticalFlatVessel(3.0, 9.0);
        }
    }, [
        selectedOptionKey,
        diameter,
        length,
        headDistance,
        highLevel,
        lowLevel,
        liquidLevel,
    ]);

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto shadow-sm">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <Calculator className="w-6 h-6" />
                        Vessel Config
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Design and analyze process vessels
                    </p>
                </div>

                <div className="p-6 space-y-8">
                    {/* Vessel Type Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Vessel Type
                        </label>
                        <select
                            value={selectedOptionKey}
                            onChange={(e) => setSelectedOptionKey(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                        >
                            {VESSEL_OPTIONS.map((opt) => (
                                <option key={opt.key} value={opt.key}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dimensions */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            <Settings className="w-4 h-4" />
                            Dimensions
                        </div>

                        <div className="space-y-3">
                            <InputField
                                label="Diameter (m)"
                                value={diameter}
                                onChange={setDiameter}
                                error={errors.diameter}
                                min={0.1}
                            />

                            {selectedOption?.requiresLength && (
                                <InputField
                                    label="Length (T-T) (m)"
                                    value={length}
                                    onChange={setLength}
                                    error={errors.length}
                                    min={0.1}
                                />
                            )}

                            {selectedOption?.requiresHeadDistance && (
                                <InputField
                                    label="Head Distance (m)"
                                    value={headDistance}
                                    onChange={setHeadDistance}
                                    error={errors.headDistance}
                                    min={0}
                                />
                            )}
                        </div>
                    </div>

                    {/* Liquid Levels */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            </div>
                            Liquid Levels
                        </div>

                        <div className="space-y-3">
                            <InputField
                                label="High Level (HLL) (m)"
                                value={highLevel}
                                onChange={setHighLevel}
                                error={errors.highLevel}
                                colorClass="text-green-600"
                                bgClass="bg-green-50"
                                borderClass="border-green-200"
                                focusClass="focus:ring-green-500"
                            />
                            <InputField
                                label="Current Level (LL) (m)"
                                value={liquidLevel}
                                onChange={setLiquidLevel}
                                error={errors.liquidLevel}
                                warning={warnings.liquidLevel}
                                colorClass="text-blue-600"
                                bgClass="bg-blue-50"
                                borderClass="border-blue-200"
                                focusClass="focus:ring-blue-500"
                            />
                            <InputField
                                label="Low Level (LLL) (m)"
                                value={lowLevel}
                                onChange={setLowLevel}
                                error={errors.lowLevel}
                                colorClass="text-red-600"
                                bgClass="bg-red-50"
                                borderClass="border-red-200"
                                focusClass="focus:ring-red-500"
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-10">
                    <h2 className="text-lg font-medium text-gray-800">
                        {selectedOption?.label || "Vessel Diagram"}
                    </h2>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            Export PDF
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                            Share
                        </button>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Diagram Area */}
                    <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center overflow-auto">
                        <div className="bg-white rounded-xl shadow-lg p-8 w-full h-full max-w-4xl max-h-[800px] flex items-center justify-center border border-gray-200">
                            <VesselDiagram vessel={vessel} />
                        </div>
                    </div>

                    {/* Data Panel */}
                    <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-500" />
                                Properties
                            </h3>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Volumes */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                    Volumes (m³)
                                </h4>
                                <div className="space-y-2">
                                    <DataRow label="Total Volume" value={vessel.totalVolume} />
                                    <DataRow label="Shell Volume" value={vessel.shellVolume} />
                                    <DataRow label="Head Volume" value={vessel.headVolume} />
                                    <div className="border-t border-gray-100 my-2 pt-2">
                                        <DataRow
                                            label="Effective Vol."
                                            value={vessel.effectiveVolume}
                                        />
                                        <DataRow
                                            label="Working Vol."
                                            value={vessel.workingVolume}
                                        />
                                        <DataRow
                                            label="Liquid Vol."
                                            value={vessel.liquidVolume(liquidLevel)}
                                            highlight
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Areas */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                    Surface Areas (m²)
                                </h4>
                                <div className="space-y-2">
                                    <DataRow
                                        label="Total Area"
                                        value={vessel.totalSurfaceArea}
                                    />
                                    <DataRow
                                        label="Shell Area"
                                        value={vessel.shellSurfaceArea}
                                    />
                                    <DataRow
                                        label="Head Area"
                                        value={vessel.headSurfaceArea}
                                    />
                                    <div className="border-t border-gray-100 my-2 pt-2">
                                        <DataRow
                                            label="Wetted Area"
                                            value={vessel.wettedArea(liquidLevel)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Efficiency */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                    Efficiency
                                </h4>
                                <div className="bg-blue-50 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-blue-700 font-medium">
                                            Volume Efficiency
                                        </span>
                                        <span className="text-sm font-bold text-blue-700">
                                            {vessel.efficiencyVolume.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-blue-200 rounded-full h-1.5">
                                        <div
                                            className="bg-blue-600 h-1.5 rounded-full"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    Math.max(0, vessel.efficiencyVolume)
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

const InputField = ({
    label,
    value,
    onChange,
    error,
    warning,
    min,
    colorClass = "text-gray-500",
    bgClass = "bg-gray-50",
    borderClass = "border-gray-200",
    focusClass = "focus:ring-blue-500",
}: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    error?: string;
    warning?: string;
    min?: number;
    colorClass?: string;
    bgClass?: string;
    borderClass?: string;
    focusClass?: string;
}) => (
    <div>
        <label className={`block text-xs font-medium ${colorClass} mb-1`}>
            {label}
        </label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            step="0.1"
            min={min}
            className={`w-full p-2 ${bgClass} border ${error ? "border-red-500" : warning ? "border-yellow-500" : borderClass
                } rounded-md focus:ring-1 ${focusClass} outline-none transition-colors`}
        />
        {error && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>{error}</span>
            </div>
        )}
        {warning && !error && (
            <div className="flex items-center gap-1 mt-1 text-yellow-600 text-xs">
                <AlertTriangle className="w-3 h-3" />
                <span>{warning}</span>
            </div>
        )}
    </div>
);

const DataRow = ({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value: number;
    highlight?: boolean;
}) => (
    <div
        className={`flex justify-between items-center ${highlight ? "bg-blue-50 p-2 rounded-md -mx-2" : ""
            }`}
    >
        <span
            className={`text-sm ${highlight ? "text-blue-800 font-medium" : "text-gray-600"
                }`}
        >
            {label}
        </span>
        <span
            className={`text-sm font-mono ${highlight ? "text-blue-800 font-bold" : "text-gray-900"
                }`}
        >
            {value.toFixed(3)}
        </span>
    </div>
);
