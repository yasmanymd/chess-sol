export class Game {
    constructor(public id: string, public title: string, public whitePlayer: string | undefined, public blackPlayer: string | undefined, public time: number) {}
}