from .vessels import Vessels
from math import pi, sqrt

class SphericalTanks(Vessels):
    vessels_type = 'Spherical Tanks'

    def __init__(self, input_diameter: float = 3) -> None:
        super().__init__()
        self._diameter = input_diameter

    @property
    def total_height(self) -> float:
        return self.diameter

    @property
    def tangent_height(self) -> float:
        return 0.0

    @property
    def tangent_volume(self) -> float:
        return 0.0

    @property
    def head_volume(self) -> float:
        return 0.0

    @property
    def total_volume(self) -> float:
        return pi * (self.diameter / 2) ** 3 * (4 / 3)

    @property
    def shell_volume(self) -> float:
        return pi * (self.diameter / 2) ** 3 * (4 / 3)

    @property
    def working_volume(self) -> float:
        return self.liquid_volume(self.high_liquid_level) - self.liquid_volume(self.low_liquid_level)

    @property
    def head_surface_area(self) -> float:
        return 0.0

    @property
    def shell_surface_area(self) -> float:
        return self.wetted_area(self.diameter)

    def head_liquid_volume(self, value: float) -> float:
        return 0.0

    def shell_liquid_volume(self, value: float) -> float:
        return self.liquid_volume(value)

    def liquid_volume(self, value: float) -> float:
        value = min(value, self.diameter)
        return 0.0 if value < 0 else pi / 6 * value * (3 * sqrt(value * (self.diameter - value)) ** 2 + value ** 2)

    def head_wetted_area(self, value: float) -> float:
        return 0.0

    def shell_wetted_area(self, value: float) -> float:
        return self.wetted_area(value)

    def wetted_area(self, value: float) -> float:
        return 0.0 if value < 0 else pi * self.diameter * value