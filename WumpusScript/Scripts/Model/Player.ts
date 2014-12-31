/// <reference path="../typings/underscore/underscore.d.ts" />

import Cave = require("./Cave")
import Room = require("./Room")
import Hazards = require("./Hazards")

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

    get senses(): Hazards.HazardType[] {
        return _.reduce<number, Hazards.HazardType[]>(this._room.exits,
            (state, exit) => state.concat(_.pluck(this._cave.rooms[exit].hazards, "type")),
            new Array<Hazards.HazardType>());
    }

    canMoveToRoom(number: number) {
        return this._room.exits.indexOf(number) > -1;
    }

    moveToRoom(number: number) {
        this._room = this._cave.rooms[number];
    }
}

export = Player