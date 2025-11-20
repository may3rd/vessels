import pytest
from math import pi
from vessels.vertical_flat_vessels import VerticalFlatVessels

def test_vertical_flat_vessel_creation():
    """Tests the creation of a VerticalFlatVessels object."""
    vessel = VerticalFlatVessels(input_diameter=2.0, input_length=3.0)
    assert vessel.diameter == 2.0
    assert vessel.length == 3.0


def test_surge_time_calculation():
    vessel = VerticalFlatVessels(input_diameter=2.0, input_length=3.0)
    vessel.high_liquid_level = 2.0
    vessel.low_liquid_level = 1.0

    assert vessel.surge_time(1.0) == pytest.approx(pi)


def test_surge_time_requires_positive_flow():
    vessel = VerticalFlatVessels(input_diameter=2.0, input_length=3.0)
    vessel.high_liquid_level = 1.0
    vessel.low_liquid_level = 0.0

    with pytest.raises(ValueError):
        vessel.surge_time(0.0)
