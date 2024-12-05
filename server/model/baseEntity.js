// Importing modules
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');


// Creating BaseEntity schema
const BaseEntitySchema = mongoose.Schema({
    _id:{ type: String, default: () => new ObjectId().toString() },
    createdBy:String,
    createdDate : { type: Date, default: Date.now },
    createdByName:String,
    updatedBy : String,
    updatedDate : { type: Date },
    updatedByName : String
});
BaseEntitySchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedDate: Date.now() });
    next();
});

// Exporting module to allow it to be imported in other files
const BaseEntity = mongoose.model('BaseEntity', BaseEntitySchema);

module.exports = BaseEntity;