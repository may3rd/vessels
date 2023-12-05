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
    def total_volume(self) -> float:
        return pi * (self.diameter / 2) ** 3 * (4 / 3)

    @property
    def shell_volume(self) -> float:
        return pi * (self.diameter / 2) ** 3 * (4 / 3)

    @property
    def shell_surface_area(self) -> float:
        return self.wetted_area(self.diameter)

    def liquid_volume(self, value: float) -> float:
        value = min(value, self.diameter)
        return 0.0 if value < 0 else pi / 6 * value * (3 * sqrt(value * (self.diameter - value)) ** 2 + value ** 2)

    def wetted_area(self, value: float) -> float:
        return 0.0 if value < 0 else pi * self.diameter * value
