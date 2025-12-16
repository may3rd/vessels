import pytest
from models.vertical_flat_vessels import VerticalFlatVessels

def test_negative_diameter_raises_error():
    """Tests that setting a negative diameter raises a ValueError."""
    vessel = VerticalFlatVessels(input_diameter=2.0, input_length=3.0)
    with pytest.raises(ValueError, match="Diameter must be positive"):
        vessel.diameter = -1.0

def test_zero_diameter_raises_error():
    """Tests that setting a zero diameter raises a ValueError."""
    vessel = VerticalFlatVessels(input_diameter=2.0, input_length=3.0)
    with pytest.raises(ValueError, match="Diameter must be positive"):
        vessel.diameter = 0.0

def test_negative_length_raises_error():
    """Tests that setting a negative length raises a ValueError."""
    vessel = VerticalFlatVessels(input_diameter=2.0, input_length=3.0)
    with pytest.raises(ValueError, match="Length must be positive"):
        vessel.length = -1.0

def test_zero_length_raises_error():
    """Tests that setting a zero length raises a ValueError."""
    vessel = VerticalFlatVessels(input_diameter=2.0, input_length=3.0)
    with pytest.raises(ValueError, match="Length must be positive"):
        vessel.length = 0.0

def test_negative_liquid_level_raises_error():
    """Tests that setting a negative liquid level raises a ValueError."""
    vessel = VerticalFlatVessels(input_diameter=2.0, input_length=3.0)
    with pytest.raises(ValueError, match="Liquid level must be non-negative"):
        vessel.liquid_level = -1.0
