/* eslint-disable indent */
import { Schema, model } from 'mongoose'
import monsoosePaginate from 'mongoose-paginate-v2'

const schema = new Schema({
    first_name: {
        type: String,
        required: true,
        max: 100
    },
    last_name: {
        type: String,
        required: true,
        max: 100
    },
    email: {
        type: String,
        required: true,
        max: 100,
        unique: true
    },
    age: {
        type: Number,
        required: false
    },

    password: {
        type: String,
        required: true,
        max: 100
    },
    cartID: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    }
})
schema.plugin(monsoosePaginate)
export const UserModel = model('users', schema)
