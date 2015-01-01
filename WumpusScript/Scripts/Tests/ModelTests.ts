import tsUnit = require("../tsUnit/tsUnit")
import Cave = require("../Model/Cave")
import Player = require("../Model/Player")
import Hazards = require("../Model/Hazards")

export class CaveTests extends tsUnit.TestClass {

    private _cave: Cave = new Cave();

    "All exits should be bidirectional"() {
        this.isTrue(this._cave.rooms.every(room =>
            room.exits.every(exit => this._cave.rooms[exit].exits.indexOf(room.number) > -1)
            ));
    }

    "All rooms should have 3 exits"() {
        this.isTrue(this._cave.rooms.every(room => room.exits.length == 3));
    }

}

export class PlayerHazardTests extends tsUnit.TestClass {

    private _cave: Cave;
    private _player: Player;
    private _createHazard = function (type: Hazards.HazardType, roomNumber: number) {
        switch (type) {
            case Hazards.HazardType.Bat:
                return new Hazards.Bat(this._cave, roomNumber);
            case Hazards.HazardType.Pit:
                return new Hazards.Pit(this._cave, roomNumber);
            case Hazards.HazardType.Wumpus:
                return new Hazards.Wumpus(this._cave, roomNumber);
        }
    }

    constructor() {
        super();

        var data = [
            [Hazards.HazardType.Bat, 1, true],
            [Hazards.HazardType.Pit, 1, true],
            [Hazards.HazardType.Wumpus, 1, true],
            [Hazards.HazardType.Bat, 2, false],
            [Hazards.HazardType.Pit, 2, false],
            [Hazards.HazardType.Wumpus, 2, false]
        ];

        this.parameterizeUnitTest(this.senseHazard, data);
    }

    setUp() {
        this._cave = new Cave();
        this._player = new Player(this._cave, 0);
    }

    senseHazard(type: Hazards.HazardType, roomNumber: number, canSense: boolean) {
        var hazard = this._createHazard(type, roomNumber);
        this.areIdentical(canSense, this._player.senses.indexOf(hazard.type) > -1)
    }
}