const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const logger = require('./Logger');

class Util {

    static init() {
        logger.loadClass('Util')
    }

    static async verifyUser(userToken) {
        const request = await fetch('http://discordapp.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
        const res = await request.json();
        return res.message === "401: Unauthorized" ? false : true ;
    }

    static uuid() {
	    return (
            new Date().getTime().toString(36) +
            Math.random().toString(36).slice(2)
        )
	    .match(/.{1,4}/g)
	    .join('-')
	    .toUpperCase();
    }

   	static async getCharacters(user, db) {
		return await db.get(user, 'characters', []);
   	}

   	static async getCharacter(uuid, user, db) {
   		let characters = await db.get(user, 'characters', []);
   		let character = characters.filter(c => uuid === c.uuid);
   		return character.length == 1 ? character[0] : false;
   	}

   	static async createCharacter(user, db, data) {
   		data = {...data, uuid: this.uuid()}
        let array = [];
        let database = db.get(user, 'characters', array);
        if (database.length < 1) {
            array.push(data);
        } else {
            for (let i = 0; i < database.length; i++) {
                array.push(database[i]);
            }
            array.push(data);
        }
        await db.set(user, 'characters', array);
   	}

}

module.exports = Util;