from .vertical_torispherical_vessels import VerticalToriSphericalVessels
from .constants import FD_TORI, FK_TORI, pi

class VerticalToriSphericalTanks(VerticalToriSphericalVessels):
    vessels_type = 'Vertical ToriSpherical Tanks'

    def __init__(self, input_diameter: float = 3, input_length: float = 9, fd: float = FD_TORI, fk: float = FK_TORI) -> None:
        super().__init__(input_diameter, input_length, fd, fk)

    @property
    def bottom_head_distance(self) -> float:
        return 0.0

    def bottom_head_liquid_volume(self, value: float) -> float:
        return 0.0

    def bottom_head_wetted_area(self, value: float) -> float:
        return 0.0 if value <= 0 else pi * self.diameter ** 2 / 4

