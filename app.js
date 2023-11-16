const express = require('express');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const userModel = require('./user.model');
const studentModel = require('./student.model');
const targetRelationService = require('./target-relation.service');


const app = express();
dotenv.config();

app.get('/', (req, res) => {
    res.send('app is working');
})

app.get('/insert', async (req, res) => {
    await userModel.insertMany([
        {
            username: 'username1',
            email: 'email1'
        },
        {
            username: 'username2',
            email: 'email2'
        },
        {
            username: 'username3',
            email: 'email3'
        }
    ])

    res.send('insert done');
})

app.get('/update', async (req, res) => {
    const result = await userModel.findByIdAndUpdate('64b664606e8984dbd73edc1a', [{
        $set: {
            password:
            {
                $concat: ['$username', '---', new Date().toISOString()]
            }
        }
    }], {
        new: true
    });
    res.send(result);
})

app.get('/student/insert', async (req, res) => {
    await studentModel.insertMany([
        {
            "student_id": "STU001",
            "score": [
                45,
                59,
                75,
                67,
                52,
                72
            ]
        },
        {
            "student_id": "STU001",
            "score": [
                45,
                59,
                75,
                67,
                52,
                72
            ]
        },
    ])

    res.send('insert done');
})

app.get('/student/nested', async (req, res) => {
    const result = await studentModel.find({}, {
        score: {
            $slice: [1, 2]
        }
    }).find({
        student_id: "STU001"
    });

    res.json(result)
})


app.get('/graph/insert', async (req, res) => {
    const result = await targetRelationService.seed()
    res.json(result)
})

app.get('/graph/getR-R/:targetId', async (req, res) => {
    const { targetId } = req.params;

    const result = await targetRelationService.getR_R(targetId)

    res.json(result)
})

app.get('/graph/getDN-R/:targetId', async (req, res) => {
    const { targetId } = req.params;

    const result = await targetRelationService.getDN_R(targetId)

    res.json(result)
})

app.get('/graph/getR-DN/:targetId', async (req, res) => {
    const { targetId } = req.params;

    const result = await targetRelationService.getR_DN(targetId)


    res.json(result)
})

app.get('/graph/getDN-R-DN/:targetId', async (req, res) => {
    const { targetId } = req.params;

    const result = await targetRelationService.getDN_R_DN(targetId)


    res.json(result)
})

app.get('/graph/getDN-R-V2/:targetId', async (req, res) => {
    const { targetId } = req.params;

    const result = await targetRelationService.getDN_R_V2(targetId)

    res.json(result)
})


mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log("server is running");
        });
    })
    .catch((err) => {
        console.log(err);
    });

mongoose.set('debug', true)