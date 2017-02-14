const
  express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  PORT = 3000,
  mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost/locations-app'

  mongoose.connect(mongoUrl, (err) => {
  console.log(err || "Connected to MongoDB.")
})


  app.use(morgan('dev'))
  app.use(bodyParser.json())
  app.use(express.static(process.env.PWD + '/www'))


// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

//model


  var Trip = mongoose.model('Trip', {
    start: Date,
    locationInfo: {},
    end: Date,
    topMPH: Number,
  })

  var Parent = mongoose.model('Parent',{
    name: {type: String},
    children: [{type: mongoose.Schema.Types.ObjectId, ref: 'Child'}]
  })

  var Child = mongoose.model('Child', {
    name: {type: String},
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent'},
  })


//this sends the html file to the server
  app.get('/', (req, res) => {
    res.sendFile(process.env.PWD + '/www/index.html')
  })

  app.get('/trips', (req, res) => {
    Trip.find({}, function(err, trips) {
      res.json(trips)
    })
  })

  app.post('/trips', function(req, res) {
    Trip.create(req.body, function(err, trip) {
      res.send({message: "you done send me sumptin: ", trip: trip})
    })
  })

  app.post('/parent', function(req, res){
    Parent.create(req.body, function(err, parent){
      res.send({ message: "parent has been created", parent: parent})
    })
  })

  app.get('/parents', (req, res) => {
    Parent.find({}, function(err, parents) {
      res.json(parents)
    })
  })

  app.get('/parent/:id', (req, res) => {
    Parent.findById(req.params.id, function(err, parent){
      console.log('at least im trying')
      res.sendFile('parent.html', {root: __dirname})
    })
  })

  app.post('/child', function(req, res){
    var newChild = new Child(req.body)
    newChild.parent = req.params.id

    // Child.create(req.body, function(err, child){
    //   res.send({message: 'child has been created', child: child})
    // })
  })

  app.get('/child/:id', (req, res) => {
    Child.find({}, function(err, child) {
      res.json(child)
    })
  })

//this sends the html file to the server
  // app.get('/', (req, res) => {
  //   res.sendFile(process.env.PWD + '/www/index.html')
  // })
  //
  // app.get('/trips', (req, res) => {
  //   Trip.find({}, function(err, trips) {
  //     res.json(trips)
  //   })
  // })
  //
  // app.post('/trips', function(req, res) {
  //   Trip.create(req.body, function(err, trip) {
  //     res.send({message: "you done send me sumptin: ", trip: trip})
  //   })
  // })

app.listen(PORT, (err) => {
  console.log(err || "server running on port " + PORT)
})
