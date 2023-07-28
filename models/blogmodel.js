const mongoose = require('mongoose')
const schema = mongoose.Schema;

const blogschema = new schema({
    feed:[{title: String, post: String}],
    username: String,
    password: String

})

module.exports= mongoose.model('Post', blogschema);

// const loginschema = new schema({
//     username: String,
//     password: String
// })

// module.exports = mongoose.model('Username', )