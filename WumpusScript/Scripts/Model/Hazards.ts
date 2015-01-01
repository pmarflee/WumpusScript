/// <reference path="../typings/underscore/underscore.d.ts" />

import Cave = require("./Cave")
import Room = require("./Room")
import Random = require("./Random")

export enum HazardType { Pit = 1, Bat = 2, Wumpus = 3 } 

export class Hazard {
    protected _type: HazardType;
    protected _cave: Cave;
    protected _room: Room;

    constructor(type: HazardType, cave: Cave, roomNumber: number) {
        this._type = type;
        this._cave = cave;
        this._room = cave.rooms[roomNumber];
        this._room.addHazard(this);
    }

    static create(type: HazardType, cave: Cave, roomNumber: number): Hazard {
        switch (type) {
            case HazardType.Bat:
                return new Bat(cave, roomNumber);
            case HazardType.Pit:
                return new Pit(cave, roomNumber);
            case HazardType.Wumpus:
                return new Wumpus(cave, roomNumber);
        }
    }

    get type(): HazardType {
        return this._type;
    }

    get room(): Room {
        return this._room;
    }

    enter(number: number) {
        this._room.removeHazard(this);
        var newRoom = this._cave.rooms[number];
        this._room = this._cave.rooms[number];
        this._room.addHazard(this);
    }
}

export class Pit extends Hazard {
    constructor(cave: Cave, roomNumber: number) {
        super(HazardType.Pit, cave, roomNumber);
    }

    enter(number: number) {
        throw new Error("Pits can't move");
    }
}

export class Bat extends Hazard {
    constructor(cave: Cave, roomNumber: number) {
        super(HazardType.Bat, cave, roomNumber);
    }
}

export enum WumpusAction { Move = 1, Stay = 2 }

export class Wumpus extends Hazard {
    private _actions: WumpusAction[];

    constructor(cave: Cave, roomNumber: number, actions?: WumpusAction[]) {
        super(HazardType.Wumpus, cave, roomNumber);

        this._actions = actions || new Array<WumpusAction>(
            WumpusAction.Move,
            WumpusAction.Move,
            WumpusAction.Move,
            WumpusAction.Stay); 
    }

    startle() {
        if (_.sample(this._actions) == WumpusAction.Move) {
            var exit = Random.between(0, 2);
            this.enter(this._room.exits[exit]);
        }
    }
}