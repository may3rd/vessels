from .horizontal_flat_vessels import HorizontalFlatVessels
from math import pi, sqrt, asin, acosh

class HorizontalConicalVessels(HorizontalFlatVessels):
    vessels_type = 'Horizontal Conical Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9, head_distance: float = 0.0) -> None:
        super().__init__(input_diameter, input_length)
        self._head_distance = head_distance
        self._diameter = input_diameter
        self._length = input_length

    @property
    def head_distance(self) -> float:
        return self._head_distance

    @head_distance.setter
    def head_distance(self, value: float):
        self._head_distance = value

    @property
    def tangent_height(self) -> float:
        return 0.0

    @property
    def tangent_volume(self) -> float:
        return 0.0

    def head_liquid_volume(self, value: float) -> float:
        if (value <= 0.0) | (self.head_distance <= 0.0):
            return 0.0
        elif value < self.diameter / 2:
            return 2 * self.conical_head_volume(value)
        else:
            value = self.total_height - min(value, self.total_height)
            return 2 * (1 / 3 * pi * self.diameter ** 2 / 4 * self.head_distance - self.conical_head_volume(value))

    def conical_head_volume(self, value: float) -> float:
        k = 1 - 2 * value / self.diameter
        if k == 0:
            return 1 / 6 * pi * self.diameter ** 2 / 4 * self.head_distance
        return self.head_distance * self.diameter ** 2 / 12 * (
                pi / 2 - 2 * k * sqrt(1 - k ** 2) - asin(k) + k ** 3 * acosh(1 / k))

    def head_wetted_area(self, value: float) -> float:
        return 0.0 if (value <= 0.0) | (self.head_distance <= 0.0) else 2 * self.horizontal_cone_surface_area(value)

    def horizontal_cone_surface_area(self, value: float) -> float:
        if value <= 0.0:
            return 0.0
        elif value < self.diameter / 2:
            return self.horizontal_cone_surface_area_fn(value)
        else:
            sa1 = self.vertical_cone_surface_area(self.head_distance)
            sa2 = self.horizontal_cone_surface_area_fn(self.diameter - value)
            return sa1 - sa2

    def horizontal_cone_surface_area_fn(self, value: float) -> float:
        r = self.diameter / 2
        k = 1 - value / r
        return r * sqrt(r ** 2 + self.head_distance ** 2) * (pi / 2 - asin(k) - k * sqrt(1 - k ** 2))