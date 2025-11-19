import { VerticalTorisphericalVessel } from "./VerticalTorisphericalVessel";

const FD_ELLIP = 0.9045;
const FK_ELLIP = 0.1727;

export class VerticalEllipticalVessel extends VerticalTorisphericalVessel {
    public readonly vesselType: string = "Vertical Elliptical Vessels";

    constructor(
        diameter: number = 3,
        length: number = 9,
        fd: number = FD_ELLIP,
        fk: number = FK_ELLIP
    ) {
        super(diameter, length, fd, fk);
    }

    get headDistance(): number {
        return this.diameter / 4;
    }

    bottomHeadLiquidVolume(value: number): number {
        return value < 0
            ? 0.0
            : ellipticalHeadVolume(
                this.diameter / 2,
                this.diameter / 2,
                this.headDistance, // bottom head distance is same as headDistance
                Math.min(value, this.headDistance)
            );
    }

    topHeadLiquidVolume(value: number): number {
        if (value <= this.headDistance + this.length) {
            return 0.0;
        } else {
            const val = this.totalHeight - Math.min(value, this.totalHeight);
            const v1 = ellipticalHeadVolume(
                this.diameter / 2,
                this.diameter / 2,
                this.headDistance, // top head distance
                this.headDistance
            );
            const v2 = ellipticalHeadVolume(
                this.diameter / 2,
                this.diameter / 2,
                this.headDistance,
                val
            );
            return v1 - v2;
        }
    }
}

function ellipticalHeadVolume(
    xRadii: number,
    yRadii: number,
    zRadii: number,
    capHeight: number
): number {
    if (zRadii === 0) return 0.0;
    return (
        (Math.PI *
            xRadii *
            yRadii *
            capHeight ** 2 *
            (3 * zRadii - capHeight)) /
        (3 * zRadii ** 2)
    );
}
