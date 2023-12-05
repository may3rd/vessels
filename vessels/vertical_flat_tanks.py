from vertical_flat_vessels import VerticalFlatVessels

class VerticalFlattedTanks(VerticalFlatVessels):
    vessels_type = 'Vertical Flat Tanks'

    def __init__(self, input_diameter: float = 3, input_length: float = 9) -> None:
        super().__init__(input_diameter, input_length)
        return
    