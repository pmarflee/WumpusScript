import Hazard = require("./Hazard")
import HazardType = require("./HazardType")

class Pit extends Hazard {
    constructor() {
        super(HazardType.Pit);
    }
}

export = Pit