from .vertical_flat_vessels import VerticalFlatVessels
from math import pi

class VerticalConicalVessels(VerticalFlatVessels):
    vessels_type = 'Vertical Conical Vessels'

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

    def bottom_head_liquid_volume(self, value: float) -> float:
        return 0.0 if value <= 0 else self.head_liquid_volume_fn(min(value, self.bottom_head_distance))

    def top_head_liquid_volume(self, value: float) -> float:
        return 0.0 if value < self.tangent_height else (1 / 12) * pi * self.diameter ** 2 * (
                self.top_head_distance) - self.head_liquid_volume_fn(self.total_height - min(value, self.total_height))

    def bottom_head_wetted_area(self, value: float) -> float:
        return 0.0 if value < 0 else self.vertical_cone_surface_area(min(value, self.bottom_head_distance))

    def top_head_wetted_area(self, value: float) -> float:
        return 0.0 if value < self.tangent_height else self.vertical_cone_surface_area(self.top_head_distance) \
                                                       - self.vertical_cone_surface_area(
            self.total_height - min(value, self.total_height))
    
    def head_liquid_volume_fn(self, value: float) -> float:
        return 0.0 if (value <= 0.0) | (self.head_distance <= 0.0) else \
            1 / 3 * pi * value * (value * self.diameter / 2 / self.head_distance) ** 2
    