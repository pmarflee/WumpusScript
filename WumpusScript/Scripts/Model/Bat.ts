import Hazard = require("./Hazard")
import HazardType = require("./HazardType")

class Bat extends Hazard {
    constructor() {
        super(HazardType.Bat);
    }
}

export = Bat
