export interface VesselOption {
    key: string;
    label: string;
    requiresLength: boolean;
    requiresHeadDistance: boolean;
}

export const VESSEL_OPTIONS: VesselOption[] = [
    {
        key: "vertical-flat-vessel",
        label: "Vertical Flat Vessel",
        requiresLength: true,
        requiresHeadDistance: false,
    },
    {
        key: "vertical-torispherical-vessel",
        label: "Vertical ToriSpherical Vessel",
        requiresLength: true,
        requiresHeadDistance: false,
    },
    {
        key: "vertical-elliptical-vessel",
        label: "Vertical Elliptical Vessel",
        requiresLength: true,
        requiresHeadDistance: false,
    },
    {
        key: "vertical-hemispherical-vessel",
        label: "Vertical HemiSpherical Vessel",
        requiresLength: true,
        requiresHeadDistance: false,
    },
    {
        key: "vertical-conical-vessel",
        label: "Vertical Conical Vessel",
        requiresLength: true,
        requiresHeadDistance: true,
    },
    {
        key: "vertical-flat-tank",
        label: "Vertical Flat Tank",
        requiresLength: true,
        requiresHeadDistance: false,
    },
    {
        key: "vertical-torispherical-tank",
        label: "Vertical ToriSpherical Tank",
        requiresLength: true,
        requiresHeadDistance: false,
    },
    {
        key: "vertical-elliptical-tank",
        label: "Vertical Elliptical Tank",
        requiresLength: true,
        requiresHeadDistance: false,
    },
    {
        key: "vertical-hemispherical-tank",
        label: "Vertical HemiSpherical Tank",
        requiresLength: true,
        requiresHeadDistance: false,
    },
    {
        key: "vertical-conical-tank",
        label: "Vertical Conical Tank",
        requiresLength: true,
        requiresHeadDistance: true,
    },
    {
        key: "horizontal-flat-vessel",
        label: "Horizontal Flat Vessel",
        requiresLength: true,
        requiresHeadDistance: false,
    },
    {
        key: "horizontal-torispherical-vessel",
        label: "Horizontal ToriSpherical Vessel",
        requiresLength: true,
        requiresHeadDistance: false,
    },
    {
        key: "horizontal-elliptical-vessel",
        label: "Horizontal Elliptical Vessel",
        requiresLength: true,
        requiresHeadDistance: false,
    },
    {
        key: "horizontal-hemispherical-vessel",
        label: "Horizontal HemiSpherical Vessel",
        requiresLength: true,
        requiresHeadDistance: false,
    },
    {
        key: "horizontal-conical-vessel",
        label: "Horizontal Conical Vessel",
        requiresLength: true,
        requiresHeadDistance: true,
    },
    {
        key: "spherical-tank",
        label: "Spherical Tank",
        requiresLength: false,
        requiresHeadDistance: false,
    },
];

export const VESSEL_OPTION_MAP = VESSEL_OPTIONS.reduce((acc, opt) => {
    acc[opt.key] = opt;
    return acc;
}, {} as Record<string, VesselOption>);
