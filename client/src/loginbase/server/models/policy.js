const mongoose = require("mongoose");
mongoose.set('debug', true);
require('../db');

const policySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
    // You can add more fields if necessary
});

const Policy = mongoose.model('policy', policySchema);

module.exports = Policy;
