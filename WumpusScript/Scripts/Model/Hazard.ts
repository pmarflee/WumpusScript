import HazardType = require("./HazardType")

class Hazard {
    private _type: HazardType;

    constructor(type: HazardType) {
        this._type = type;
    }

    get type(): HazardType {
        return this._type;
    }
}

export = Hazard