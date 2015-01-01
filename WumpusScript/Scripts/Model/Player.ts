/// <reference path="../typings/underscore/underscore.d.ts" />

import Cave = require("./Cave")
import Room = require("./Room")
import Hazards = require("./Hazards")
import Random = require("./Random")

class Player {
    private _cave: Cave;
    private _room: Room;
    private _isAlive: boolean = true;
    private _encounters: [Hazards.HazardType, { (): void; }][] = new Array <[Hazards.HazardType, { (): void; }]>();

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

    get isAlive(): boolean {
        return this._isAlive;
    }

    addEncounter(type: Hazards.HazardType, action: { (): void }) {
        this._encounters.push([type, action]);
    }

    canEnter(roomNumber: number) {
        return this._room.exits.indexOf(roomNumber) > -1;
    }

    enter(roomNumber: number) {
        if (!this.canEnter(roomNumber)) {
            throw new RangeError("Cannot enter this room. Rooms accessible are " + this.room.exits.join(","));
        }
        this.move(roomNumber);
    }

    move(roomNumber: number) {
        this._room = this._cave.rooms[roomNumber];

        this._encounters
            .filter(encounter => this._room.containsHazardOfType(encounter[0]))
            .forEach(encounter => encounter[1]());
    }

    encounterPit = () => {
        this._isAlive = false;
    }

    encounterBat = () => {
        var room = this._room;
        var rooms = this._cave.rooms.length;
        var newRoomNumber = (room.number + Random.between(1, rooms - 1)) % rooms;

        this.move(newRoomNumber);

        var bat = room.getHazard(Hazards.HazardType.Bat);
        bat.enter(newRoomNumber);
    }
}

export = Player