from .vertical_elliptical_vessels import VerticalEllipticalVessels
from math import pi

class VerticalHemiSphericalVessels(VerticalEllipticalVessels):
    vessels_type = 'Vertical HemiSpherical Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9) -> None:
        super().__init__(input_diameter, input_length)

    @property
    def head_distance(self) -> float:
        return self.diameter / 2

    def bottom_head_wetted_area(self, value: float) -> float:
        return 0.0 if value < 0 else pi * self.diameter * min(value, self.bottom_head_distance)

    def top_head_wetted_area(self, value: float) -> float:
        return 0.0 if value < self.tangent_height else pi * self.diameter * (
                self.top_head_distance - (self.total_height - min(value, self.total_height)))
    