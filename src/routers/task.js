const express = require('express');
const router = new express.Router();
const Task = require('../models/task');

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
        console.log(task);
    } catch (e) {
        res.status(400).send(e);
        console.log(e.message);
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        const count = await Task.countDocuments();
        res.send(tasks);
        console.log(tasks);
        console.log('Total tasks:', count);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
        console.log(task);
    } catch (e) {
        res.status(500).send();
    }
});


router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(key => allowedUpdates.includes(key));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid operation...' });
    };
    try {
        const _id = req.params.id;
        const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send();
        }
        console.log(task);
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
        console.log(task);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;