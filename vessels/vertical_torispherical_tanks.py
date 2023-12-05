from .vertical_torispherical_vessels import VerticalToriSphericalVessels
from math import pi

class VerticalToriSphericalTanks(VerticalToriSphericalVessels):
    vessels_type = 'Vertical ToriSpherical Tanks'

    def __init__(self, input_diameter: float = 3, input_length: float = 9, fd: float = 1.0, fk: float = 0.06) -> None:
        super().__init__(input_diameter, input_length, fd, fk)

    @property
    def bottom_head_distance(self) -> float:
        return 0.0

    def bottom_head_liquid_volume(self, value: float) -> float:
        return 0.0

    def bottom_head_wetted_area(self, value: float) -> float:
        return 0.0 if value <= 0 else pi * self.diameter ** 2 / 4

