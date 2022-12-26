"""Chemical Engineering Design Library. Utilities for process modeling.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

This module contains functionality for calculating parameters about different
geometrical forms that come up in engineering practice.

<may3rd@gmail.com>

"""

from math import pi, sqrt, acos, asin, acosh
import scipy.integrate as integrate

__all__ = ['Vessels', 'VerticalFlatVessels', 'VerticalEllipticalVessels', 'VerticalHemiSphericalVessels',
           'VerticalToriSphericalVessels', 'VerticalConicalVessels', 'VerticalFlattedTanks', 'VerticalEllipticalTanks',
           'VerticalHemiSphericalTanks', 'VerticalToriSphericalTanks', 'VerticalConicalTanks', 'HorizontalFlatVessels',
           'HorizontalEllipticalVessels', 'HorizontalHemiSphericalVessels', 'HorizontalToriSphericalVessels',
           'HorizontalConicalVessels', 'SphericalTanks']


class Vessels:
    """The skeleton class for tank and vessel classes.
    """
    vessels_type: str
    _diameter: float
    _length: float
    _head_distance: float
    _high_liquid_level: float
    _low_liquid_level: float
    _tangent_height: float
    _liquid_level: float
    _overflow_flag: bool
    _overflow_value: float

    def __init__(self) -> None:
        self._diameter = 0.0
        self._length = 0.0
        self._head_distance = 0.0
        self._high_liquid_level = 0.0
        self._low_liquid_level = 0.0
        self._liquid_level = 0.0
        self._overflow_flag = False

    def __str__(self) -> str:
        return_string = f"vessel type     : {self.vessels_type}"
        return_string += f"\ntotal height : {self.total_height:.3f} m"
        return_string += f"\n-- volumes --"
        return_string += f"\nhead volume            : {self.head_volume:.2f} m3"
        return_string += f"\nshell volume           : {self.shell_volume:.2f} m3"
        return_string += f"\ntotal volume           : {self.total_volume:.2f} m3"
        return_string += f"\neff. volume            : {self.effective_volume:.2f} m3"
        return_string += f"\nefficiency volume      : {self.efficiency_volume:.2f} %"
        return_string += f"\ntangent volume         : {self.tangent_volume:.2f} m3"
        return_string += f"\nworking volume         : {self.working_volume:.2f} m3"
        return_string += f"\noverflow volume        : {self.overflow_volume:.2f} m3"
        return_string += f"\nliquid volume at {self.liquid_level:.1f} m : "
        return_string += f"{self.liquid_volume(self.liquid_level):.2f} m3"
        return_string += f"\n-- surface area --"
        return_string += f"\nheads surface area  : {self.head_surface_area:.2f} m2"
        return_string += f"\nshell surface area  : {self.shell_surface_area:.2f} m2"
        return_string += f"\ntotal surface area  : {self.total_surface_area:.2f} m2"
        return_string += f"\nwetted surface area : {self.wetted_area(self.liquid_level):.2f} m2"
        return return_string

    def create_table(self, n: int = 10):
        """Create table of height, volume, wetted area from bottom to total height of the vessel

        Parameters
            n : int
                number of points in the table, excluding 0.0, default 10

        Returns
            height : float
                list of height
            volume : float
                list of volumes
            wetted area : float
                list of wetted areas
        """
        height = []
        volume = []
        wetted_area = []
        total_height = self.total_height
        total_volume = self.total_volume
        total_area = self.total_surface_area
        for index in range(n + 1):
            height.append(index / n)
            volume.append(self.liquid_volume(height[-1] * total_height )/total_volume)
            wetted_area.append(self.wetted_area(height[-1] * total_height )/total_area)
        return height, volume, wetted_area

    @property
    def diameter(self) -> float:
        return self._diameter

    @diameter.setter
    def diameter(self, value: float):
        self._diameter = value

    @property
    def length(self) -> float:
        return self._length

    @length.setter
    def length(self, value: float):
        self._length = value

    @property
    def high_liquid_level(self) -> float:
        return self._high_liquid_level

    @high_liquid_level.setter
    def high_liquid_level(self, value: float):
        self._high_liquid_level = value

    @property
    def low_liquid_level(self) -> float:
        return self._low_liquid_level

    @low_liquid_level.setter
    def low_liquid_level(self, value: float):
        self._low_liquid_level = value

    @property
    def liquid_level(self) -> float:
        return self._liquid_level

    @liquid_level.setter
    def liquid_level(self, value: float):
        self._liquid_level = value

    @property
    def overflow_flag(self) -> bool:
        return self._overflow_flag

    @overflow_flag.setter
    def overflow_flag(self, value: bool):
        self._overflow_flag = value

    @property
    def overflow_volume(self) -> float:
        return self.total_volume * 0.02 if self._overflow_flag else 0.0

    @property
    def head_distance(self) -> float:
        return self._head_distance

    @head_distance.setter
    def head_distance(self, value: float):
        self._head_distance = value

    @property
    def total_height(self) -> float:
        return 0.0

    @property
    def tangent_height(self) -> float:
        return 0.0

    @property
    def head_volume(self) -> float:
        return 0.0

    @property
    def shell_volume(self) -> float:
        return 0.0

    @property
    def total_volume(self) -> float:
        return self.shell_volume + self.head_volume

    @property
    def effective_volume(self) -> float:
        return self.liquid_volume(self.high_liquid_level)

    @property
    def efficiency_volume(self) -> float:
        return self.effective_volume / self.total_volume * 100.0

    @property
    def working_volume(self) -> float:
        return 0.0

    @property
    def tangent_volume(self) -> float:
        return 0.0

    @property
    def head_surface_area(self) -> float:
        return 0.0

    @property
    def shell_surface_area(self) -> float:
        return 0.0

    @property
    def total_surface_area(self) -> float:
        return self.shell_surface_area + self.head_surface_area

    def head_liquid_volume(self, value: float) -> float:
        return 0.0

    def shell_liquid_volume(self, value: float) -> float:
        return 0.0

    def liquid_volume(self, value: float) -> float:
        return self.shell_liquid_volume(value) + self.head_liquid_volume(value)

    def head_wetted_area(self, value: float) -> float:
        return 0.0

    def shell_wetted_area(self, value: float) -> float:
        return 0.0

    def wetted_area(self, value: float) -> float:
        return self.shell_wetted_area(value) + self.head_wetted_area(value)

    def vertical_cone_surface_area(self, value: float) -> float:
        if (value <= 0.0) | (self.head_distance <= 0.0):
            return 0.0
        else:
            value = min(value, self._head_distance)
            r = (value / self.head_distance) * self.diameter / 2
            return pi * r * sqrt(value ** 2 + r ** 2)


class VerticalFlatVessels(Vessels):
    """Basic class for representing vertical flat vessels

    """
    vessels_type = 'Vertical Flat Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9) -> None:
        super().__init__()
        self._diameter = input_diameter
        self._length = input_length

    @property
    def head_distance(self) -> float:
        return 0.0

    @property
    def bottom_head_distance(self) -> float:
        return self.head_distance

    @property
    def top_head_distance(self) -> float:
        return self.head_distance

    @property
    def total_height(self) -> float:
        return self.length + self.bottom_head_distance + self.top_head_distance

    @property
    def tangent_height(self) -> float:
        return self.length + self.bottom_head_distance

    @property
    def head_volume(self) -> float:
        return self.bottom_head_liquid_volume(self.total_height) + self.top_head_liquid_volume(self.total_height)

    @property
    def shell_volume(self) -> float:
        return pi * self.diameter ** 2 / 4 * self.length

    @property
    def effective_volume(self) -> float:
        return self.liquid_volume(self.high_liquid_level + self.bottom_head_distance)

    @property
    def tangent_volume(self) -> float:
        return self.liquid_volume(self.tangent_height)

    @property
    def working_volume(self) -> float:
        return pi * self.diameter ** 2 / 4 * (self.high_liquid_level - self.low_liquid_level)

    @property
    def head_surface_area(self) -> float:
        return self.bottom_head_wetted_area(self.total_height) + self.top_head_wetted_area(self.total_height)

    @property
    def shell_surface_area(self) -> float:
        return pi * self.diameter * self.length

    def bottom_head_liquid_volume(self, value: float) -> float:
        return 0.0

    def top_head_liquid_volume(self, value: float) -> float:
        return 0.0

    def head_liquid_volume(self, value: float) -> float:
        return self.bottom_head_liquid_volume(value) + self.top_head_liquid_volume(value)

    def shell_liquid_volume(self, value: float) -> float:
        if value <= self.bottom_head_distance:
            return 0.0
        elif value <= self.bottom_head_distance + self.length:
            return pi * self.diameter ** 2 / 4 * (value - self.bottom_head_distance)
        else:
            return pi * self.diameter ** 2 / 4 * self.length

    def bottom_head_wetted_area(self, value: float) -> float:
        return 0.0 if value <= 0 else pi * self.diameter ** 2 / 4

    def top_head_wetted_area(self, value: float) -> float:
        return 0.0 if value < self.total_height else pi * self.diameter ** 2 / 4

    def shell_wetted_area(self, value: float) -> float:
        if value <= self.bottom_head_distance:
            return 0.0
        elif value < self.bottom_head_distance + self.length:
            return pi * self.diameter * (value - self.bottom_head_distance)
        else:
            return pi * self.diameter * self.length

    def head_wetted_area(self, value: float) -> float:
        return self.bottom_head_wetted_area(value) + self.top_head_wetted_area(value)


class VerticalToriSphericalVessels(VerticalFlatVessels):
    vessels_type = 'Vertical ToriSpherical Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9, fd: float = 1.0, fk: float = 0.06) -> None:
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

    def vertical_bottom_fd_head_volume(self, value: float) -> float:
        return 0.0 if value < 0 else self.diameter * integrate.quad(
            self.vertical_fd_head_surface_area, 0, min(value / self.diameter, self.a2))[0]

    def vertical_top_fd_head_volume(self, value: float) -> float:
        if value <= self.bottom_head_distance + self.length:
            return 0.0
        else:
            value = self.total_height - value
            a = value / self.diameter
            head_volume = integrate.quad(self.vertical_fd_head_surface_area, 0, self.a2)[0]
            sub_volume = integrate.quad(self.vertical_fd_head_surface_area, 0, a)[0]
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
            result = integrate.quad(self.function_horizontal_area_2, b_d, b_f, args=[x])[0]
            result += b_d * (self.a2 - self.a1)
            return result * 2 * self.diameter ** 2
        else:
            result = integrate.quad(self.function_horizontal_area_2, 0, b_f, args=[x])[0]
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
            result = integrate.quad(self.function_horizontal_surface_area_1, a0, self.a1, args=[delta])[0]
            return result
        elif delta < 1 / 2 + self.b1:
            a0 = self.fd - sqrt(self.fd ** 2 - (1 / 2 - (1 - delta)) ** 2)
            result = integrate.quad(self.function_horizontal_surface_area_1, a0, self.a1, args=[delta])[0]
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
            result = integrate.quad(self.function_horizontal_surface_area_2, a0, self.a2, args=[delta])[0]
            return result
        elif delta < 1 / 2 + self.b1:
            a0 = self.a1
            result = integrate.quad(self.function_horizontal_surface_area_2, a0, self.a2, args=[delta])[0]
            return result
        else:
            a0 = self.a2 - sqrt(self.fk ** 2 - (self.fk - (1 - delta)) ** 2)
            result = integrate.quad(self.function_horizontal_surface_area_2, a0, self.a2, args=[delta])[0]
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


class VerticalEllipticalVessels(VerticalToriSphericalVessels):
    vessels_type = 'Vertical Elliptical Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9,
                 fd: float = 0.9045, fk: float = 0.1727) -> None:
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


class VerticalHemiSphericalVessels(VerticalEllipticalVessels):
    vessels_type = 'Vertical HemiSpherical Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9) -> None:
        super().__init__(input_diameter, input_length)

    @property
    def head_distance(self) -> float:
        return self.diameter / 2

    def bottom_head_wetted_area(self, value: float) -> float:
        return 0.0 if value < 0 else pi * self.diameter * min(value, self.bottom_head_distance)

    def top_head_wetted_area(self, value: float) -> float:
        return 0.0 if value < self.tangent_height else pi * self.diameter * (
                self.top_head_distance - (self.total_height - min(value, self.total_height)))


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


class VerticalFlattedTanks(VerticalFlatVessels):
    vessels_type = 'Vertical Flat Tanks'

    def __init__(self, input_diameter: float = 3, input_length: float = 9) -> None:
        super().__init__(input_diameter, input_length)
        return


class VerticalToriSphericalTanks(VerticalToriSphericalVessels):
    vessels_type = 'Vertical ToriSpherical Tanks'

    def __init__(self, input_diameter: float = 3, input_length: float = 9, fd: float = 1.0, fk: float = 0.06) -> None:
        super().__init__(input_diameter, input_length, fd, fk)

    @property
    def bottom_head_distance(self) -> float:
        return 0.0

    def bottom_head_liquid_volume(self, value: float) -> float:
        return 0.0

    def bottom_head_wetted_area(self, value: float) -> float:
        return 0.0 if value <= 0 else pi * self.diameter ** 2 / 4


class VerticalEllipticalTanks(VerticalEllipticalVessels):
    vessels_type = 'Vertical Elliptical Tanks'

    def __init__(self, input_diameter: float = 3, input_length: float = 9,
                 fd: float = 0.9045, fk: float = 0.1727) -> None:
        super().__init__(input_diameter, input_length, fd, fk)

    @property
    def bottom_head_distance(self) -> float:
        return 0.0

    def bottom_head_liquid_volume(self, value: float) -> float:
        return 0.0

    def bottom_head_wetted_area(self, value: float) -> float:
        return 0.0 if value <= 0 else pi * self.diameter ** 2 / 4


class VerticalHemiSphericalTanks(VerticalHemiSphericalVessels):
    vessels_type = 'Vertical HemiSpherical Tanks'

    def __init__(self, input_diameter: float = 3, input_length: float = 9) -> None:
        super().__init__(input_diameter, input_length)

    @property
    def bottom_head_distance(self) -> float:
        return 0.0

    def bottom_head_liquid_volume(self, value: float) -> float:
        return 0.0

    def bottom_head_wetted_area(self, value: float) -> float:
        return 0.0 if value <= 0 else pi * self.diameter ** 2 / 4 * 1


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


class HorizontalEllipticalVessels(HorizontalToriSphericalVessels):
    vessels_type = 'Horizontal Elliptical Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9,
                 fd: float = 0.9045, fk: float = 0.1727) -> None:
        super().__init__(input_diameter, input_length, fd, fk)

    @property
    def head_distance(self) -> float:
        return self.diameter / 4

    def head_liquid_volume(self, value: float) -> float:
        return elliptical_head_volume(self.diameter / 2, self.head_distance, self.diameter / 2, value)


class HorizontalHemiSphericalVessels(HorizontalEllipticalVessels):
    vessels_type = 'Horizontal HemiSpherical Vessels'

    def __init__(self, input_diameter: float = 3, input_length: float = 9) -> None:
        super().__init__(input_diameter, input_length)

    @property
    def head_distance(self) -> float:
        return self.diameter / 2

    def head_wetted_area(self, value: float) -> float:
        return 0.0 if value < 0 else pi * self.diameter * value


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


if __name__ == "__main__":
    diameter = 4.0
    length = 9.0
    cHead = 2.0
    liquid_level = 1.99
    high_liquid_level = 3
    low_liquid_lever = 1

    vessels = [VerticalFlatVessels(diameter, length),  # 0 - vertical flat vessel
               VerticalToriSphericalVessels(diameter, length),  # 1 - vertical tori vessel
               VerticalEllipticalVessels(diameter, length),  # 2 - vertical elli vessel
               VerticalHemiSphericalVessels(diameter, length),  # 3 - vertical hemi vessel
               VerticalConicalVessels(diameter, length, cHead),  # 4 - vertical cone vessel
               VerticalFlattedTanks(diameter, length),  # 5 - vertical flat tank
               VerticalToriSphericalTanks(diameter, length),  # 6 - vertical tori tank
               VerticalEllipticalTanks(diameter, length),  # 7 - vertical elli tank
               VerticalHemiSphericalTanks(diameter, length),  # 8 - vertical hemi tank
               VerticalConicalTanks(diameter, length, cHead),  # 9 - vertical cone tank
               HorizontalFlatVessels(diameter, length),  # 10 - horizontal flat vessel
               HorizontalToriSphericalVessels(diameter, length),  # 11 - horizontal tori vessel
               HorizontalEllipticalVessels(diameter, length),  # 12 - horizontal elli vessel
               HorizontalHemiSphericalVessels(diameter, length),  # 13 - horizontal hemi vessel
               HorizontalConicalVessels(diameter, length, cHead),  # 14 - horizontal cone vessel
               SphericalTanks(diameter)]  # 15 - spherical tank

    vessel = vessels[4]
    vessel.high_liquid_level = high_liquid_level
    vessel.low_liquid_level = low_liquid_lever
    vessel.liquid_level = liquid_level
    vessel.overflow_flag = True
    print(vessel)
