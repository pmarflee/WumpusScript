/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />

import Player = require("../Model/Player")
import Cave = require("../Model/Cave")
import Hazards = require("../Model/Hazards")
import Random = require("../Model/Random")
import GameEvents = require("../Model/GameEvents")

class Game {
    private _cave: Cave;
    private _player: Player;
    private _wumpus: Hazards.Wumpus;
    private _actionTemplate: { (data: any): string };
    private _narratorTemplate: { (data: any): string };
    private _newGame: boolean;

    constructor() {
        this.initialise();
    }

    private initialise(showInstructions: boolean = true) {
        this._newGame = true;

        var cave = new Cave();
        cave.shuffle();

        var player = new Player(cave, Random.between(0, cave.rooms.length - 1));
        player.addEncounter(Hazards.HazardType.Bat, player.encounterBat);
        player.addEncounter(Hazards.HazardType.Pit, player.encounterPit);
        player.addEncounter(Hazards.HazardType.Wumpus, player.startleWumpus);
        player.gameEvent.on(this.handleEvent);

        cave.addHazards(Hazards.HazardType.Bat, 2);
        cave.addHazards(Hazards.HazardType.Pit, 2);
        cave.addHazards(Hazards.HazardType.Wumpus, 1);

        this._wumpus = <Hazards.Wumpus>_.findWhere(cave.hazards, { type: Hazards.HazardType.Wumpus });

        this._cave = cave;
        this._player = player;

        this.compileTemplates();
        if (showInstructions) this.renderInstructions();
        this.renderViews();

        this._newGame = false;
    }

    private handleEvent = (type: GameEvents.Type) => {
        var text: string;
        switch (type) {
            case GameEvents.Type.EatenByWumpus:
                text = "TSK TSK TSK- WUMPUS GOT YOU!";
                break;
            case GameEvents.Type.FellIntoPit:
                text = "YYYIIIIEEEE . . . FELL IN PIT";
                break;
            case GameEvents.Type.StartledWumpus:
                text = "YOU HEARD A RUMBLING IN A NEARBY CAVERN";
                break;
            case GameEvents.Type.WhiskedAwayByBats:
                text = "ZAP--SUPER BAT SNATCH! ELSEWHEREVILLE FOR YOU!";
                break;
        }
        this.renderNarration(text);
    }

    get player(): Player {
        return this._player;
    }

    get wumpus(): Hazards.Wumpus {
        return this._wumpus;
    }

    move(roomNumber: number) {
        this._player.enter(roomNumber);
        this.renderViews();
    }

    shoot(roomNumber: number) {
        this._player.shoot(roomNumber);
        this.renderViews();
    }

    private compileTemplates() {
        this._actionTemplate = _.template($("#actiontemplate").html());
        this._narratorTemplate = _.template($("#narratortemplate").html());
    }

    private renderViews() {
        this.renderNarrations();
        this.renderActions();
    }

    private renderActions() {
        var buttons = $("#ActionButtons");
        $("#ActionButtons").html(this._actionTemplate(this));
        $(".move").find(":button").each((index, element) => {
            $(element).click(() => { this.move(parseInt($(element).val())) });
        });
        $(".shoot").find(":button").each((index, element) => {
            $(element).click(() => { this.shoot(parseInt($(element).val())) });
        });
        $(".new").find(":button").each((index, element) => {
            $(element).click(() => { this.initialise(false); });
        });
    }

    private renderNarrations() {
        var text: string = '';
        if (this._newGame) {
            text += this.createLine("HUNT THE WUMPUS");
        }
        if (!this._player.isAlive) {
            text += "HA HA HA - YOU LOSE!";
        }
        else if (!this._wumpus.isAlive) {
            text += this.createLine("AHA! YOU GOT THE WUMPUS!");
            text += this.createLine("HEE HEE HEE - THE WUMPUS'LL GETCHA NEXT TIME!!");
        }
        else {
            this._player.senses.forEach(hazard => {
                switch (hazard) {
                    case Hazards.HazardType.Bat:
                        text += this.createLine("BATS NEARBY!");
                        break;
                    case Hazards.HazardType.Pit:
                        text += this.createLine("I FEEL A DRAFT");
                        break;
                    case Hazards.HazardType.Wumpus:
                        text += this.createLine("I SMELL A WUMPUS!");
                        break;
                }
            });
            text += this.createLine("YOU ARE IN ROOM " + this._player.room.number);
            text += this.createLine("TUNNELS LEAD TO " + this._player.room.exits.join("\t"))
        }
        this.renderNarration(text);
    }

    private createLine(line: string): string {
        return "<p>" + line + "</p>";
    }

    private renderNarration(text: string) {
        var narrator = $("#Narrator");
        narrator.prepend("<hr/>")
        narrator.prepend(this._narratorTemplate({ text: text }));
    }

    private renderInstructions() {
        this.renderNarration($("#instructionstemplate").html());
    }
}

var App = {
    game: new Game()
}
