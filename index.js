//const dotenv = require('dotenv')
//dotenv.config()
const express = require('express');
const app = express();
const mysql = require('mysql')
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'test'
});

/*
const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
})
*/

connection.connect((e) => {
    e
        ? console.error("No se ha podido conectar a MySQL")
        : console.log("MySQL conectado")
})


app.get('/menus', (req, res) => {
    connection.query('SELECT * FROM `menu`;', (err, results) => {
        err
            ? res.send({ mensaje: "No se ha podido realizar la consulta" })
            : results.length > 0
                ? res.send({ mensaje: "Consulta realizada", results })
                : res.send({ mensaje: "Consulta realizada sin resultados", results })
    })
})

app.post('/nuevoMenu', (req, res) => {
    let { plato1, postre, plato, precio } = req.body
    connection.query('INSERT INTO menu (plato1, postre, plato, precio) VALUES (?,?,?,?)', [plato1, postre, plato, precio], (err, results) => {
        err
            ? res.send({ mensaje: "No se ha podido realizar la consulta" })
            : results.insertId != null
                ? res.send({ mensaje: "Consulta realizada", results })
                : res.send({ mensaje: "No se ha podido insertar en la BBDD", results })
    })
})

app.put('/editarMenu/:id', function (req, res) {
    const { plato1, postre, plato, precio } = req.body;
    const numero = req.params.id;
    connection.query(
        "UPDATE menu SET plato1 = ?, postre = ?, plato = ?, precio = ? WHERE id = ?",
        [plato1, postre, plato, precio, numero],
     (error, results) => {
            if (error) {
                res.send({ mensaje: 'Error al actualizar datos en la base de datos' });
            } else {
                if(results.changedRows > 0){
                res.send({mensaje: "Documento actualizado", results})
                }else{
                    res.send({mensaje: "No se ha encontrado el documento", results})
                }
            }
        }
    );
});

app.delete('/borrarMenu/:id', function (req, res) {
    const numero = req.params.id;
    connection.query(
        "DELETE FROM menu WHERE id = ?",
        [numero],
        (error, results) => {
            if (error) {
                res.send({ mensaje: 'Error al borrar en la base de datos' });
            } else {
                if (results.changedRows > 0) {
                    res.send({ mensaje: "Documento borrado", results })
                } else{
                    res.send({mensaje: "No se ha encontrado el documento", results})
                }
            }
        }
    );
});

app.listen(PORT, (e) =>
    e
        ? console.log("Servidor fallido")
        : console.log("Servidor conectado en el puerto: " + PORT))