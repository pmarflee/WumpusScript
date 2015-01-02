import tsUnit = require("../tsUnit/tsUnit")
import Cave = require("../Model/Cave")
import Player = require("../Model/Player")
import Hazards = require("../Model/Hazards")
import GameEvents = require("../Model/GameEvents")

export class CaveTests extends tsUnit.TestClass {

    private _cave: Cave;

    setUp() {
        this._cave = new Cave();
    }

    "All exits should be bidirectional"() {
        this.isTrue(this._cave.rooms.every(room =>
            room.exits.every(exit => this._cave.rooms[exit].exits.indexOf(room.number) > -1)
            ));
    }

    "All rooms should have 3 exits"() {
        this.isTrue(this._cave.rooms.every(room => room.exits.length == 3));
    }

    "addHazards should place hazards in a separate room"() {
        this._cave.addHazards(Hazards.HazardType.Wumpus, 20);
        this.isTrue(this._cave.rooms.every(room => room.hazards.length == 1));
    }
}

export class CaveAddHazardsTests extends tsUnit.TestClass {
    private _cave: Cave;

    constructor() {
        super();

        var data = [
            [Hazards.HazardType.Pit, 2],
            [Hazards.HazardType.Bat, 2],
            [Hazards.HazardType.Wumpus, 1]
        ];

        this.parameterizeUnitTest(this.shouldAddHazardsToTheCaveOfTheSpecifiedNumberAndType, data);
    }

    setUp() {
        this._cave = new Cave();
    }

    shouldAddHazardsToTheCaveOfTheSpecifiedNumberAndType(type: Hazards.HazardType, number: number) {
        this._cave.addHazards(type, number);
        this.areIdentical(number, this._cave.hazards.length);
        this.isTrue(this._cave.hazards.every(hazard => hazard.type == type));
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
        this._player = new Player(this._cave);
    }

    senseHazard(type: Hazards.HazardType, roomNumber: number, canSense: boolean) {
        var hazard = Hazards.Hazard.create(type, this._cave, roomNumber);
        this.areIdentical(canSense, this._player.senses.indexOf(hazard.type) > -1)
    }
}

export class PlayerMovementTests extends tsUnit.TestClass {
    private _cave: Cave;
    private _player: Player;

    setUp() {
        this._cave = new Cave();
        this._player = new Player(this._cave);
    }

    "Should be able to enter a room which is accessible from their current room"() {
        this._player.enter(1);
        this.areIdentical(1, this._player.room.number);
    }

    "Should not be able to enter a room which is not accessible from their current room"() {
        this.throws(() => this._player.enter(1));
    }

    "Should be killed by entering a room containing a pit"() {
        this._player.addEncounter(Hazards.HazardType.Pit, this._player.encounterPit);
        Hazards.Hazard.create(Hazards.HazardType.Pit, this._cave, 1);
        this._player.enter(1);
        this.areIdentical(false, this._player.isAlive);
    }

    "Should not be killed by entering a room not containing a pit"() {
        this._player.addEncounter(Hazards.HazardType.Pit, this._player.encounterPit);
        Hazards.Hazard.create(Hazards.HazardType.Pit, this._cave, 2);
        this._player.enter(1);
        this.areIdentical(true, this._player.isAlive);
    }

    "Should be transported to another room by entering a room containing a bat"() {
        this._player.addEncounter(Hazards.HazardType.Bat, this._player.encounterBat);
        Hazards.Hazard.create(Hazards.HazardType.Bat, this._cave, 1);
        this._player.enter(1);
        this.areNotIdentical(1, this._player.room.number);
    }

    "Should not be transported to another room by entering a room not containing a bat"() {
        this._player.addEncounter(Hazards.HazardType.Bat, this._player.encounterBat);
        Hazards.Hazard.create(Hazards.HazardType.Bat, this._cave, 2);
        this._player.enter(1);
        this.areIdentical(1, this._player.room.number);
    }

    "Should not be transported to another room by entering a room containing both a pit and a bat"() {
        this._player.addEncounter(Hazards.HazardType.Pit, this._player.encounterPit);
        this._player.addEncounter(Hazards.HazardType.Bat, this._player.encounterBat);
        Hazards.Hazard.create(Hazards.HazardType.Pit, this._cave, 1);
        Hazards.Hazard.create(Hazards.HazardType.Bat, this._cave, 1);
        this._player.enter(1);
        this.areIdentical(1, this._player.room.number);
    }

    "Should be transported twice by entering a room containing a bat that transports the player to another room containing a bat"() {
        this._player.addEncounter(Hazards.HazardType.Bat, this._player.encounterBat);
        var bat1 = new Hazards.Bat(this._cave, 1, () => 2);
        var bat2 = new Hazards.Bat(this._cave, 2, () => 3);
        this._player.enter(1);
        this.areIdentical(3, this._player.room.number);
    }

    "Should be killed by entering a room containing a wumpus that does not move when startled"() {
        this._player.addEncounter(Hazards.HazardType.Wumpus, this._player.startleWumpus);
        var wumpus = new Hazards.Wumpus(this._cave, 1, [Hazards.WumpusAction.Stay]);
        this._player.enter(1);
        this.areIdentical(false, this._player.isAlive);
    }

    "Should not be killed by entering a room containing a wumpus that moves when startled"() {
        this._player.addEncounter(Hazards.HazardType.Wumpus, this._player.startleWumpus);
        var wumpus = new Hazards.Wumpus(this._cave, 1, [Hazards.WumpusAction.Move]);
        this._player.enter(1);
        this.areIdentical(true, this._player.isAlive);
    }

    "Should be killed if transported by a bat into another room containing a pit"() {
        this._player.addEncounter(Hazards.HazardType.Pit, this._player.encounterPit);
        this._player.addEncounter(Hazards.HazardType.Bat, this._player.encounterBat);
        var bat = new Hazards.Bat(this._cave, 1, () => 2);
        Hazards.Hazard.create(Hazards.HazardType.Pit, this._cave, 2);
        this._player.enter(1);
        this.areIdentical(false, this._player.isAlive);
    }

    "Should not be killed if transported by a bat into another room that contains no hazards"() {
        this._player.addEncounter(Hazards.HazardType.Bat, this._player.encounterBat);
        Hazards.Hazard.create(Hazards.HazardType.Bat, this._cave, 1);
        this._player.enter(1);
        this.areIdentical(true, this._player.isAlive);
    }

    "Should be killed if transported by a bat into another room containing a wumpus that does not move when startled"() {
        this._player.addEncounter(Hazards.HazardType.Wumpus, this._player.startleWumpus);
        this._player.addEncounter(Hazards.HazardType.Bat, this._player.encounterBat);
        var bat = new Hazards.Bat(this._cave, 1, () => 2);
        var wumpus = new Hazards.Wumpus(this._cave, 2, [Hazards.WumpusAction.Stay]);
        this._player.enter(1);
        this.areIdentical(false, this._player.isAlive);
    }

    "Should not be killed if transported by a bat into another room containing a wumpus that does move when startled"() {
        this._player.addEncounter(Hazards.HazardType.Wumpus, this._player.startleWumpus);
        this._player.addEncounter(Hazards.HazardType.Bat, this._player.encounterBat);
        var bat = new Hazards.Bat(this._cave, 1, () => 2);
        var wumpus = new Hazards.Wumpus(this._cave, 2, [Hazards.WumpusAction.Move]);
        this._player.enter(1);
        this.areIdentical(true, this._player.isAlive);
    }
}

export class PlayerShootArrowTests extends tsUnit.TestClass {
    private _cave: Cave;
    private _player: Player;

    setUp() {
        this._cave = new Cave();
        this._player = new Player(this._cave);
    }

    "Should kill wumpus if they shoot an arrow into its room"() {
        this._player.addEncounter(Hazards.HazardType.Wumpus, this._player.startleWumpus);
        var wumpus = new Hazards.Wumpus(this._cave, 1);
        this._player.shoot(1);
        this.isFalse(wumpus.isAlive);
    }

    "Should not be allowed to shoot an arrow into a non-adjoining room"() {
        this.throws({
            fn: () => this._player.shoot(2),
            exceptionString: "Cannot access this room. Rooms accessible are 1,4,7"
        });
    }

    "Should not kill wumpus if they do not shoot an arrow into its room"() {
        this._player.addEncounter(Hazards.HazardType.Wumpus, this._player.startleWumpus);
        var wumpus = new Hazards.Wumpus(this._cave, 1);
        this._player.shoot(4);
        this.isTrue(wumpus.isAlive);
    }

    "Should be killed if they miss the wumpus and startle it into moving into their room"() {
        this._player.addEncounter(Hazards.HazardType.Wumpus, this._player.startleWumpus);
        var wumpus = new Hazards.Wumpus(this._cave, 1, [Hazards.WumpusAction.Move], () => 0);
        this._player.shoot(4);
        this.isFalse(this._player.isAlive);
    }

    "Should not be killed if they miss the wumpus and startle it into moving into a room which is not their room"() {
        this._player.addEncounter(Hazards.HazardType.Wumpus, this._player.startleWumpus);
        var wumpus = new Hazards.Wumpus(this._cave, 1, [Hazards.WumpusAction.Move], () => 2);
        this._player.shoot(4);
        this.isTrue(this._player.isAlive);
    }

    "Should not be killed if they miss the wumpus but don't cause it to move"() {
        this._player.addEncounter(Hazards.HazardType.Wumpus, this._player.startleWumpus);
        var wumpus = new Hazards.Wumpus(this._cave, 1, [Hazards.WumpusAction.Stay]);
        this._player.shoot(4);
        this.isTrue(this._player.isAlive);
    }

    "Arrows should not remain in rooms after shooting has finished"() {
        this._player.shoot(1);
        this.isFalse(this._cave.rooms[1].hasArrow);
    }
}

export class EventTests extends tsUnit.TestClass {
    private _cave: Cave;
    private _player: Player;
    private _events: GameEvents.Type[];

    setUp() {
        this._cave = new Cave();
        this._player = new Player(this._cave);
        this._events = new Array<GameEvents.Type>();
    }

    "Player should raise an FellIntoPit event when they fall into a pit"() {
        this.runTest(() => {
            this._player.addEncounter(Hazards.HazardType.Pit, this._player.encounterPit);
            Hazards.Hazard.create(Hazards.HazardType.Pit, this._cave, 1);
            this._player.move(1);
        }, GameEvents.Type.FellIntoPit);
    }

    "Player should raise an WhiskedAwayByBats event when they encounter a bat"() {
        this.runTest(() => {
            this._player.addEncounter(Hazards.HazardType.Bat, this._player.encounterBat);
            Hazards.Hazard.create(Hazards.HazardType.Bat, this._cave, 1);
            this._player.move(1);
        }, GameEvents.Type.WhiskedAwayByBats);
    }

    "Player should raise a StartledWumpus event when they miss the wumpus and cause it to move rooms"() {
        this.runTest(() => {
            this._player.addEncounter(Hazards.HazardType.Wumpus, this._player.startleWumpus);
            var wumpus = new Hazards.Wumpus(this._cave, 1, [Hazards.WumpusAction.Move], () => 0);
            this._player.shoot(4);
        }, GameEvents.Type.StartledWumpus);
    }

    "Player should raise a StartledWumpus event when they enter the room occupied by the wumpus and cause it to move rooms"() {
        this.runTest(() => {
            this._player.addEncounter(Hazards.HazardType.Wumpus, this._player.startleWumpus);
            var wumpus = new Hazards.Wumpus(this._cave, 1, [Hazards.WumpusAction.Move], () => 0);
            this._player.enter(1);
        }, GameEvents.Type.StartledWumpus);
    }

    "Player should raise a EatenByWumpus event when they are eaten by the wumpus"() {
        this.runTest(() => {
            this._player.addEncounter(Hazards.HazardType.Wumpus, this._player.startleWumpus);
            var wumpus = new Hazards.Wumpus(this._cave, 1, [Hazards.WumpusAction.Stay]);
            this._player.enter(1);
        }, GameEvents.Type.EatenByWumpus);
    }

    runTest(action: { (): void }, type: GameEvents.Type) {
        this._player.gameEvent.on(type => this._events.push(type));
        action();
        this.isTrue(this._events.indexOf(type) != -1);
    }
}