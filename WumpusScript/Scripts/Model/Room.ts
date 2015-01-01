/// <reference path="../typings/underscore/underscore.d.ts" />

import Hazards = require("./Hazards")

class Room {
    private _number: number;
    private _exits: number[];
    private _hazards: Hazards.Hazard[];

    constructor(number: number, exits: number[]) {
        this._number = number;
        this._exits = exits;
        this._hazards = new Array<Hazards.Hazard>();
    }

    get number(): number {
        return this._number;
    }

    get exits(): number[] {
        return this._exits;
    }

    get hazards(): Hazards.Hazard[] {
        return this._hazards;
    }

    hasExit(number: number): boolean {
        return this._exits.indexOf(number) > -1;
    }

    containsHazard(type: Hazards.HazardType) {
        return _.any(this._hazards, hazard => hazard.type == type);
    }

    addHazard(hazard: Hazards.Hazard) {
        this._hazards.push(hazard);
    }

    removeHazard(hazard: Hazards.Hazard) {
        this._hazards.splice(this._hazards.indexOf(hazard), 1);
    }
}

export = Room