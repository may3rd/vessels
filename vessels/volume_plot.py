from matplotlib import pylab

if __name__ == "__main__":
    class_names = ['VerticalFlatVessels', 'VerticalEllipticalVessels',
                   'VerticalHemiSphericalVessels', 'VerticalToriSphericalVessels',
                   'VerticalConicalVessels', 'VerticalFlattedTanks',
                   'VerticalEllipticalTanks', 'VerticalHemiSphericalTanks',
                   'VerticalToriSphericalTanks', 'VerticalConicalTanks',
                   'HorizontalFlatVessels', 'HorizontalEllipticalVessels',
                   'HorizontalHemiSphericalVessels', 'HorizontalToriSphericalVessels',
                   'HorizontalConicalVessels', 'SphericalTanks']
    module = __import__("_VESSEL")
    class_ = getattr(module, class_names[0])
    vessel = class_()
    vessel.diameter = 4
    vessel.length = 9
    # vessel.head_distance = 2
    vessel.liquid_level = 1.5
    vessel.high_liquid_level = 3
    vessel.low_liquid_level = 1
    points = 50

    print(vessel.head_distance)
    print(vessel)

    x, y, z = vessel.create_table(points)

    pylab.xlim(0, 1)
    pylab.ylim(0, 1)
    pylab.xlabel('Height')
    pylab.ylabel('Volume and Wetted Area')
    pylab.title('Vessel volume vs Height')
    pylab.plot(x, y, label='Volume')
    pylab.plot(x, z, label='Wetted Area')
    pylab.grid()
    pylab.legend()
    pylab.show()
