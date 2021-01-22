const express = require('express')
const router = express.Router()
const passport = require('passport')

/* GET login page. */
router.get('/', (req, res, next) => {
    if (req.query.fail)
        res.render('login', { title: 'Login', message: 'Usuário e/ou senha inválidos!' })
    else
    res.render('login', { title: 'Login', message: null })
})

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?fail=true'
}))

module.exports = router