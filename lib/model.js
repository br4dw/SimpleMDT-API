const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb://localhost/${process.env.DATABASE}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const schema = new Schema({
    id: {
        type: String,
        required: true
    },
    info: {
        type: Object,
        require: true
    }
}, { minimize: false });

module.exports = mongoose.model('user', schema);