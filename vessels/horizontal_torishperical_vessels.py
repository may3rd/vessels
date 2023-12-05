from .horizontal_flat_vessels import HorizontalFlatVessels
from .vertical_torispherical_vessels import VerticalToriSphericalVessels
from math import pi, sqrt, acos, asin, acosh
import scipy.integrate as integrate


class HorizontalToriSphericalVessels(HorizontalFlatVessels, VerticalToriSphericalVessels):
    vessels_type = 'Horizontal ToriSpherical Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9, fd: float = 1.0, fk: float = 0.06) -> None:
        super().__init__(input_diameter, input_length)
        self._fd: float = fd
        self._fk: float = fk

    def head_liquid_volume(self, value: float) -> float:
        return 2 * self.horizontal_fd_head_volume(value)

    def head_wetted_area(self, value: float) -> float:
        return 2 * self.horizontal_fd_head_wetted_area(value)

    def horizontal_fd_head_volume(self, value: float) -> float:
        if value <= 0:
            return 0.0
        else:
            a = min(value, self.diameter) / self.diameter
            head_volume = integrate.quad(self.horizontal_fd_head_surface_area, 0, a)[0]
            return head_volume * self.diameter / 2

    def horizontal_fd_head_surface_area(self, x) -> float:
        return 2 * (self.horizontal_area_2(x) + self.horizontal_area_1(x))

    def horizontal_fd_head_wetted_area(self, value: float) -> float:
        if value <= 0:
            return 0.0
        else:
            delta = min(value, self.diameter) / self.diameter
            # dimensionless height
            # knuckle of the left head
            s2 = self.horizontal_surface_area_2(delta)
            # dish of the left head
            s1 = self.horizontal_surface_area_1(delta)
            return s1 + s2
