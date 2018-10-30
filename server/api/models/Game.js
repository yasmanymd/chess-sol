/**
 * Game.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    id: {
      type: 'string',
      required: true
    },

    title: {
      type: 'string',
      required: true
    },

    whitePlayer: {
      type: 'string',
      required: false
    },

    blackPlayer: {
      type: 'string',
      required: false
    },

    time: {
      type: 'number',
      required: true
    }
  },

};

