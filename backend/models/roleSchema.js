const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
    {
        resource: {
            type: String,
            required: true,
            trim: true
        },
        action: {
            type: String,
            required: true,
            trim: true
        },
        fields: [
            {
                type: String,
                trim: true
            }
        ]
    },
    { _id: false }
);

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        permissions: [permissionSchema]
    },
    { timestamps: true }
);

module.exports = mongoose.model('role', roleSchema);
