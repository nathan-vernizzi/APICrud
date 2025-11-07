const express = require ('express');
const cors = require ('cors');
const mysql = require ('mysql2/promise')

const app = express()
app.use(cors())
app.use(express.json())

const dbConfig = {
    host:'localhost',
    port:3306,
    user:'root',
    password:'root',
    database:'dbtest'
}

let pool;

(
    async ()=>{
        pool = await mysql.createPool(dbConfig)
    }
)()

app.get('/rotaVer', async(req, res)=>{
    try{
        const [rows] = await pool.query('SELECT nome FROM teste');
        res.json(rows)
    }
    catch(e){
        console.log("Erro", e)
    }
})

app.post('/testeAdd', async (req, res) => {
    try {
        const { nome } = req.body;
        await pool.query('INSERT INTO teste (nome) VALUES (?)', [nome]);
        res.json({ mensagem: 'Registro inserido com sucesso!' });
    }
    catch (e) {
        console.log("Erro", e);
        res.status(500).json({ erro: 'Erro ao inserir registro' });
    }
});

app.put('/rotaUpdate/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;
        const [result] = await pool.query('UPDATE teste SET nome = ? WHERE id = ?', [nome, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Registro não encontrado' });
        }

        res.json({ mensagem: 'Registro atualizado com sucesso!' });
    }
    catch (e) {
        console.log("Erro", e);
        res.status(500).json({ erro: 'Erro ao atualizar registro' });
    }
});

app.delete('/rotaDel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM teste WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Registro não encontrado' });
        }

        res.json({ mensagem: 'Registro excluído com sucesso!' });
    }
    catch (e) {
        console.log("Erro", e);
        res.status(500).json({ erro: 'Erro ao excluir registro' });
    }
});

app.listen(3003, ()=>{
    console.log("O pai tá ON")
})