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

if __name__ == "__main__":
    diameter = 4.5
    length = 12.0
    cHead = 2.0
    liquid_level = 1.3333 + 4.5/4.0
    high_liquid_level = 3
    low_liquid_lever = 1

    vessels_list = [
        VerticalFlatVessels(diameter, length),  # 0 - vertical flat vessel
        VerticalToriSphericalVessels(diameter, length),  # 1 - vertical tori vessel
        VerticalEllipticalVessels(diameter, length),  # 2 - vertical elli vessel
        VerticalHemiSphericalVessels(diameter, length),  # 3 - vertical hemi vessel
        VerticalConicalVessels(diameter, length, cHead),  # 4 - vertical cone vessel
        VerticalFlatTanks(diameter, length),  # 5 - vertical flat tank
        VerticalToriSphericalTanks(diameter, length),  # 6 - vertical tori tank
        VerticalEllipticalTanks(diameter, length),  # 7 - vertical elli tank
        VerticalHemiSphericalTanks(diameter, length),  # 8 - vertical hemi tank
        VerticalConicalTanks(diameter, length, cHead),  # 9 - vertical cone tank
        HorizontalFlatVessels(diameter, length),  # 10 - horizontal flat vessel
        HorizontalToriSphericalVessels(diameter, length),  # 11 - horizontal tori vessel
        HorizontalEllipticalVessels(diameter, length),  # 12 - horizontal elli vessel
        HorizontalHemiSphericalVessels(diameter, length),  # 13 - horizontal hemi vessel
        HorizontalConicalVessels(diameter, length, cHead),  # 14 - horizontal cone vessel
        SphericalTanks(diameter),  # 15 - spherical tank
    ]

    for i in range(len(vessels_list)):
        vessel = vessels_list[i]
        vessel.high_liquid_level = high_liquid_level
        vessel.low_liquid_level = low_liquid_lever
        vessel.liquid_level = liquid_level
        vessel.overflow_flag = True
        # print(vessel)
        vessel.draw(f"drawings/vessel_{i:02d}.svg")
    
    #hh, vv, ww = vessel.create_table(50)
