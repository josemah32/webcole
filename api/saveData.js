const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Método no permitido' });
        return;
    }

    const { name, course, imageUrl } = req.body;

    if (!name || !course || !imageUrl) {
        res.status(400).json({ message: 'Faltan datos' });
        return;
    }

    const data = `${name}, ${course}, ${imageUrl}\n`;
    const filePath = path.resolve('./', 'subidas.txt');

    // Agregar los datos al archivo de texto
    try {
        fs.appendFileSync(filePath, data, 'utf8');
        res.status(200).json({ message: 'Datos guardados exitosamente' });
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        res.status(500).json({ message: 'Error al guardar los datos' });
    }
}
