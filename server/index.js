const express = require('express')
const mysql = require('mysql')
const app = express()
const cors = require('cors')

app.use(cors())

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tasksapp'
})

conn.connect((err) => {
    if (err) {
        console.log(err)
        return
    } else {
        console.log('Połączono z bazą danych')
    }
})

app.get('/tasks/:userId', (req, res) => {
    const userId = req.params.userId
    const sql = `SELECT * FROM tasks WHERE user = ${userId} ORDER BY deadline`
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return
        } else {
            res.send(result)
        }
    })
})

app.get('/all-tasks', (req, res) => {
    const sql = `SELECT * FROM tasks ORDER BY deadline`
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return
        } else {
            res.send(result)
        }
    })
})

app.get('/add-task/:task/:deadline/:userId', (req, res) => {
    const userId = req.params.userId
    const task = req.params.task
    const deadline = req.params.deadline

    const sql = `INSERT INTO tasks (name, deadline, user) VALUES ('${task}', '${deadline}', ${userId})`

    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return
        } else {
            res.send('Dodano zadanie')
        }
    })
})

app.get('/edit-task/:id/:task/:deadline', (req, res) => {
    const id = req.params.id
    const task = req.params.task
    const deadline = req.params.deadline

    const sql = `UPDATE tasks SET name = '${task}', deadline = '${deadline}' WHERE id = ${id}`
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return
        } else {
            res.send('Zaktualizowano zadanie')
        }
    })
})

app.get('/delete-task/:id', (req, res) => {
    const id = req.params.id
    const sql = `DELETE FROM tasks WHERE id = ${id}`
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return
        } else {
            res.send('Usunięto zadanie')
        }
    })
})

app.listen(3000, () => {
    console.log('Aplikacja działa na porcie 3000')
})