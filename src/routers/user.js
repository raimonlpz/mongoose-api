const express = require('express');
const router = new express.Router();
const User = require('../models/user');


router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
        console.log(user);
    } catch (e) {
        res.status(400);
        res.send(e);
        console.log(e.message);
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        const count = await User.countDocuments();
        res.send(users);
        console.log(users);
        console.log('Total users:', count);
    } catch (e) {
        res.status(500).send();
    };
});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
        console.log(user);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates...' });
    };

    const _id = req.params.id;
    try {
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
        console.log(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/users/:id', async (req, res) => {
    let _id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
});


module.exports = router;

