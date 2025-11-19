import { VerticalFlatVessel } from "./VerticalFlatVessel";

export class VerticalFlatTank extends VerticalFlatVessel {
    public readonly vesselType: string = "Vertical Flat Tank";

    constructor(diameter: number = 3, length: number = 9) {
        super(diameter, length);
    }
}
