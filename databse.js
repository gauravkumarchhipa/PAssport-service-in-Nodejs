const mongoose = require('mongoose');

exports.connectMongoose = () => {
    mongoose.connect('mongodb://0.0.0.0:27017/passport')
        .then((e) => console.log(`Connected to Mongodb : ${e.connection.host}`))
        .catch((err) => console.log(err));
}

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
});

exports.User = new mongoose.model("User", userSchema);