export enum HazardType { Pit = 1, Bat = 2, Wumpus = 3 } 

export class Hazard {
    private _type: HazardType;

    constructor(type: HazardType) {
        this._type = type;
    }

    get type(): HazardType {
        return this._type;
    }
}

export class Pit extends Hazard {
    constructor() {
        super(HazardType.Pit);
    }
}

export class Bat extends Hazard {
    constructor() {
        super(HazardType.Bat);
    }
}

export class Wumpus extends Hazard {
    constructor() {
        super(HazardType.Wumpus);
    }
}