from .vertical_torispherical_vessels import VerticalToriSphericalVessels
from .constants import *

class VerticalEllipticalVessels(VerticalToriSphericalVessels):
    vessels_type = 'Vertical Elliptical Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9,
                 fd: float = FD_ELLIP, fk: float = FK_ELLIP) -> None:
        super().__init__(input_diameter, input_length, fd, fk)

    @property
    def head_distance(self) -> float:
        return self.diameter / 4

    def bottom_head_liquid_volume(self, value: float) -> float:
        return 0.0 if value < 0 else elliptical_head_volume(
            self.diameter / 2, self.diameter / 2, self.bottom_head_distance, min(value, self.bottom_head_distance))

    def top_head_liquid_volume(self, value: float) -> float:
        if value <= self.bottom_head_distance + self.length:
            return 0.0
        else:
            value = self.total_height - min(value, self.total_height)
            v1 = elliptical_head_volume(self.diameter / 2, self.diameter / 2,
                                        self.top_head_distance, self.top_head_distance)
            v2 = elliptical_head_volume(self.diameter / 2, self.diameter / 2,
                                        self.top_head_distance, value)
            return v1 - v2
        
def elliptical_head_volume(x_radii: float, y_radii: float, z_radii: float, cap_height: float) -> float:
    """Elliptical Head Volume Calculation.

    Args:
        x_radii (float): radius on x-axis
        y_radii (float): radius on y-axis
        z_radii (float): radius on z-axis
        cap_height (float): height of the cap in z-axis

    Returns:
        The calculated volume of the partial ellipsoidal cap given the semi-axes height.
    """
    return pi * x_radii * y_radii * cap_height ** 2 * (3 * z_radii - cap_height) / (3 * z_radii ** 2)