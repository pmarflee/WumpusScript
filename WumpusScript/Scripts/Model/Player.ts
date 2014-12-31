/// <reference path="../typings/underscore/underscore.d.ts" />

import Cave = require("./Cave")
import Room = require("./Room")
import Hazard = require("./Hazard")
import HazardType = require("./HazardType")

class Player {
    private _cave: Cave;
    private _room: Room;

    constructor(cave: Cave, room: Room) {
        this._cave = cave;
        this._room = room;
    }

    get room(): Room {
        return this._room;
    }

    get senses(): Hazard[] {
        return _.reduce<number, Hazard[]>(this._room.exits,
            (state, exit) => state.concat(this._cave.rooms[exit].hazards),
            new Array<Hazard>());
    }

    canMoveToRoom(number: number) {
        return this._room.exits.indexOf(number) > -1;
    }

    moveToRoom(number: number) {
        this._room = this._cave.rooms[number];
    }
}

export = Player