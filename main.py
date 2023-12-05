from vessels import VerticalFlatVessels, VerticalToriSphericalVessels, VerticalEllipticalVessels, VerticalHemiSphericalVessels, VerticalConicalVessels, VerticalFlattedTanks, VerticalToriSphericalTanks, VerticalEllipticalTanks, VerticalHemiSphericalTanks, VerticalConicalTanks, HorizontalFlatVessels, HorizontalToriSphericalVessels, HorizontalEllipticalVessels, HorizontalHemiSphericalVessels, HorizontalConicalVessels, SphericalTanks


if __name__ == "__main__":
    diameter = 4.0
    length = 9.0
    cHead = 2.0
    liquid_level = 1.99
    high_liquid_level = 3
    low_liquid_lever = 1

    vessels = [VerticalFlatVessels(diameter, length),  # 0 - vertical flat vessel
               VerticalToriSphericalVessels(diameter, length),  # 1 - vertical tori vessel
               VerticalEllipticalVessels(diameter, length),  # 2 - vertical elli vessel
               VerticalHemiSphericalVessels(diameter, length),  # 3 - vertical hemi vessel
               VerticalConicalVessels(diameter, length, cHead),  # 4 - vertical cone vessel
               VerticalFlattedTanks(diameter, length),  # 5 - vertical flat tank
               VerticalToriSphericalTanks(diameter, length),  # 6 - vertical tori tank
               VerticalEllipticalTanks(diameter, length),  # 7 - vertical elli tank
               VerticalHemiSphericalTanks(diameter, length),  # 8 - vertical hemi tank
               VerticalConicalTanks(diameter, length, cHead),  # 9 - vertical cone tank
               HorizontalFlatVessels(diameter, length),  # 10 - horizontal flat vessel
               HorizontalToriSphericalVessels(diameter, length),  # 11 - horizontal tori vessel
               HorizontalEllipticalVessels(diameter, length),  # 12 - horizontal elli vessel
               HorizontalHemiSphericalVessels(diameter, length),  # 13 - horizontal hemi vessel
               HorizontalConicalVessels(diameter, length, cHead),  # 14 - horizontal cone vessel
               SphericalTanks(diameter)]  # 15 - spherical tank

    vessel = vessels[4]
    vessel.high_liquid_level = high_liquid_level
    vessel.low_liquid_level = low_liquid_lever
    vessel.liquid_level = liquid_level
    vessel.overflow_flag = True
    print(vessel)
    