const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product = require('./models/products');

mongoose.connect('mongodb+srv://MyUser:Password@clusterforlearn.nhhdaya.mongodb.net/?appName=clusterForLearn')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

// Middleware pour gérer les CORS
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Retournera tous les produits sous la forme{ products: Product[] }
app.get("/api/products", (req, res, next) => {
    Product.find()
    .then(things => res.status(200).json({ products: things }))
    .catch(error => res.status(400).json({ error }));
});

//Retournera le produit avec le_id fourni sous la forme { product: Product }
app.get("/api/products/:id", (req, res, next) => {
    Product.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json({ product: thing }))
    .catch(error => res.status(404).json({ error }));
});

//Créera un nouveau Product dans la base de données. Il retournera le Product ainsi créé (y compris son champ _id ), sous la forme{ product: Product }.
app.post("/api/products", (req, res, next) => {
    const product = new Product({...req.body });
product.save()
.then(product => res.status(201).json({ product }))
.catch(error => res.status(400).json({ error }));
});

//Modifiera le produit avec le _id fourni selon les données envoyées dans le corps de la requête.
app.put("/api/products/:id", (req, res, next) => {
    Product.updateOne({ _id: req.params.id }, 
        { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

//Supprimera le produit avec le _id fourni.Retournera un objet de la forme { message: 'Deleted!' }
app.delete("/api/products/:id", (req, res, next) => {
    Product.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Deleted!' }))
    .catch(error => res.status(400).json({ error }));   
});



module.exports = app;