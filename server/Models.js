import dotenv from 'dotenv';
dotenv.config();
URL = process.env.Database_String;
import mongoose from 'mongoose';
mongoose.connect(URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to database');
});
const Schema = mongoose.Schema;
const Model = mongoose.model;








const userSchema = new Schema({
    _id:{
        type: String,
        required: true
    },
    Email:{
        type: String,
        required: true,
        lowercase: true,
    },
    Authentication:{
        Token:{
            type: String,
        },
        Date:{
            type: Date,
            default: Date.now
        }
    },
    Tokens_Earned:{
        type: Number,
        required: true
    },
    Journals:[
        {
            ID:{
                type: String,
                required: true
            },
            Title:{
                type: String,
                required: true
            },
            Description:{
                type: String,
                required: true
            },
            Date:{
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Users = Model('Users', userSchema);

export {Users};