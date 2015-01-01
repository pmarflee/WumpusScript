﻿import tsUnit = require("../tsUnit/tsUnit")
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

export class CaveRoomsHaveCorrectExitsTests extends tsUnit.TestClass {
    private _cave: Cave = new Cave();

    constructor() {
        super();

        var data: [number, number[]][] = [
            [0, [1, 4, 7]],
            [1, [0, 2, 9]],
            [2, [1, 3, 11]],
            [3, [2, 4, 13]],
            [4, [0, 3, 5]],
            [5, [4, 6, 14]],
            [6, [5, 7, 16]],
            [7, [0, 6, 8]],
            [8, [7, 9, 17]],
            [9, [1, 8, 10]],
            [10, [9, 11, 18]],
            [11, [2, 10, 12]],
            [12, [11, 13, 19]],
            [13, [3, 12, 14]],
            [14, [5, 13, 15]],
            [15, [14, 16, 19]],
            [16, [6, 15, 17]],
            [17, [8, 16, 18]],
            [18, [10, 17, 19]],
            [19,[12,15,18]]
        ];

        this.parameterizeUnitTest(this.roomHasCorrectExits, data);
    }

    roomHasCorrectExits(roomNumber: number, expected: number[]) {
        this.areCollectionsIdentical(expected, this._cave.rooms[roomNumber].exits);
    }
}

export class PlayerHazardTests extends tsUnit.TestClass {

    private _cave: Cave;
    private _player: Player;

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
        var hazard = Hazards.Hazard.create(type, this._cave, roomNumber);
        this.areIdentical(canSense, this._player.senses.indexOf(hazard.type) > -1)
    }
}