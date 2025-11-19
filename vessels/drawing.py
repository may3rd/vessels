import math

import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Arc, Circle

from .vessels import Vessels
from .vertical_flat_vessels import VerticalFlatVessels
from .horizontal_flat_vessels import HorizontalFlatVessels
from .vertical_hemispherical_vessels import VerticalHemiSphericalVessels
from .horizontal_hemispherical_vessels import HorizontalHemiSphericalVessels
from .vertical_elliptical_vessels import VerticalEllipticalVessels
from .horizontal_elliptical_vessels import HorizontalEllipticalVessels
from .vertical_conical_vessels import VerticalConicalVessels
from .horizontal_conical_vessels import HorizontalConicalVessels
from .vertical_torispherical_vessels import VerticalToriSphericalVessels
from .horizontal_torishperical_vessels import HorizontalToriSphericalVessels
from .spherical_tanks import SphericalTanks


def _arc_points(cx, cy, radius, start_deg, end_deg, steps=30):
    if radius <= 0:
        return [], []
    if steps < 2:
        steps = 2
    delta = end_deg - start_deg
    if abs(delta) > 180:
        if delta > 0:
            start_deg += 360
        else:
            end_deg += 360
    angles = [
        math.radians(start_deg + (end_deg - start_deg) * i / (steps - 1))
        for i in range(steps)
    ]
    xs = [cx + radius * math.cos(angle) for angle in angles]
    ys = [cy + radius * math.sin(angle) for angle in angles]
    return xs, ys


def _circle_intersection(center1, radius1, center2, radius2, epsilon=1e-9):
    x1, y1 = center1
    x2, y2 = center2
    dx = x2 - x1
    dy = y2 - y1
    dist = math.hypot(dx, dy)
    if dist < epsilon or dist > radius1 + radius2 + epsilon or dist < abs(radius1 - radius2) - epsilon:
        return None
    a = (radius1 ** 2 - radius2 ** 2 + dist ** 2) / (2 * dist)
    h_sq = radius1 ** 2 - a ** 2
    if h_sq < 0:
        h_sq = 0
    h = math.sqrt(h_sq)
    x3 = x1 + a * dx / dist
    y3 = y1 + a * dy / dist
    rx = -dy * (h / dist)
    ry = dx * (h / dist)
    points = [
        (x3 + rx, y3 + ry),
        (x3 - rx, y3 - ry),
    ]
    points.sort(key=lambda p: p[0], reverse=True)
    return points[0]


def _torispherical_profile_points(vessel, steps_knuckle=30, steps_dish=60):
    d = vessel.diameter
    head_depth = vessel.head_distance
    dish_radius = getattr(vessel, "fd", 0.0) * d
    knuckle_radius = getattr(vessel, "fk", 0.0) * d
    if min(d, head_depth, dish_radius, knuckle_radius) <= 0:
        return [], []
    dish_center_y = dish_radius - head_depth
    knuckle_center_offset = d / 2 - knuckle_radius
    intersection = _circle_intersection(
        (0.0, dish_center_y), dish_radius, (knuckle_center_offset, 0.0), knuckle_radius
    )
    if not intersection:
        return [], []
    xi, yi = intersection
    right_knuckle_end = math.degrees(
        math.atan2(yi, xi - knuckle_center_offset)
    )
    right_dish_start = math.degrees(
        math.atan2(yi - dish_center_y, xi)
    )
    right_dish_end = math.degrees(
        math.atan2(yi - dish_center_y, -xi)
    )
    left_knuckle_start = math.degrees(
        math.atan2(yi, -xi + knuckle_center_offset)
    )
    rk_x, rk_y = _arc_points(
        knuckle_center_offset, 0.0, knuckle_radius, 0.0, right_knuckle_end, steps_knuckle
    )
    dish_x, dish_y = _arc_points(
        0.0, dish_center_y, dish_radius, right_dish_start, right_dish_end, steps_dish
    )
    lk_x, lk_y = _arc_points(
        -knuckle_center_offset, 0.0, knuckle_radius, left_knuckle_start, 180.0, steps_knuckle
    )
    if not rk_x or not dish_x or not lk_x:
        return [], []
    points_x = rk_x
    points_y = rk_y
    points_x.extend(dish_x[1:])
    points_y.extend(dish_y[1:])
    points_x.extend(lk_x[1:])
    points_y.extend(lk_y[1:])
    return points_x, points_y


def _head_distances(vessel):
    bottom = getattr(vessel, "bottom_head_distance", getattr(vessel, "head_distance", 0.0))
    top = getattr(vessel, "top_head_distance", getattr(vessel, "head_distance", 0.0))
    return bottom, top

def _draw_vertical_shell(ax, vessel):
    shell = Rectangle((-vessel.diameter / 2, 0), vessel.diameter, vessel.length, edgecolor='black', facecolor='none')
    ax.add_patch(shell)

def _draw_horizontal_shell(ax, vessel):
    shell = Rectangle((0, -vessel.diameter / 2), vessel.length, vessel.diameter, edgecolor='black', facecolor='none')
    ax.add_patch(shell)

def _draw_vertical_flat_heads(ax, vessel):
    d = vessel.diameter
    # Bottom head
    ax.plot([-d / 2, d / 2], [0, 0], 'k-')
    # Top head
    ax.plot([-d / 2, d / 2], [vessel.length, vessel.length], 'k-')

def _draw_horizontal_flat_heads(ax, vessel):
    d = vessel.diameter
    # Left head
    ax.plot([0, 0], [-d / 2, d / 2], 'k-')
    # Right head
    ax.plot([vessel.length, vessel.length], [-d / 2, d / 2], 'k-')

def _draw_vertical_hemispherical_heads(ax, vessel):
    d = vessel.diameter
    bottom_h, top_h = _head_distances(vessel)
    if bottom_h > 0:
        ax.add_patch(Arc((0, 0), d, d, theta1=180, theta2=360, edgecolor='black'))
    else:
        ax.plot([-d / 2, d / 2], [0, 0], 'k-')
    if top_h > 0:
        ax.add_patch(Arc((0, vessel.length), d, d, theta1=0, theta2=180, edgecolor='black'))
    else:
        ax.plot([-d / 2, d / 2], [vessel.length, vessel.length], 'k-')

def _draw_horizontal_hemispherical_heads(ax, vessel):
    d = vessel.diameter
    # Left head
    ax.add_patch(Arc((0, 0), d, d, theta1=90, theta2=270, edgecolor='black'))
    # Right head
    ax.add_patch(Arc((vessel.length, 0), d, d, theta1=270, theta2=450, edgecolor='black'))

def _draw_vertical_elliptical_heads(ax, vessel):
    d = vessel.diameter
    bottom_h, top_h = _head_distances(vessel)
    if bottom_h > 0:
        ax.add_patch(Arc((0, 0), d, bottom_h * 2, theta1=180, theta2=360, edgecolor='black'))
    else:
        ax.plot([-d / 2, d / 2], [0, 0], 'k-')
    if top_h > 0:
        ax.add_patch(Arc((0, vessel.length), d, top_h * 2, theta1=0, theta2=180, edgecolor='black'))
    else:
        ax.plot([-d / 2, d / 2], [vessel.length, vessel.length], 'k-')

def _draw_horizontal_elliptical_heads(ax, vessel):
    d = vessel.diameter
    h = vessel.head_distance
    # Left head
    ax.add_patch(Arc((0, 0), h * 2, d, theta1=90, theta2=270, edgecolor='black'))
    # Right head
    ax.add_patch(Arc((vessel.length, 0), h * 2, d, theta1=270, theta2=450, edgecolor='black'))

def _draw_vertical_conical_heads(ax, vessel):
    d = vessel.diameter
    bottom_h, top_h = _head_distances(vessel)
    if bottom_h > 0:
        ax.plot([-d/2, 0], [0, -bottom_h], 'k-')
        ax.plot([d/2, 0], [0, -bottom_h], 'k-')
    else:
        ax.plot([-d / 2, d / 2], [0, 0], 'k-')
    if top_h > 0:
        ax.plot([-d/2, 0], [vessel.length, vessel.length + top_h], 'k-')
        ax.plot([d/2, 0], [vessel.length, vessel.length + top_h], 'k-')
    else:
        ax.plot([-d / 2, d / 2], [vessel.length, vessel.length], 'k-')

def _draw_horizontal_conical_heads(ax, vessel):
    d = vessel.diameter
    h = vessel.head_distance
    # Left head
    ax.plot([0, -h], [-d/2, 0], 'k-')
    ax.plot([0, -h], [d/2, 0], 'k-')
    # Right head
    ax.plot([vessel.length, vessel.length + h], [-d/2, 0], 'k-')
    ax.plot([vessel.length, vessel.length + h], [d/2, 0], 'k-')

def _draw_vertical_torispherical_heads(ax, vessel):
    xs, ys = _torispherical_profile_points(vessel)
    if not xs:
        return
    bottom_h, top_h = _head_distances(vessel)
    d = vessel.diameter
    if bottom_h > 0:
        ax.plot(xs, ys, 'k-')
    else:
        ax.plot([-d / 2, d / 2], [0, 0], 'k-')
    if top_h > 0:
        mirrored_y = [vessel.length - y for y in ys]
        ax.plot(xs, mirrored_y, 'k-')
    else:
        ax.plot([-d / 2, d / 2], [vessel.length, vessel.length], 'k-')


def _draw_horizontal_torispherical_heads(ax, vessel):
    xs, ys = _torispherical_profile_points(vessel)
    if not xs:
        return
    left_x = ys
    left_y = xs
    ax.plot(left_x, left_y, 'k-')
    right_x = [vessel.length - y for y in ys]
    ax.plot(right_x, left_y, 'k-')


def _draw_spherical(ax, vessel):
    radius = vessel.diameter / 2
    sphere = Circle((0, radius), radius, edgecolor='black', facecolor='none')
    ax.add_patch(sphere)


def draw_vessel(vessel: Vessels, output_path: str):
    """
    Draws a 2D cross-section of a vessel and saves it to a file.

    Args:
        vessel (Vessels): The vessel object to draw.
        output_path (str): The path to save the output image (e.g., 'vessel.svg').
    """
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.set_aspect('equal')

    is_horizontal = "Horizontal" in vessel.vessels_type

    draw_rules = [
        (VerticalHemiSphericalVessels, False, _draw_vertical_shell, _draw_vertical_hemispherical_heads),
        (VerticalEllipticalVessels, False, _draw_vertical_shell, _draw_vertical_elliptical_heads),
        (VerticalToriSphericalVessels, False, _draw_vertical_shell, _draw_vertical_torispherical_heads),
        (VerticalConicalVessels, False, _draw_vertical_shell, _draw_vertical_conical_heads),
        (VerticalFlatVessels, False, _draw_vertical_shell, _draw_vertical_flat_heads),
        (HorizontalHemiSphericalVessels, True, _draw_horizontal_shell, _draw_horizontal_hemispherical_heads),
        (HorizontalEllipticalVessels, True, _draw_horizontal_shell, _draw_horizontal_elliptical_heads),
        (HorizontalToriSphericalVessels, True, _draw_horizontal_shell, _draw_horizontal_torispherical_heads),
        (HorizontalConicalVessels, True, _draw_horizontal_shell, _draw_horizontal_conical_heads),
        (HorizontalFlatVessels, True, _draw_horizontal_shell, _draw_horizontal_flat_heads),
        (SphericalTanks, None, _draw_spherical, None),
    ]

    draw_shell_func = None
    draw_head_func = None
    for vessel_class, orientation_flag, shell_func, head_func in draw_rules:
        if isinstance(vessel, vessel_class):
            if orientation_flag is None or orientation_flag == is_horizontal:
                draw_shell_func = shell_func
                draw_head_func = head_func
                break

    if draw_shell_func:
        draw_shell_func(ax, vessel)
    else:
        default_shell = _draw_horizontal_shell if is_horizontal else _draw_vertical_shell
        default_shell(ax, vessel)

    if draw_head_func:
        draw_head_func(ax, vessel)
    elif draw_shell_func is None:
        default_heads = _draw_horizontal_flat_heads if is_horizontal else _draw_vertical_flat_heads
        default_heads(ax, vessel)

    if isinstance(vessel, SphericalTanks):
        radius = vessel.diameter / 2
        ax.set_xlim(-radius - 0.5, radius + 0.5)
        ax.set_ylim(-0.5, vessel.diameter + 0.5)
    elif is_horizontal:
        ax.set_xlim(-vessel.head_distance - 0.5, vessel.length + vessel.head_distance + 0.5)
        ax.set_ylim(-vessel.diameter / 2 - 0.5, vessel.diameter / 2 + 0.5)
    else:  # Vertical
        ax.set_xlim(-vessel.diameter / 2 - 1.5, vessel.diameter / 2 + 1.5)
        ax.set_ylim(-vessel.head_distance - 0.5, vessel.length + vessel.head_distance + 0.5)

    ax.set_title(vessel.vessels_type)
    ax.grid(True, linestyle='--', alpha=0.6)
    plt.savefig(output_path)
    plt.close(fig)
