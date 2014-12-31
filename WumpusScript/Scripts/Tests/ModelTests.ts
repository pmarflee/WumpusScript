import tsUnit = require("../tsUnit/tsUnit")
import Cave = require("../Model/Cave")
import Player = require("../Model/Player")

export class CaveTests extends tsUnit.TestClass {
    
    private _cave: Cave = new Cave();

    allExitsShouldBeBidirectional() {
        this.isTrue(this._cave.rooms.every(room =>
            room.exits.every(exit => this._cave.rooms[exit].exits.indexOf(room.number) > -1)
            ));
    }

    allRoomsShouldHave3Exits() {
        this.isTrue(this._cave.rooms.every(room => room.exits.length == 3));
    }

} 

export class PlayerTests extends tsUnit.TestClass {

    private _cave: Cave = new Cave();
    private _player: Player = new Player(this._cave, this._cave.rooms[0]);

}