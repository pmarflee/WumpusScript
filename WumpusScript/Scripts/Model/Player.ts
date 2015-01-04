/// <reference path="../typings/underscore/underscore.d.ts" />

import Cave = require("./Cave")
import Room = require("./Room")
import Hazards = require("./Hazards")
import Events = require("./Events")
import GameEvents = require("./GameEvents")

class Player {
    private _room: Room;
    private _isAlive: boolean = true;
    private _encounters: [Hazards.HazardType, { (): void; }][] = new Array<[Hazards.HazardType, { (): void; }]>();
    private _onGameEvent = new Events.LiteEvent<GameEvents.Type>();

    constructor(private _cave: Cave, roomNumber: number = 0) {
        this._room = this._cave.rooms[roomNumber];
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

    kill() {
        this._isAlive = false;
    }

    addEncounter(type: Hazards.HazardType, action: { (): void }) {
        this._encounters.push([type, action]);
    }

    canEnter(roomNumber: number) {
        return this._room.exits.indexOf(roomNumber) > -1;
    }

    enter(roomNumber: number) {
        this.validateRoomSelection(roomNumber);
        this.move(roomNumber);
    }

    move(roomNumber: number) {
        this._room = this._cave.rooms[roomNumber];
        this._encounters
            .filter(encounter => this._room.containsHazardOfType(encounter[0]))
            .forEach(encounter => {
                if (this._isAlive) encounter[1]();
            });
    }

    shoot(roomNumber: number) {
        this.validateRoomSelection(roomNumber);
        this._cave.rooms[roomNumber].hasArrow = true;
        this.startleWumpus();
        this._cave.rooms[roomNumber].hasArrow = false;
    }

    validateRoomSelection(roomNumber: number) {
        if (!this.canEnter(roomNumber)) {
            throw new RangeError("Cannot access this room. Rooms accessible are " + this.room.exits.join(","));
        }
    }

    public get gameEvent(): Events.ILiteEvent<GameEvents.Type> {
        return this._onGameEvent;
    }

    encounterPit = () => {
        var pit = this._room.getHazard(Hazards.HazardType.Pit);
        if (pit) {
            pit.act(this);
            this._onGameEvent.trigger(GameEvents.Type.FellIntoPit);
        }
    }

    encounterBat = () => {
        var bat = this._room.getHazard(Hazards.HazardType.Bat);
        if (bat) {
            bat.act(this);
            this._onGameEvent.trigger(GameEvents.Type.WhiskedAwayByBats);
        }
    }

    startleWumpus = () => {
        var wumpus = _.findWhere(this._cave.hazards, { type: Hazards.HazardType.Wumpus });
        if (!wumpus) return;
        var wumpusAction = wumpus.act(this);
        if (wumpusAction == Hazards.ActionResult.Moved) {
            this._onGameEvent.trigger(GameEvents.Type.StartledWumpus);
        }
        if (!this._isAlive) {
            this._onGameEvent.trigger(GameEvents.Type.EatenByWumpus);
        }
    }
}

export = Player