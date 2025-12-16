import argparse
import sys
from dataclasses import dataclass
from typing import Callable, Dict, List, Optional, Tuple

from vessels.vertical_flat_vessels import VerticalFlatVessels
from vessels.vertical_torispherical_vessels import VerticalToriSphericalVessels
from vessels.vertical_elliptical_vessels import VerticalEllipticalVessels
from vessels.vertical_hemispherical_vessels import VerticalHemiSphericalVessels
from vessels.vertical_conical_vessels import VerticalConicalVessels
from vessels.vertical_flat_tanks import VerticalFlatTanks
from vessels.vertical_torispherical_tanks import VerticalToriSphericalTanks
from vessels.vertical_elliptical_tanks import VerticalEllipticalTanks
from vessels.vertical_hemispherical_tanks import VerticalHemiSphericalTanks
from vessels.vertical_conical_tanks import VerticalConicalTanks
from vessels.horizontal_flat_vessels import HorizontalFlatVessels
from vessels.horizontal_torishperical_vessels import HorizontalToriSphericalVessels
from vessels.horizontal_elliptical_vessels import HorizontalEllipticalVessels
from vessels.horizontal_hemispherical_vessels import HorizontalHemiSphericalVessels
from vessels.horizontal_conical_vessels import HorizontalConicalVessels
from vessels.spherical_tanks import SphericalTanks
from vessels.vessels import Vessels

DEFAULT_OUTPUT = "vessel.svg"

@dataclass(frozen=True)
class VesselOption:
    key: str
    label: str
    builder: Callable[[float, float, float], Vessels]
    requires_length: bool = True
    requires_head_distance: bool = False


VESSEL_OPTIONS: List[VesselOption] = [
    VesselOption(
        "vertical-flat-vessel",
        "Vertical Flat Vessel",
        lambda d, l, h: VerticalFlatVessels(d, l),
    ),
    VesselOption(
        "vertical-torispherical-vessel",
        "Vertical ToriSpherical Vessel",
        lambda d, l, h: VerticalToriSphericalVessels(d, l),
    ),
    VesselOption(
        "vertical-elliptical-vessel",
        "Vertical Elliptical Vessel",
        lambda d, l, h: VerticalEllipticalVessels(d, l),
    ),
    VesselOption(
        "vertical-hemispherical-vessel",
        "Vertical HemiSpherical Vessel",
        lambda d, l, h: VerticalHemiSphericalVessels(d, l),
    ),
    VesselOption(
        "vertical-conical-vessel",
        "Vertical Conical Vessel",
        lambda d, l, h: VerticalConicalVessels(d, l, h),
        requires_head_distance=True,
    ),
    VesselOption(
        "vertical-flat-tank",
        "Vertical Flat Tank",
        lambda d, l, h: VerticalFlatTanks(d, l),
    ),
    VesselOption(
        "vertical-torispherical-tank",
        "Vertical ToriSpherical Tank",
        lambda d, l, h: VerticalToriSphericalTanks(d, l),
    ),
    VesselOption(
        "vertical-elliptical-tank",
        "Vertical Elliptical Tank",
        lambda d, l, h: VerticalEllipticalTanks(d, l),
    ),
    VesselOption(
        "vertical-hemispherical-tank",
        "Vertical HemiSpherical Tank",
        lambda d, l, h: VerticalHemiSphericalTanks(d, l),
    ),
    VesselOption(
        "vertical-conical-tank",
        "Vertical Conical Tank",
        lambda d, l, h: VerticalConicalTanks(d, l, h),
        requires_head_distance=True,
    ),
    VesselOption(
        "horizontal-flat-vessel",
        "Horizontal Flat Vessel",
        lambda d, l, h: HorizontalFlatVessels(d, l),
    ),
    VesselOption(
        "horizontal-torispherical-vessel",
        "Horizontal ToriSpherical Vessel",
        lambda d, l, h: HorizontalToriSphericalVessels(d, l),
    ),
    VesselOption(
        "horizontal-elliptical-vessel",
        "Horizontal Elliptical Vessel",
        lambda d, l, h: HorizontalEllipticalVessels(d, l),
    ),
    VesselOption(
        "horizontal-hemispherical-vessel",
        "Horizontal HemiSpherical Vessel",
        lambda d, l, h: HorizontalHemiSphericalVessels(d, l),
    ),
    VesselOption(
        "horizontal-conical-vessel",
        "Horizontal Conical Vessel",
        lambda d, l, h: HorizontalConicalVessels(d, l, h),
        requires_head_distance=True,
    ),
    VesselOption(
        "spherical-tank",
        "Spherical Tank",
        lambda d, l, h: SphericalTanks(d),
        requires_length=False,
    ),
]

VESSEL_OPTION_MAP: Dict[str, VesselOption] = {opt.key: opt for opt in VESSEL_OPTIONS}

def _prompt_float(prompt_text: str, default: Optional[float], min_value: Optional[float] = None,
                  max_value: Optional[float] = None) -> float:
    if not sys.stdin.isatty():
        raise SystemExit(f"{prompt_text} must be provided via CLI arguments when running non-interactively.")
    while True:
        suffix = f" [{default:.3f}]" if default is not None else ""
        raw = input(f"{prompt_text}{suffix}: ").strip()
        if not raw:
            if default is not None:
                value = default
            else:
                print("Value is required.")
                continue
        else:
            try:
                value = float(raw)
            except ValueError:
                print("Please enter a numeric value.")
                continue
        if min_value is not None and value < min_value:
            print(f"Value must be ≥ {min_value}.")
            continue
        if max_value is not None and value > max_value:
            print(f"Value must be ≤ {max_value}.")
            continue
        return value


def _get_float(value: Optional[float], prompt_text: str, default: Optional[float],
               min_value: Optional[float] = None, max_value: Optional[float] = None) -> float:
    if value is not None:
        return value
    return _prompt_float(prompt_text, default, min_value, max_value)


def _prompt_yes_no(prompt_text: str, default: bool = True) -> bool:
    if not sys.stdin.isatty():
        return default
    options = "[Y/n]" if default else "[y/N]"
    while True:
        raw = input(f"{prompt_text} {options}: ").strip().lower()
        if not raw:
            return default
        if raw in ("y", "yes"):
            return True
        if raw in ("n", "no"):
            return False
        print("Please answer 'y' or 'n'.")


def _prompt_string(prompt_text: str, default: Optional[str]) -> str:
    if not sys.stdin.isatty():
        if default is None:
            raise SystemExit(f"{prompt_text} must be supplied when running non-interactively.")
        return default
    suffix = f" [{default}]" if default else ""
    while True:
        raw = input(f"{prompt_text}{suffix}: ").strip()
        if raw:
            return raw
        if default:
            return default
        print("Value is required.")


def _determine_output_path(args) -> Tuple[bool, Optional[str]]:
    if getattr(args, "no_save", False):
        return False, None
    if args.output:
        return True, args.output
    if not sys.stdin.isatty():
        return True, DEFAULT_OUTPUT
    if not _prompt_yes_no("Save drawing to an image file?", True):
        return False, None
    filename = _prompt_string("Output file name", DEFAULT_OUTPUT)
    return True, filename


def _list_vessel_types() -> None:
    print("Available vessel types:")
    for idx, option in enumerate(VESSEL_OPTIONS, start=1):
        print(f"  {idx:2d}. {option.label:<35} (key: {option.key})")


def _prompt_vessel_option() -> VesselOption:
    _list_vessel_types()
    if not sys.stdin.isatty():
        raise SystemExit("Vessel type must be specified with --type when running non-interactively.")
    keys = {opt.key: opt for opt in VESSEL_OPTIONS}
    while True:
        raw = input("Select vessel by number or key: ").strip().lower()
        if raw.isdigit():
            idx = int(raw)
            if 1 <= idx <= len(VESSEL_OPTIONS):
                return VESSEL_OPTIONS[idx - 1]
        elif raw in keys:
            return keys[raw]
        print("Invalid selection. Please try again.")


def _select_vessel_option(key: Optional[str]) -> VesselOption:
    if key:
        normalized = key.lower()
        if normalized in VESSEL_OPTION_MAP:
            return VESSEL_OPTION_MAP[normalized]
        print(f"Unknown vessel type '{key}'.")
    return _prompt_vessel_option()


def _build_vessel(option: VesselOption, diameter: float, length: float, head_distance: float) -> Vessels:
    vessel = option.builder(diameter, length, head_distance)
    return vessel


def _configure_levels(vessel: Vessels, args) -> Tuple[float, float, float]:
    total_height = vessel.total_height
    default_high = min(total_height, max(total_height * 0.8, total_height * 0.2))
    default_low = max(0.0, default_high * 0.35)
    default_liquid = min(total_height, (default_high + default_low) / 2)
    high = _get_float(args.high_level, "High liquid level (m)", default_high, 0.0, total_height)
    low = _get_float(args.low_level, "Low liquid level (m)", default_low, 0.0, total_height)
    if low > high:
        print("Low level exceeds high level. Adjusting low level to match high level.")
        low = high
    liquid = _get_float(args.liquid_level, "Current liquid level (m)", default_liquid, 0.0, total_height)
    return high, low, liquid


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Interactive CLI for configuring and drawing process vessels."
    )
    parser.add_argument("-t", "--type", help="Vessel type key. Use --list to see available options.")
    parser.add_argument("-d", "--diameter", type=float, help="Vessel diameter in meters.")
    parser.add_argument("-l", "--length", type=float, help="Tangent-to-tangent length (vertical height or horizontal length).")
    parser.add_argument("--head-distance", type=float, help="Head distance (for conical heads).")
    parser.add_argument("--high-level", type=float, help="High liquid level in meters.")
    parser.add_argument("--low-level", type=float, help="Low liquid level in meters.")
    parser.add_argument("--liquid-level", type=float, help="Current liquid level in meters.")
    parser.add_argument("--overflow", action="store_true", help="Enable overflow flag.")
    parser.add_argument("--output", help=f"Output drawing path (default: {DEFAULT_OUTPUT}).")
    parser.add_argument("--no-save", action="store_true", help="Skip saving the vessel drawing.")
    parser.add_argument("--list", action="store_true", help="List available vessel types and exit.")
    return parser.parse_args()


def main() -> None:
    args = parse_arguments()
    if args.list:
        _list_vessel_types()
        return

    option = _select_vessel_option(args.type)
    diameter = _get_float(args.diameter, "Diameter (m)", 3.0, 0.01)
    length = 0.0
    if option.requires_length:
        length = _get_float(args.length, "Tangent-to-tangent length (m)", 9.0, 0.01)
    else:
        length = args.length if args.length is not None else 0.0
    head_distance = 0.0
    if option.requires_head_distance:
        head_distance = _get_float(args.head_distance, "Head distance (m)", 2.0, 0.0)
    else:
        head_distance = args.head_distance if args.head_distance is not None else 0.0

    vessel = _build_vessel(option, diameter, length, head_distance)
    high_level, low_level, liquid_level = _configure_levels(vessel, args)
    vessel.high_liquid_level = high_level
    vessel.low_liquid_level = low_level
    vessel.liquid_level = liquid_level
    vessel.overflow_flag = args.overflow

    print(vessel)
    save_drawing, output_path = _determine_output_path(args)
    if save_drawing and output_path:
        vessel.draw(output_path)
        print(f"Drawing saved to {output_path}")
    else:
        print("Drawing not saved.")


if __name__ == "__main__":
    main()
