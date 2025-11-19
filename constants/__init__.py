
"""
This module contains a vendored copy of a subset of `scipy.constants`.

It is vendored to provide a consistent set of constants across scipy versions,
and to prevent the tests from failing when new CODATA formulations come out.

"""
from .constants import (
    FD_TORI,
    FK_TORI,
    FD_ELLIP,
    FK_ELLIP,
    pi
)

__all__ = [
    'FD_TORI',
    'FK_TORI',
    'FD_ELLIP',
    'FK_ELLIP',
    'pi'
]
