const express = require('express')
const dotenv = require('dotenv')
const morgan =  require('morgan')
const colors =  require('colors')
const errorHandler = require('./middlewares/error')
const cors = require('cors')

dotenv.config({ path: './config/config.env' })
const driver = require('./config/db')

const app = express()

const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))


//Route files
const clients = require('./routes/clients')
const persons = require('./routes/persons')
const withdrawals = require('./routes/withdrawals')
const transfers = require("./routes/transfers")
const deposits = require('./routes/deposits')

//Body Parser
app.use(express.json()) //Sin esta linea, los controladores no acceden al req.body

//Middleware function that assigns the driver object to req.driver, so it is accessible inside the route handlers
app.use((req, res, next) => {
    req.driver = driver
    next()
});

// Dev logging middlewares
if(process.env.NODE_ENV == 'development') app.use(morgan('dev'))
//Mount routes
app.use('/api/v1/clients', clients)
app.use('/api/v1/persons', persons)
app.use('/api/v1/withdrawals', withdrawals)
app.use('/api/v1/transfers', transfers)
app.use('/api/v1/deposits', deposits)
//Error handler middleware -> Must be after Mounting routes so it works in those. Middleware kinda works in a linear order. 
app.use(errorHandler)

//Launch server
const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

// Handled unhandled promised rejections
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error ${err.message}`.red.italic)
    // Close server & exit process
    server.close(()=>{process.exit(1 )})
})