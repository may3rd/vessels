from .vertical_conical_vessels import VerticalConicalVessels
from math import pi

class VerticalConicalTanks(VerticalConicalVessels):
    vessels_type = 'Vertical Conical Tanks'

    def __init__(self, input_diameter: float = 3, input_length: float = 9, head_distance: float = 0.0) -> None:
        super().__init__(input_diameter, input_length, head_distance)

    @property
    def bottom_head_distance(self) -> float:
        return 0.0

    def bottom_head_liquid_volume(self, value: float) -> float:
        return 0.0

    def bottom_head_wetted_area(self, value: float) -> float:
        return 0.0 if value <= 0 else pi * self.diameter ** 2 / 4

