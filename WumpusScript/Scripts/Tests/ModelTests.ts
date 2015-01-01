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

    constructor() {
        super();

        var data = [
            [new Hazards.Bat(), 1, true],
            [new Hazards.Pit(), 1, true],
            [new Hazards.Wumpus(), 1, true],
            [new Hazards.Bat(), 2, false],
            [new Hazards.Pit(), 2, false],
            [new Hazards.Wumpus(), 2, false]
        ];

        this.parameterizeUnitTest(this.senseHazard, data);
    }

    setUp() {
        this._cave = new Cave();
        this._player = new Player(this._cave, this._cave.rooms[0]); 
    }

    senseHazard(hazard: Hazards.Hazard, number: number, canSense: boolean) {
        var room = this._cave.rooms[number];
        room.hazards.push(hazard);
        this.areIdentical(canSense, this._player.senses.indexOf(hazard.type) > -1)
    }
}