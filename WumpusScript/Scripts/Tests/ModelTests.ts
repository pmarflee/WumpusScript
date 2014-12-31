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

export class PlayerTests extends tsUnit.TestClass {

    private _cave: Cave;
    private _player: Player;

    setUp() {
        this._cave = new Cave();
        this._player = new Player(this._cave, this._cave.rooms[0]); 
    }

    "Should be able to sense the wumpus if it is in an adjoining room"() {
        var room = this._cave.rooms[this._player.room.exits[0]];
        room.hazards.push(new Hazards.Wumpus());
        this.isTrue(this._player.senses.indexOf(Hazards.HazardType.Wumpus) > -1)
    }

    "Should not be able to sense the wumpus if it is not in an adjoining room"() {
        var room = this._cave.rooms[2];
        room.hazards.push(new Hazards.Wumpus());
        this.isFalse(this._player.senses.indexOf(Hazards.HazardType.Wumpus) > -1)
    }

    "Should be able to sense a bat if it is in an adjoining room"() {
        var room = this._cave.rooms[this._player.room.exits[0]];
        room.hazards.push(new Hazards.Bat());
        this.isTrue(this._player.senses.indexOf(Hazards.HazardType.Bat) > -1)
    }

    "Should not be able to sense a bat if it is not in an adjoining room"() {
        var room = this._cave.rooms[2];
        room.hazards.push(new Hazards.Bat());
        this.isFalse(this._player.senses.indexOf(Hazards.HazardType.Bat) > -1)
    }
}