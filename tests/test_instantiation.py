import pytest
from models.vertical_flat_vessels import VerticalFlatVessels
from models.vertical_torispherical_vessels import VerticalToriSphericalVessels
from models.vertical_elliptical_vessels import VerticalEllipticalVessels
from models.vertical_hemispherical_vessels import VerticalHemiSphericalVessels
from models.vertical_conical_vessels import VerticalConicalVessels
from models.vertical_flat_tanks import VerticalFlatTanks
from models.vertical_torispherical_tanks import VerticalToriSphericalTanks
from models.vertical_elliptical_tanks import VerticalEllipticalTanks
from models.vertical_hemispherical_tanks import VerticalHemiSphericalTanks
from models.vertical_conical_tanks import VerticalConicalTanks
from models.horizontal_flat_vessels import HorizontalFlatVessels
from models.horizontal_torishperical_vessels import HorizontalToriSphericalVessels
from models.horizontal_elliptical_vessels import HorizontalEllipticalVessels
from models.horizontal_hemispherical_vessels import HorizontalHemiSphericalVessels
from models.horizontal_conical_vessels import HorizontalConicalVessels
from models.spherical_tanks import SphericalTanks

@pytest.mark.parametrize("vessel_class, args", [
    (VerticalFlatVessels, (2.0, 3.0)),
    (VerticalToriSphericalVessels, (2.0, 3.0)),
    (VerticalEllipticalVessels, (2.0, 3.0)),
    (VerticalHemiSphericalVessels, (2.0, 3.0)),
    (VerticalConicalVessels, (2.0, 3.0, 1.0)),
    (VerticalFlatTanks, (2.0, 3.0)),
    (VerticalToriSphericalTanks, (2.0, 3.0)),
    (VerticalEllipticalTanks, (2.0, 3.0)),
    (VerticalHemiSphericalTanks, (2.0, 3.0)),
    (VerticalConicalTanks, (2.0, 3.0, 1.0)),
    (HorizontalFlatVessels, (2.0, 3.0)),
    (HorizontalToriSphericalVessels, (2.0, 3.0)),
    (HorizontalEllipticalVessels, (2.0, 3.0)),
    (HorizontalHemiSphericalVessels, (2.0, 3.0)),
    (HorizontalConicalVessels, (2.0, 3.0, 1.0)),
    (SphericalTanks, (2.0,)),
])
def test_vessel_instantiation(vessel_class, args):
    """Tests that all vessel classes can be instantiated."""
    try:
        vessel_class(*args)
    except TypeError as e:
        pytest.fail(f"Failed to instantiate {vessel_class.__name__} with args {args}: {e}")
