const express = require("express")
const app = express()
const uuid = require("uuid")
const port = 3000

app.use(express.json())


const orders = [] 

const checkUserId = (request, response, next) => {

    const { id } = request.params
    const index = orders.findIndex( user => user.id === id )
    
    if (index < 0) {
        return response.status(404).json({message: "client not found"})
    }

    request.userIndex = index
    request.userId = id
    
    next ()
}

const showMethod = (request, response, next) => {

    console.log(`Method: ${request.method}, url: ${request.url}`)

    next ()
}

app.post("/order", showMethod, (request, response) => {

    const { order, name, price } = request.body
    const newOrder = {id: uuid.v4(), order, name, price, status: "Em preparação"}

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.get("/order", showMethod, (request, response) => {
    return response.json(orders)
})

app.get("/order/:id", checkUserId, showMethod, (request, response) => {

    const index = request.userIndex

    return response.status(201).json(orders[index])
})

app.put("/order/:id", checkUserId, showMethod, (request, response) => {

    const id = request.userId
    const index = request.userIndex
    const { order, name, price } = request.body
    const updateOrder = { id, order, name, price, status: "Em preparação" }

    orders[index] = updateOrder

    return response.status(201).json(updateOrder)
})

app.delete("/order/:id", checkUserId, showMethod, (request, response) => {

    const index = request.userIndex
    orders.splice(index, 1)

    return response.status(204).json()
})

app.patch("/order/:id", checkUserId, showMethod, (request, response) => {

    const id = request.userId
    const index = request.userIndex
    const { order, name, price } = request.body
    const updateOrder = { id, order, name, price, status: "Pronto" }

    orders[index] = updateOrder

    return response.status(201).json(updateOrder)
})

app.listen(port, () => {
    console.log(`🚀 server started on port ${3000}`)
})