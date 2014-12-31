/// <reference path="../typings/underscore/underscore.d.ts" />

import Hazard = require("./Hazard")
import HazardType = require("./HazardType")

class Room {
    private _number: number;
    private _exits: number[];
    private _hazards: Hazard[];

    constructor(number: number, exits: number[]) {
        this._number = number;
        this._exits = exits;
        this._hazards = new Array<Hazard>();
    }

    get number(): number {
        return this._number;
    }

    get exits(): number[] {
        return this._exits;
    }

    get hazards(): Hazard[] {
        return this._hazards;
    }

    hasExit(number: number): boolean {
        return this._exits.indexOf(number) > -1;
    }

    containsHazard(type: HazardType) {
        return _.any(this._hazards, hazard => hazard.type == type);
    }
}

export = Room