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

    static async getVehicles(uuid, user, db) {
        let character = await this.getCharacter(uuid, user, db);
        return character.vehicles.length > 0 ? character.vehicles : [];
    }

   	static async getCharacter(uuid, user, db) {
   		let characters = await db.get(user, 'characters', []);
   		let character = characters.filter(c => uuid === c.uuid);
   		return character.length == 1 ? character[0] : false;
   	}

    static async searchCharacter(fname, lname, db) {
        let chars = [];
        let filtered = db.items.map(c => c)[0].characters
            .filter(c => c.fname.toLowerCase() === fname.toLowerCase() && c.lname.toLowerCase() === lname.toLowerCase())
        return filtered;
    }

    static async deleteCharacter(uuid, user, db) {
        let characters = await db.get(user, 'characters', []);
        let filtered = characters.filter(c => uuid !== c.uuid);
        await db.set(user, 'characters', filtered);
        return true;
    }

   	static async createCharacter(user, db, data) {
        data.dob = new Date(data.dob);
   		data = {uuid: this.uuid(), ...data, vehicles: []}
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
        return data;
   	}

    static async createVehicle(uuid, user, db, data) {
        data = {uuid: this.uuid(), ...data}
        let vehicles = await this.getVehicles(uuid, user, db);
        let character = await this.getCharacter(uuid, user, db);
        let updatedCharacter = {...character, vehicles: [...vehicles, data] }
        let characters = await db.get(user, 'characters', []);
        let finalUpdate = [updatedCharacter, ...characters.filter(c => uuid !== c.uuid)]
        await db.set(user, 'characters', finalUpdate);
        return true;
    }

}

module.exports = Util;