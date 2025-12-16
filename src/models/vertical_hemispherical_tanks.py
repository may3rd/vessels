from .vertical_hemispherical_vessels import VerticalHemiSphericalVessels
from math import pi

class VerticalHemiSphericalTanks(VerticalHemiSphericalVessels):
    vessels_type = 'Vertical HemiSpherical Tanks'

    def __init__(self, input_diameter: float = 3, input_length: float = 9) -> None:
        super().__init__(input_diameter, input_length)

    @property
    def bottom_head_distance(self) -> float:
        return 0.0

    def bottom_head_liquid_volume(self, value: float) -> float:
        return 0.0

    def bottom_head_wetted_area(self, value: float) -> float:
        return 0.0 if value <= 0 else pi * self.diameter ** 2 / 4 * 1

