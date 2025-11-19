from .horizontal_torishperical_vessels import HorizontalToriSphericalVessels
from .vertical_elliptical_vessels import elliptical_head_volume
from constants import FD_ELLIP, FK_ELLIP

class HorizontalEllipticalVessels(HorizontalToriSphericalVessels):
    vessels_type = 'Horizontal Elliptical Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9,
                 fd: float = FD_ELLIP, fk: float = FK_ELLIP) -> None:
        super().__init__(input_diameter, input_length, fd, fk)

    @property
    def head_distance(self) -> float:
        return self.diameter / 4

    def head_liquid_volume(self, value: float) -> float:
        return elliptical_head_volume(self.diameter / 2, self.head_distance, self.diameter / 2, value)