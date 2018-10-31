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
			await Game.publish(['game'], null, req);
		} catch(err) {
			return res.serverError(err);
		}

        console.log(req.body.whitePlayer);
        return res.ok({type: req.body.whitePlayer == undefined || req.body.whitePlayer == null || req.body.whitePlayer == '' ? 'SET_BLACK' : 'SET_WHITE', game: id, title: req.body.title, whitePlayer: req.body.whitePlayer, blackPlayer: req.body.blackPlayer, time: req.body.time });
    }, 

    joinGame: async (req, res) => {
        if (!req.isSocket) {
            return res.badRequest();
        }

        let game;
        let result; 

        try {
            game = await Game.findOne({id:req.body.game});
            await Game.destroy({id:req.body.game});
            await Game.publish(['game'], null, req);
            if (game.whitePlayer == undefined || game.whitePlayer == null || game.whitePlayer == '') {
                result = {type: 'SET_WHITE', game: req.body.game, title: game.title, whitePlayer: req.body.whitePlayer, blackPlayer: req.body.blackPlayer, time: game.time };
            } else {
                result = {type: 'SET_BLACK', game: req.body.game, title: game.title, whitePlayer: req.body.whitePlayer, blackPlayer: req.body.blackPlayer, time: game.time };
            }
		} catch(err) {
			return res.serverError(err);
		}

        return res.ok(result);
    },

    subscribe: async (req, res) => {
        if (!req.isSocket) {
            return res.badRequest();
        }

        try {
			await Game.subscribe(req, [req.body.event]);
		} catch(err) {
			return res.serverError(err);
        }

        return res.ok();
    },

    unsubscribe: async (req, res) => {
        if (!req.isSocket) {
            return res.badRequest();
        }

        try {
			await Game.unsubscribe(req, [req.body.event]);
		} catch(err) {
			return res.serverError(err);
        }

        return res.ok();
    }, 

    executeAll: async (req, res) => {
        if (!req.isSocket) {
            return res.badRequest();
        }

        try {
			sails.io.sockets.emit(req.body.game, req.body.action);
		} catch(err) {
			return res.serverError(err);
        }

        return res.ok();
    },

    executeExceptMe: async (req, res) => {
        if (!req.isSocket) {
            return res.badRequest();
        }

        try {
			sails.io.sockets.emit(req.body.game, req.body.action);
		} catch(err) {
			return res.serverError(err);
        }

        return res.ok();
    }

};