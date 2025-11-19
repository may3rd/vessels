import pytest
from vessels.vertical_flat_vessels import VerticalFlatVessels

def test_vertical_flat_vessel_creation():
    """Tests the creation of a VerticalFlatVessels object."""
    vessel = VerticalFlatVessels(input_diameter=2.0, input_length=3.0)
    assert vessel.diameter == 2.0
    assert vessel.length == 3.0
