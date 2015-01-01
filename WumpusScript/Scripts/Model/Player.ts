/// <reference path="../typings/underscore/underscore.d.ts" />

import Cave = require("./Cave")
import Room = require("./Room")
import Hazards = require("./Hazards")

class Player {
    private _cave: Cave;
    private _room: Room;

    constructor(cave: Cave, roomNumber: number) {
        this._cave = cave;
        this._room = cave.rooms[roomNumber];
    }

    get room(): Room {
        return this._room;
    }

    get senses(): Hazards.HazardType[] {
        return _.reduce<number, Hazards.HazardType[]>(this._room.exits,
            (state, exit) => state.concat(_.pluck(this._cave.rooms[exit].hazards, "type")),
            new Array<Hazards.HazardType>());
    }

    canEnter(roomNumber: number) {
        return this._room.exits.indexOf(roomNumber) > -1;
    }

    enter(roomNumber: number) {
        if (!this.canEnter(roomNumber)) {
            throw new RangeError("Cannot enter this room. Rooms accessible are " + this.room.exits.join(","));
        }
        this._room = this._cave.rooms[roomNumber];
    }
}

export = Player