const app = require('./api/server')
const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`running on port ${port}`)
})