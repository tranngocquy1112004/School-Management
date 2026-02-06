const mongoose = require("mongoose");

const sclassSchema = new mongoose.Schema({
    sclassName: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    // audit
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'updatedByModel'
    },
    updatedByModel: {
        type: String,
        enum: ['admin', 'teacher']
    }
}, { timestamps: true });

module.exports = mongoose.model("sclass", sclassSchema);

