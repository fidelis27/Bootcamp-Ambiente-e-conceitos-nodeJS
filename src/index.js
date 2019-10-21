const express = require('express')

const server = express()

//Query params users?nome=Thiago get
//Route params /users/1 get
//Request params = {"nme":"Thiago"} put and post


//exemplo requisição com query
/* server.get('/users', (req, res)=>{
    const nome = req.query.nome
    return res.json({message: `Hello ${nome}`})
}) */
//exemplo de requisão com route
/* server.get('/users/:id', (req, res)=>{
    //const id = req.params.id
    const { id }   = req.params

    return res.json({message: `Hello ${id}`})
}) */

//use middleware que será chamado por todas rotas
//Pórem para prosseguir para rotas seguintes é necessário usar next()
server.use((req, res, next) => {
    console.time('Request')
    console.log('A requisição foi chamada...')
    //mostrando metodo,url que está sendo chamdo
    //middleware de log
    console.log(`Método ${req.method} url: ${req.url}`)
    next()
    console.timeEnd('Request')

})
//Middleware de checkagem do body PUT/POST
function checkUserExists(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({ error: 'User name is required' })
    }
    return next()
}
function checkUserInArray(req, res, next){
    const user = users[req.params.id]
    if(!user){
        return res.status(400).json({ error: 'User is not exists!' })
    }
    req.user = user
    return next()
}

//Listando todos usuários
server.use(express.json())
const users = ['Thiago', 'Carol', 'Maria']
server.get('/users', (req, res) => {

    return res.json(users)
})
//Listando usuários por ID
server.get('/users/:id', checkUserInArray, (req, res) => {
    
    return res.json(req.user)
})
//Enviando dados via POST
server.post('/users', checkUserExists, (req, res) => {
    const { name } = req.body
    
    users.push(name)

    return res.json(users)
})
//Alterarndo dados via PUT
server.put('/users/:id', checkUserExists, checkUserInArray, (req, res) => {
    const { id } = req.params
    const { name } = req.body

    users[id] = name
    return res.json(users)
})
//Excluir usuário
server.delete('/users/:id', checkUserInArray, (req, res) => {
    const { id } = req.params
    users.splice(id, 1)
    return res.json(users)
})

server.listen(3333)