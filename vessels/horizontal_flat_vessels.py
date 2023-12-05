from .vessels import Vessels
from math import pi, sqrt, acos, asin, acosh
import scipy.integrate as integrate

class HorizontalFlatVessels(Vessels):
    vessels_type = 'Horizontal Flat Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9) -> None:
        super().__init__()
        self._diameter = input_diameter
        self._length = input_length

    @property
    def total_height(self) -> float:
        return self.diameter

    @property
    def head_volume(self) -> float:
        return self.head_liquid_volume(self.total_height)

    @property
    def shell_volume(self) -> float:
        return self.shell_liquid_volume(self.total_height)

    @property
    def total_volume(self) -> float:
        return self.head_volume + self.shell_volume

    @property
    def working_volume(self) -> float:
        return self.liquid_volume(self.high_liquid_level) - self.liquid_volume(self.low_liquid_level)

    @property
    def shell_surface_area(self) -> float:
        return pi * self.diameter * self.length

    @property
    def head_surface_area(self) -> float:
        return self.head_wetted_area(self.total_height)

    def shell_liquid_volume(self, value: float) -> float:
        if value <= 0:
            return 0.0
        else:
            value = min(value, self.total_height)
            theta = acos(1 - value * 2 / self.diameter)
            return self.length * (theta * self.diameter ** 2 / 4 - (self.diameter / 2 - value) * sqrt(
                value * (self.diameter - value)))

    def shell_wetted_area(self, value: float) -> float:
        return 0.0 if value <= 0 else self.diameter * \
                                      acos(1 - min(value, self.total_height) * 2 / self.diameter) * self.length

    def head_wetted_area(self, value: float) -> float:
        if value <= 0:
            return 0
        else:
            value = min(value, self.total_height)
            theta = 2 * acos(1 - value * 2 / self.diameter)
            return 2 * (theta / 2 * (self.diameter / 2) ** 2 - (self.diameter / 2 - value) * sqrt(
                value * (self.diameter - value)))

