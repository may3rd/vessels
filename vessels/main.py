"""

"""

# import vessels


def select_vessel_orientation():
    while True:
        vessels_orient = input('Select vessel orientation ([V]ertical, [H]orizontal, [S]pherical): ')
        if vessels_orient in ['v', 'V', 'h', 'H', 's', 'S']:
            break

    return vessels_orient


def tank_or_vessel():
    while True:
        is_vessel = input('[V]essel or [T]ank: ')
        if is_vessel in ['v', 'V', 't', 'T']:
            break

    return is_vessel


def select_head_type():
    while True:
        h_type = input('Select head type, [E]lliptical, [H]emispherical, [T]orispherical, [C]onical, [F]lat: ')
        if h_type in ['e', 'E', 'h', 'H', 't', 'T', 'c', 'C', 'f', 'F']:
            break

    return h_type


if __name__ == '__main__':
    module = __import__("vessels")
    vessel_orient = select_vessel_orientation()

    if vessel_orient in ['v', 'V', 'h', 'H']:
        tank_vessel = tank_or_vessel()
        head_type = select_head_type()
        vessel_class = 'Vertical' if vessel_orient in ['v', 'V'] else 'Horizontal'
        if head_type in ['e', 'E']:
            vessel_class += 'Elliptical'
        elif head_type in ['h', 'H']:
            vessel_class += 'Hemispherical'
        elif head_type in ['t', 'T']:
            vessel_class += 'Torispherical'
        elif head_type in ['f', 'F']:
            vessel_class += 'Flat'
        else:
            vessel_class += 'Conical'

        if tank_vessel in ['v', 'V']:
            vessel_class += 'Vessels'
        else:
            vessel_class += 'Tanks'

        class_ = getattr(module, vessel_class)
        vessel = class_()
        print(vessel)
    elif vessel_orient in ['s', 'S']:
        class_ = getattr(module, 'SphericalTanks')
        vessel = class_()
        print(vessel)
