from .horizontal_elliptical_vessels import HorizontalEllipticalVessels
from .constants import *

class HorizontalHemiSphericalVessels(HorizontalEllipticalVessels):
    vessels_type = 'Horizontal HemiSpherical Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9) -> None:
        super().__init__(input_diameter, input_length)

    @property
    def head_distance(self) -> float:
        return self.diameter / 2

    def head_wetted_area(self, value: float) -> float:
        return 0.0 if value < 0 else pi * self.diameter * value
