const {Router} = require('express')
const Link = require('../models/Link')
const auth = require('../middleware/auth.middleaware')
const config = require('config')
const shortid = require('shortid')
const router = Router()

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')
        const {from} = req.body

        const code = shortid.generate()

        const exiting = await Link.findOne({ from })

        if (exiting) {
            return res.json({ link: exiting})
        }
        const to = baseUrl + '/t/' + code
        const link = new Link(
            {
                code,
                to,
                from,
                owner: req.user.userId
            }
            )
        await link.save()

        res.status(201).json({ link })
    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так... ну шо ты тупишь....("})
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({ owner: req.user.userId} )
        res.json(links)
    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так..."})
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id)
        res.json(link)
    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так..."})
    }
})

module.exports = router