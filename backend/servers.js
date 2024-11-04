const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const Image = require('./models/Image');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error(err));

// Configuración de multer para la carga de imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir imágenes
app.post('/upload', upload.single('image'), async (req, res) => {
    const { name } = req.body;
    const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const newImage = new Image({ name, url: imageUrl });
    await newImage.save();
    res.status(201).json(newImage);
});

// Ruta para obtener todas las imágenes
app.get('/images', async (req, res) => {
    const images = await Image.find();
    res.json(images);
});

// Ruta para eliminar una imagen
app.delete('/images/:id', async (req, res) => {
    await Image.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});