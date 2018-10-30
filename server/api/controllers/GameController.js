/**
 * GameController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    newGame: async (req, res) => {
        if (!req.isSocket) {
            return res.badRequest();
        }

        function guid() {
            function s4() {
              return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        let id = guid();

        try {
            let game = await Game.create({id:id, title: req.body.title,  whitePlayer: req.body.whitePlayer, blackPlayer: req.body.blackPlayer, time: req.body.time });
			Game.publish(['game'], game, req);
		} catch(err) {
			return res.serverError(err);
		}

        return res.ok({type: req.body.whitePlayer != undefined ? 'SET_WHITE' : 'SET_BLACK', game: id, title: req.body.title, whitePlayer: req.body.whitePlayer, blackPlayer: req.body.blackPlayer, time: req.body.time });
    }, 

    subscribe: async (req, res) => {
        if (!req.isSocket) {
            return res.badRequest();
        }

        let games = await Game.find({});

        try {
			Game.subscribe(req, ['game']);
		} catch(err) {
			return res.serverError(err);
        }

        return res.ok(games);
    }
};

