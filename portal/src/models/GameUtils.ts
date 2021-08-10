import * as Long from "long";

export class Utils {
    public static getPosition(pos: number): string {
        const arr = [
            'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
            'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
            'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
            'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
            'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
            'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
            'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
            'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'];
        return arr[pos];
    }

    public static saveNotation(game: string, position1: string, position2: string) {
        if (!window["movements"]) {
            window["movements"] = {};
        }
        if (!window["movements"][game]) {
            window["movements"][game] = [];
        }
        window["movements"][game].push({ position1: position1, position2: position2 });
    }

    public static getNotation(game: string) {
        return window["movements"][game];
    }

    public static removeNotation(game: string) {
        delete window["movements"][game];
    }

    public static times(n: number, iterator: any) {
        var list = Array(Math.max(0, n));
        for (var i = 0; i < n; i++)
            list[i] = iterator.call(iterator, i);
        return list;
    };

    public static forEach(init: number, end: number, iterator: any) {
        for (var i = init; i <= end; i++) {
            iterator.call(iterator, i);
        }
    }

    public static loadResource(filename: string, filetype: string): void {
        if (filetype == "js") {
            var fileref: any = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", filename);
        } else if (filetype == "css") {
            var fileref: any = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref !== "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    }

    public static longPos(position: number): Long {
        return Utils.longPow(2, position);
    }

    public static longPow(base: number, exponential: number): Long {
        var result = Long.fromInt(1);
        for (var i = 0; i < exponential; i++) {
            result = result.multiply(base);
        }
        return result;
    }

    public static showBoardFromLong(board: Long) {
        for (var i = 7; i >= 0; i--) {
            var s = "";
            for (var j = 0; j < 8; j++) {
                s += board.and(this.longPos(i * 8 + j)).equals(this.longPos(i * 8 + j)) ? "1" : "0";
            }
            console.log(s);
        }
    }

    public static showBoardFromString(board: string) {
        return this.showBoardFromLong(Long.fromString(board));
    }

    public static postData(url = '', data = {}) {
        return fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
    }

    public static getData(url = '') {
        return fetch(url, {
            method: "GET"
        })
            .then(response => response.json()); // parses response to JSON
    }
}

window["utils"] = Utils;