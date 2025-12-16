from .vertical_flat_vessels import VerticalFlatVessels
from math import sqrt, acos, asin
from .constants import FD_TORI, FK_TORI, pi
import scipy.integrate as integrate

class VerticalToriSphericalVessels(VerticalFlatVessels):
    vessels_type = 'Vertical ToriSpherical Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9, fd: float = FD_TORI, fk: float = FK_TORI) -> None:
        super().__init__(input_diameter, input_length)
        self._fd = fd
        self._fk = fk

    @property
    def fd(self) -> float:
        return self._fd

    @fd.setter
    def fd(self, value: float):
        self._fd = value

    @property
    def fk(self) -> float:
        return self._fk

    @fk.setter
    def fk(self, value: float):
        self._fk = value

    @property
    def a1(self) -> float:
        return self.fd * (
                1 - sqrt(1 - (1 / 2 - self.fk) * (1 / 2 - self.fk) / ((self.fd - self.fk) * (self.fd - self.fk))))

    @property
    def a2(self) -> float:
        return self.fd - sqrt(self.fd ** 2 - 2 * self.fd * self.fk + self.fk - 1 / 4)

    @property
    def a3(self) -> float:
        return self.length / self.diameter + self.a2

    @property
    def a4(self) -> float:
        return self.a3 + (self.a2 - self.a1)

    @property
    def a5(self) -> float:
        return self.a3 + self.a2

    @property
    def b1(self) -> float:
        return self.fd * (1 / 2 - self.fk) / (self.fd - self.fk)

    @property
    def b2(self) -> float:
        return 0.5

    @property
    def head_distance(self) -> float:
        return self.a2 * self.diameter

    def bottom_head_liquid_volume(self, value: float) -> float:
        if value <= 0:
            return 0.0
        elif value <= self.a2 * self.diameter:
            return self.vertical_bottom_fd_head_volume(value)
        else:
            return self.vertical_bottom_fd_head_volume(self.bottom_head_distance)

    def top_head_liquid_volume(self, value: float) -> float:
        return 0.0 if value < self.tangent_height else self.vertical_top_fd_head_volume(min(value, self.total_height))

    def bottom_head_wetted_area(self, value: float) -> float:
        return self.vertical_bottom_fd_head_wetted_area(value)

    def top_head_wetted_area(self, value: float) -> float:
        return self.vertical_top_fd_head_wetted_area(value)

    def _safe_integrate(self, func, a, b, args=()):
        try:
            return integrate.quad(func, a, b, args=args)[0]
        except Exception:
            return 0.0

    def vertical_bottom_fd_head_volume(self, value: float) -> float:
        return 0.0 if value < 0 else self.diameter * self._safe_integrate(
            self.vertical_fd_head_surface_area, 0, min(value / self.diameter, self.a2))

    def vertical_top_fd_head_volume(self, value: float) -> float:
        if value <= self.bottom_head_distance + self.length:
            return 0.0
        else:
            value = self.total_height - value
            a = value / self.diameter
            head_volume = self._safe_integrate(self.vertical_fd_head_surface_area, 0, self.a2)
            sub_volume = self._safe_integrate(self.vertical_fd_head_surface_area, 0, a)
            return (head_volume - sub_volume) * self.diameter

    def vertical_fd_head_surface_area(self, x: float) -> float:
        if x <= self.a1:
            return pi * self.diameter ** 2 * (self.fd ** 2 - (x - self.fd) ** 2)
        else:
            return pi * self.diameter ** 2 * ((1 / 2 - self.fk) + sqrt(self.fk ** 2 - (x - self.a2) ** 2)) ** 2

    def horizontal_area_2(self, x: float) -> float:
        b_f = sqrt(1 / 4 - (1 / 2 - x) ** 2)
        if (x > 1 / 2 - self.b1) & (x < 1 / 2 + self.b1):
            b_d = sqrt(((1 / 2 - self.fk) + sqrt(self.fk ** 2 - (self.a2 - self.a1) ** 2)) ** 2 - (1 / 2 - x) ** 2)
            result = self._safe_integrate(self.function_horizontal_area_2, b_d, b_f, args=[x])
            result += b_d * (self.a2 - self.a1)
            return result * 2 * self.diameter ** 2
        else:
            result = self._safe_integrate(self.function_horizontal_area_2, 0, b_f, args=[x])
            return result * 2 * self.diameter ** 2

    def function_horizontal_area_2(self, b: float, d) -> float:
        d = d[0]
        return sqrt(self.fk ** 2 - ((1 / 2 - self.fk) - sqrt(b ** 2 + (1 / 2 - d) ** 2)) ** 2)

    def horizontal_area_1(self, x: float) -> float:
        p = sqrt(self.fd ** 2 - (1 / 2 - x) ** 2)
        if (x > 1 / 2 - self.b1) & (x < 1 / 2 + self.b1):
            return self.diameter ** 2 * (p ** 2 * acos((self.fd - self.a1) / p) - (self.fd - self.a1) * sqrt(
                p ** 2 - (self.fd - self.a1) ** 2))
        else:
            return 0

    def vertical_bottom_fd_head_wetted_area(self, value: float) -> float:
        wetted_area = 0.0
        if value <= 0.0:  # if h =0 then return 0.0
            return 0.0
        else:
            a = min(value / self.diameter, self.a2)
            wetted_area += self.vertical_surface_area_1(a)
            wetted_area += self.vertical_surface_area_2(a)
            return wetted_area

    def vertical_top_fd_head_wetted_area(self, value: float) -> float:
        if value <= self.bottom_head_distance + self.length:  # if h =0 then return 0.0
            return 0.0
        else:
            value = self.total_height - min(value, self.total_height)
            sa1 = self.vertical_bottom_fd_head_wetted_area(self.top_head_distance)
            sa2 = self.vertical_bottom_fd_head_wetted_area(value)
            return sa1 - sa2

    def horizontal_surface_area_1(self, delta: float) -> float:
        if delta <= 1 / 2 - self.b1:
            return 0.0
        elif delta < 1 / 2:
            a0 = self.fd - sqrt(self.fd ** 2 - (1 / 2 - delta) ** 2)
            result = self._safe_integrate(self.function_horizontal_surface_area_1, a0, self.a1, args=[delta])
            return result
        elif delta < 1 / 2 + self.b1:
            a0 = self.fd - sqrt(self.fd ** 2 - (1 / 2 - (1 - delta)) ** 2)
            result = self._safe_integrate(self.function_horizontal_surface_area_1, a0, self.a1, args=[delta])
            return result + self.vertical_surface_area_1(a0)
        else:
            return 2 * pi * self.diameter ** 2 * self.fd * self.a1

    def function_horizontal_surface_area_1(self, x, delta) -> float:
        delta = delta[0]
        beta = self.fd * ((1 / 2 - self.fk) / (self.fd - self.fk))
        a_cos = 1 if (delta == 0.5) & (beta == 0.0) else acos((1 / 2 - delta) / beta)
        return 2 * self.diameter ** 2 * self.fd * a_cos + x * 0

    def horizontal_surface_area_2(self, delta: float) -> float:
        if delta < 1 / 2 - self.b1:
            a0 = self.a2 - sqrt(self.fk ** 2 - (self.fk - delta) ** 2)
            result = self._safe_integrate(self.function_horizontal_surface_area_2, a0, self.a2, args=[delta])
            return result
        elif delta < 1 / 2 + self.b1:
            a0 = self.a1
            result = self._safe_integrate(self.function_horizontal_surface_area_2, a0, self.a2, args=[delta])
            return result
        else:
            a0 = self.a2 - sqrt(self.fk ** 2 - (self.fk - (1 - delta)) ** 2)
            result = self._safe_integrate(self.function_horizontal_surface_area_2, a0, self.a2, args=[delta])
            return self.vertical_surface_area_2(a0) + result

    def function_horizontal_surface_area_2(self, x, delta) -> float:
        delta = delta[0]
        beta = (1 / 2 - self.fk) + sqrt(self.fk ** 2 - (x - self.a2) ** 2)
        return 2 * self.diameter ** 2 * self.fk * beta * acos((1 / 2 - min(delta, 1 / 2 + beta)) / beta) / sqrt(
            self.fk * self.fk - (x - self.a2) ** 2)

    def vertical_surface_area_1(self, a: float) -> float:
        a = min(a, self.a1)
        return 0.0 if a < 0 else 2 * pi * self.diameter ** 2 * self.fd * a

    def vertical_surface_area_2(self, a: float) -> float:
        if a < self.a1:
            return 0.0
        else:
            a = min(a, self.a2)
            return 2 * pi * self.diameter ** 2 * self.fk * (a - self.a1 + (1 / 2 - self.fk) * (
                    asin((a - self.a2) / self.fk) - asin((self.a1 - self.a2) / self.fk)))

    def vertical_surface_area_3(self, a: float) -> float:
        if a <= self.a2:
            return 0.0
        else:
            a = min(a, self.a3)
            return pi * self.diameter ** 2 * (a - self.a2)

    def vertical_surface_area_4(self, a: float) -> float:
        if a < self.a3:
            return 0.0
        else:
            a = min(a, self.a4)
            s4 = self.vertical_surface_area_2(a)
            return s4 + 2 * pi * self.diameter ** 2 * self.fk * (self.a5 - a - self.a1 + (1 / 2 - self.fk) * (
                    asin((self.a5 - a - self.a2) / self.fk) - asin((self.a1 - self.a2) / self.fk)))

    def vertical_surface_area_5(self, a: float) -> float:
        if a < self.a4:
            return 0.0
        else:
            s5 = self.vertical_surface_area_1(self.a1)
            return s5 - 2 * pi * self.diameter ** 2 * self.fd * (self.a5 - a)