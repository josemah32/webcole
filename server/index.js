require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log("Conectado a MongoDB"))
   .catch((err) => console.error(err));

// Definir el esquema y modelo de imagen
const imageSchema = new mongoose.Schema({
   name: String,
   imageUrl: String,
});

const Image = mongoose.model("Image", imageSchema);

// Configuración de multer para subir imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint para subir una imagen
app.post("/upload", upload.single("image"), async (req, res) => {
   const { name } = req.body;
   const imageUrl = `ruta_donde_se_almacena/${req.file.originalname}`;  // Define la URL donde se guardará
   const newImage = new Image({ name, imageUrl });
   
   try {
      await newImage.save();
      res.status(201).json({ message: "Imagen subida exitosamente", image: newImage });
   } catch (error) {
      res.status(500).json({ error: "Error al subir la imagen" });
   }
});

// Endpoint para obtener todas las imágenes
app.get("/images", async (req, res) => {
   try {
      const images = await Image.find();
      res.json(images);
   } catch (error) {
      res.status(500).json({ error: "Error al obtener las imágenes" });
   }
});

// Arrancar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Servidor corriendo en el puerto ${PORT}`);
});