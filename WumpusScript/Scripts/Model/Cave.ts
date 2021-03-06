﻿/// <reference path="../typings/underscore/underscore.d.ts" />

import Room = require("./Room")
import Hazards = require("./Hazards")

class Cave {
    private _rooms: Room[];
    private _data: number[][] = [
        [1, 4, 7], [0, 2, 9], [1, 3, 11],
        [2, 4, 13], [0, 3, 5], [4, 6, 14],
        [5, 7, 16], [0, 6, 8], [7, 9, 17],
        [1, 8, 10], [9, 11, 18], [2, 10, 12],
        [11, 13, 19], [3, 12, 14], [5, 13, 15],
        [14, 16, 19], [6, 15, 17], [8, 16, 18],
        [10, 17, 19], [12, 15, 18]];

    constructor() {
        this.initialise(this._data);
    }

    private initialise(data: number[][]) {
        this._rooms = data.map((exits, index) => new Room(index, exits));
    }

    shuffle() {
        var data = this._data;
        var rooms = data.length;
        var newData = new Array<number[]>(rooms);
        var shuffle = _(_.range(rooms)).shuffle();

        for (var i = 0; i < rooms; i++) {
            var newExits = new Array<number>(3);
            for (var j = 0; j < 3; j++) {
                newExits[j] = shuffle[data[i][j]];
            }
            newData[shuffle[i]] = newExits;
        }

        this.initialise(newData);
    }

    get rooms(): Room[] {
        return this._rooms;
    }

    get hazards(): Hazards.Hazard[] {
        return _.reduce<Room, Hazards.Hazard[]>(this.rooms,
            (state, room) => state.concat(room.hazards),
            new Array<Hazards.Hazard>());
    }

    private addHazard(type: Hazards.HazardType) {
        var roomNumber: number;
        do {
            roomNumber = _.random(0, this.rooms.length - 1);
        }
        while (this._rooms[roomNumber].containsHazard)

        Hazards.Hazard.create(type, this, roomNumber);
    }

    addHazards(type: Hazards.HazardType, number: number) {
        for (var i = 1; i <= number; i++) {
            this.addHazard(type);
        }
    }

    private getRandomRoomNumber() {
        return Math.round(Math.random() * 20);
    }
}

export = Cave