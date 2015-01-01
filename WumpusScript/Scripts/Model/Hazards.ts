import Cave = require("./Cave")
import Room = require("./Room")

export enum HazardType { Pit = 1, Bat = 2, Wumpus = 3 } 

export class Hazard {
    private _type: HazardType;
    private _cave: Cave;
    private _room: Room;

    constructor(type: HazardType, cave: Cave, roomNumber: number) {
        this._type = type;
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

    moveToRoom(number: number) {
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

    moveToRoom(number: number) {
        throw new Error("Pits can't move");
    }
}

export class Bat extends Hazard {
    constructor(cave: Cave, roomNumber: number) {
        super(HazardType.Bat, cave, roomNumber);
    }
}

export class Wumpus extends Hazard {
    constructor(cave: Cave, roomNumber: number) {
        super(HazardType.Wumpus, cave, roomNumber);
    }
}