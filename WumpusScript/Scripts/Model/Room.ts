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

    get containsHazard(): boolean {
        return this._hazards.length > 0;
    }

    containsHazardOfType(type: Hazards.HazardType) {
        return this._hazards.some(hazard => hazard.type == type);
    }

    hasExit(number: number): boolean {
        return this._exits.indexOf(number) > -1;
    }

    addHazard(hazard: Hazards.Hazard) {
        this._hazards.push(hazard);
    }

    removeHazard(hazard: Hazards.Hazard) {
        this._hazards.splice(this._hazards.indexOf(hazard), 1);
    }
}

export = Room