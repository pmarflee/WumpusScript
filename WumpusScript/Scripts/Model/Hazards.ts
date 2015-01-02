/// <reference path="../typings/underscore/underscore.d.ts" />

import Cave = require("./Cave")
import Room = require("./Room")
import Player = require("./Player")
import Random = require("./Random")

export enum HazardType { Pit = 1, Bat = 2, Wumpus = 3 } 

export class Hazard {
    protected _room: Room;
    protected _act: { (player: Player): void }

    constructor(protected _type: HazardType, protected _cave: Cave, protected roomNumber: number) {
        this._room = this._cave.rooms[roomNumber];
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

    act(player: Player) { }
}

export class Pit extends Hazard {
    constructor(cave: Cave, roomNumber: number) {
        super(HazardType.Pit, cave, roomNumber);
    }

    enter(number: number) {
        throw new Error("Pits can't move");
    }

    act(player: Player) { player.kill(); }
}

export class Bat extends Hazard {
    private _roomSelector: { (): number };

    constructor(cave: Cave, roomNumber: number, roomSelector?: { (): number }) {
        super(HazardType.Bat, cave, roomNumber);
        this._roomSelector = roomSelector || this.defaultRoomSelector;
    }

    act(player: Player) {
        var newRoomNumber = this._roomSelector();
        player.move(newRoomNumber);
        this.enter(newRoomNumber);
    }

    defaultRoomSelector = (): number => {
        var room = this._room;
        var rooms = this._cave.rooms.length;
        return (room.number + Random.between(1, rooms - 1)) % rooms;
    }
}

export enum WumpusAction { Move = 1, Stay = 2 }

export class Wumpus extends Hazard {
    private _roomSelector: { (): number };
    private _isAlive: boolean = true;

    constructor(cave: Cave, roomNumber: number,
        private _actions: WumpusAction[]= [WumpusAction.Move, WumpusAction.Move, WumpusAction.Move, WumpusAction.Stay],
        roomSelector?: { (): number }) {
        super(HazardType.Wumpus, cave, roomNumber);
        this._roomSelector = roomSelector || this.defaultRoomSelector;
    }

    act(player: Player) {
        if (this._room.hasArrow) {
            this._isAlive = false;
            return;
        }
        if (_.sample(this._actions) == WumpusAction.Move) {
            this.enter(this._roomSelector());
        }
        if (this._room == player.room) {
            player.kill();
        }
    }

    defaultRoomSelector = (): number => {
        var exit = Random.between(0, 2);
        return this._room.exits[exit];
    }

    get isAlive(): boolean {
        return this._isAlive;
    }
}