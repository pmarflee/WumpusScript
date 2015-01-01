import Room = require("./Room")
/// <reference path="../typings/underscore/underscore.d.ts" />

import Hazards = require("./Hazards")
import Random = require("./Random")

class Cave {
    private _rooms: Room[];

    constructor() {
        var data: number[][] = [
            [1, 4, 7], [0, 2, 9], [1, 3, 11],
            [2, 4, 13], [0, 3, 5], [4, 6, 14],
            [5, 7, 16], [0, 6, 8], [7, 9, 17],
            [1, 8, 10], [9, 11, 18], [2, 10, 12],
            [11, 13, 19], [3, 12, 14], [5, 13, 15],
            [14, 16, 19], [6, 15, 17], [8, 16, 18],
            [10, 17, 19], [12, 15, 18]];
        this._rooms = data.map((exits, index) => new Room(index, exits));
    }

    get rooms(): Room[] {
        return this._rooms;
    }

    get hazards(): Hazards.Hazard[] {
        return _.reduce<Room, Hazards.Hazard[]>(this.rooms,
            (state, room) => state.concat(room.hazards),
            new Array<Hazards.Hazard>());
    }

    private addHazard(type: Hazards.HazardType) {
        Hazards.Hazard.create(type, this, Random.between(0, this.rooms.length - 1));
    }

    addHazards(type: Hazards.HazardType, number: number) {
        for (var i = 1; i <= number; i++) {
            this.addHazard(type);
        }
    }

    private getRandomRoomNumber() {
        return Math.round(Math.random() * 20);
    }
}

export = Cave