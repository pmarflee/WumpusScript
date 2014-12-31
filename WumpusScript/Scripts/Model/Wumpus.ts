import Hazard = require("./Hazard")
import HazardType = require("./HazardType")

class Wumpus extends Hazard {
    constructor() {
        super(HazardType.Wumpus);
    }
}

export = Wumpus
