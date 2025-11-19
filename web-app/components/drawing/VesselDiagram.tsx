import React from "react";
import { Vessel } from "@/lib/vessels/Vessel";
import { VerticalFlatVessel } from "@/lib/vessels/VerticalFlatVessel";
import { VerticalTorisphericalVessel } from "@/lib/vessels/VerticalTorisphericalVessel";
import { VerticalEllipticalVessel } from "@/lib/vessels/VerticalEllipticalVessel";
import { VerticalHemisphericalVessel } from "@/lib/vessels/VerticalHemisphericalVessel";
import { VerticalConicalVessel } from "@/lib/vessels/VerticalConicalVessel";
import { HorizontalFlatVessel } from "@/lib/vessels/HorizontalFlatVessel";
import { HorizontalTorisphericalVessel } from "@/lib/vessels/HorizontalTorisphericalVessel";
import { HorizontalEllipticalVessel } from "@/lib/vessels/HorizontalEllipticalVessel";
import { HorizontalHemisphericalVessel } from "@/lib/vessels/HorizontalHemisphericalVessel";
import { HorizontalConicalVessel } from "@/lib/vessels/HorizontalConicalVessel";
import { SphericalTank } from "@/lib/vessels/SphericalTank";

import { VerticalFlatVesselDiagram } from "./VerticalFlatVesselDiagram";
import { HorizontalVesselDiagram } from "./HorizontalVesselDiagram";
import { SphericalTankDiagram } from "./SphericalTankDiagram";
import { VerticalTorisphericalVesselDiagram } from "./VerticalTorisphericalVesselDiagram";
import { VerticalEllipticalVesselDiagram } from "./VerticalEllipticalVesselDiagram";
import { VerticalHemisphericalVesselDiagram } from "./VerticalHemisphericalVesselDiagram";
import { VerticalConicalVesselDiagram } from "./VerticalConicalVesselDiagram";

interface Props {
    vessel: Vessel;
}

export const VesselDiagram: React.FC<Props> = ({ vessel }) => {
    if (vessel instanceof VerticalHemisphericalVessel) {
        return <VerticalHemisphericalVesselDiagram vessel={vessel} />;
    }
    if (vessel instanceof VerticalEllipticalVessel) {
        return <VerticalEllipticalVesselDiagram vessel={vessel} />;
    }
    if (vessel instanceof VerticalTorisphericalVessel) {
        return <VerticalTorisphericalVesselDiagram vessel={vessel} />;
    }
    if (vessel instanceof VerticalConicalVessel) {
        return <VerticalConicalVesselDiagram vessel={vessel} />;
    }
    if (vessel instanceof VerticalFlatVessel) {
        return <VerticalFlatVesselDiagram vessel={vessel} />;
    }

    if (
        vessel instanceof HorizontalFlatVessel ||
        vessel instanceof HorizontalTorisphericalVessel ||
        vessel instanceof HorizontalEllipticalVessel ||
        vessel instanceof HorizontalHemisphericalVessel ||
        vessel instanceof HorizontalConicalVessel
    ) {
        return <HorizontalVesselDiagram vessel={vessel} />;
    }

    if (vessel instanceof SphericalTank) {
        return <SphericalTankDiagram vessel={vessel} />;
    }

    return (
        <div className="flex items-center justify-center h-full text-gray-400">
            Diagram not implemented for {vessel.vesselType}
        </div>
    );
};
