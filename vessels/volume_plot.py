import pylab

if __name__ == "__main__":
    class_names = ['VerticalFlatVessels', 'VerticalEllipticalVessels',
                   'VerticalHemiSphericalVessels', 'VerticalToriSphericalVessels',
                   'VerticalConicalVessels', 'VerticalFlattedTanks',
                   'VerticalEllipticalTanks', 'VerticalHemiSphericalTanks',
                   'VerticalToriSphericalTanks', 'VerticalConicalTanks',
                   'HorizontalFlatVessels', 'HorizontalEllipticalVessels',
                   'HorizontalHemiSphericalVessels', 'HorizontalToriSphericalVessels',
                   'HorizontalConicalVessels', 'SphericalTanks']
    module = __import__("vessels")
    class_ = getattr(module, class_names[4])
    vessel = class_()
    vessel.diameter = 4
    vessel.length = 9
#    vessel.head_distance = 2
    vessel.liquid_level = 2
    vessel.high_liquid_level = 3
    vessel.low_liquid_level = 1
    x = []
    y = []
    z = []
    points = 50

    print(vessel.head_distance)
    print(vessel)

    for n in range(points + 1):
        x.append(n * vessel.total_height / points)
        y.append(vessel.liquid_volume(x[-1])/vessel.total_volume)
        z.append(vessel.wetted_area(x[-1])/vessel.total_surface_area)

    pylab.xlim(0, vessel.total_height)
    pylab.ylim(0, 1)
    pylab.xlabel('Height [$m$]')
    pylab.ylabel('Volume [$m^3$]')
    pylab.title('Vessel volume vs Height')
    pylab.plot(x, y, label='Volume')
    pylab.plot(x, z, label='Wetted Area')
    pylab.grid()
    pylab.legend()
    pylab.show()
