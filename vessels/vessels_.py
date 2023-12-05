from math import pi, sqrt, acos, asin, acosh


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
            volume.append(self.liquid_volume(height[-1] * total_height)/total_volume)
            wetted_area.append(self.wetted_area(height[-1] * total_height)/total_area)
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