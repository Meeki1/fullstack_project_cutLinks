const {Router} = require('express')
const router = Router()
const bcrypt = require('bcrypt')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')

router.post(
    '/register',
    [
        check('email', 'Некорректная почта').isEmail(),
        check('password', 'Минимальная длина пароля 8 символов').isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(),
                message: "Некорректные данные при регистрации"
            })
        }

        const {email, password} = req.body
        const candidate = await User.findOne({ email })
        console.log(candidate)
        if (candidate) {
            return res.status(400).json({message: "Такой пользователь уже существует"})
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPassword})
        await user.save()

        res.status(201).json({message: "Пользователь создан!"})


    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так..."})
    }
})

router.post(
    '/login',
    [
        check('email', 'Введите нормальный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json(
                {errors: errors.array(),
                    message: "Некорректные данные при входе в систему"
                })
        }

        const {email, password} = req.body

        const user = await User.findOne({email} )
        console.log(user)
        if (!user) {
            return res.status(400).json({message: "Пользователь не найден"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: "Неверный пароль"})
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h'}
        )

        res.json({ token, userId: user.id })
    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так..."})
    }

})

module.exports = router