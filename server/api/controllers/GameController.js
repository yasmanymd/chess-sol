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

        try {
            let game = await Game.create({id:guid(), title: req.body.title,  whitePlayer: req.body.whitePlayer, blackPlayer: req.body.blackPlayer, time: req.body.time });
			Game.publish(['game'], game);
		} catch(err) {
			return res.serverError(err);
		}

        return res.ok();
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

