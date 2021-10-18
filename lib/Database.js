const { Collection } = require('discord.js');
const logger = require('./Logger');

class Database {

    constructor(model) {
        this.items = new Collection();
        this.model = model;
    }

    async init() {
        logger.load('Database')
        const database = await this.model.find();
        for (const i in database) {
            const db = database[i];
            this.items.set(db.id, db.info);
        }
    }

    get(id, key, defaultValue) {
        if (this.items.has(id)) {
            const value = this.items.get(id)[key];
            return value == null ? defaultValue : value;
        }

        return defaultValue;
    }

    async set(id, key, value) {
        const data = this.items.get(id) || {};
        data[key] = value;
        this.items.set(id, data);

        const doc = await this.getDocument(id);
        doc.info[key] = value;
        doc.markModified('info');
        return doc.save();
    }

    async delete(id, key) {
        const data = this.items.get(id) || {};
        delete data[key];

        const doc = await this.getDocument(id);
        delete doc.info[key];
        doc.markModified('info');
        return doc.save();
    }

    async clear(id) {
        this.items.delete(id);
        const doc = await this.getDocument(id);
        if (doc) await doc.remove();
    }

    async getDocument(id) {
        const obj = await this.model.findOne({ id });
        if (!obj) {
            // eslint-disable-next-line new-cap
            const newDoc = await new this.model({ id, info: {} }).save();
            return newDoc;
        }

        return obj;
    }

}

module.exports = Database;