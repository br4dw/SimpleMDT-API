// Load classes and modules
const Database = require('../lib/Database');
const logger = require('../lib/Logger');
const model = require('../lib/model');
const util = require('../lib/Util');
const express = require('express');
const cors = require('cors');

const db = new Database(model);
const fs = require('fs');
const app = express();

// Extra
require('dotenv').config();
app.use(express.json());
app.use(cors());

// Initialize classes
logger.init();
util.init();
db.init();

app.get('/', async function(req, res) {
    logger.request('/');
    return res.send("true")
})

app.get('/characters', async function(req, res) {
	let user = req.query.userid;
	if (!user) return res.send("false");
	logger.request('/characters', user);
	let characters = await util.getCharacters(user, db);
	return res.send(JSON.stringify(characters));
})

app.get('/characters/get', async function(req, res) {
	let uuid = req.query.uuid;
	let userid = req.query.userid;
	logger.request('/characters/get', uuid);
	let character = await util.getCharacter(uuid, userid, db);
	return res.send(JSON.stringify(character));
})

app.get('/characters/search', async function(req, res) {
	let fname = req.query.fname;
	let lname = req.query.lname;
	let characters = await util.searchCharacter(fname, lname, db);
	logger.request('/characters/search', `${fname} ${lname} (${characters.length} results)`);
	return res.send(JSON.stringify(characters));
})

app.get('/characters/delete', async function(req, res) {
	let uuid = req.query.uuid;
	let userid = req.query.userid;
	logger.request('/characters/delete', uuid);
	let character = await util.deleteCharacter(uuid, userid, db);
	return res.send(JSON.stringify(character));
})

app.post('/characters/create', async function(req, res) {
	let user = req.query.userid;
	if (!user) return res.send("false");
	let authHeader = req.headers.authorization;
	if (!authHeader) return res.send("false");
	let validUser = await util.verifyUser(authHeader.split(' ')[1]);
    if (!validUser) {
        res.status(401).send(JSON.stringify({message: "401: Unauthorized"}))
    }
    let data = req.body;
	logger.request('/characters/create', `${data.fname} ${data.lname}`);
	let character = await util.createCharacter(user, db, req.body);
	return res.send(JSON.stringify(character));
})

app.get('/vehicles', async function(req, res) {
	let uuid = req.query.uuid;
	let user = req.query.userid;
	logger.request('/vehicles', user);
	let vehicles = await util.getVehicles(uuid, user, db);
	return res.send(JSON.stringify(vehicles));
})

app.post('/vehicles/create', async function(req, res) {
	let uuid = req.query.uuid;
	let user = req.query.userid;
	if (!user) return res.send("false");
	let authHeader = req.headers.authorization;
	if (!authHeader) return res.send("false");
	let validUser = await util.verifyUser(authHeader.split(' ')[1]);
    if (!validUser) {
        res.status(401).send(JSON.stringify({message: "401: Unauthorized"}))
    }
    let data = req.body;
	logger.request('/vehicles/create', `${data.make} ${data.model}`);
	let vehicle = await util.createVehicle(uuid, user, db, req.body);
	return res.send(JSON.stringify(vehicle));
})

app.listen(process.env.port, () => logger.load('Express', `http://localhost:${process.env.port}`));