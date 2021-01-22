const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy

const users = [{
    _id: 1,
    username: 'adm',
    password: '$2a$06$HT.EmXYUUhNo3UQMl9APmeC0SwoGsx7FtMoAWdzGicZJ4wR1J8alW',  //To get the hash of password '123' execute bcrypt.hashSync('123')
    email: 'marcelocasamassa@gmail.com'
}]

module.exports = function(passport){
    //essas 2 functions obtemos os dados da memoria, o ideal seria buscar de um banco de dados
    function findUser(username){
        return users.find(item=> item.username === username)
    }
    function findUserById(id){
        return users.find(item=> item._id === id)
    }

    //no serialize o passport irá gerar um cookie no client e no servidor, nesse caso estamos armazenando um cookie apenas com o id do user, o cookie do servidor pode ser armazenado na memoria ou no banco de dados, vamos armazenar na memoria neste ex para facilitar
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    //no deserialize vamos fazer o processo inverso do serialize
    passport.deserializeUser((id, done) => {
        try {
            const user = findUserById(id)
            done(null, user)
        } catch(err) {
            console.log(err)
            return done(err, null)
        }
    })

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    (username, password, done)=> {
        try{
            const user = findUser(username)
            if(!user) return done(null, false)
            
            const isValid = bcrypt.compareSync(password, user.password)
            if(!isValid) return done(null, false)

            return done(null, user)

        }
        catch(err){
            console.log(err)
            return done(err, null)
        }
    }))
}