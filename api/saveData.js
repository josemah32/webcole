import { google } from 'googleapis';

// Configuración de autenticación con la API de Google Sheets
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, course, imageUrl } = req.body;
        
        try {
            const sheets = google.sheets({ version: 'v4', auth });
            const spreadsheetId = process.env.SPREADSHEET_ID;

            // Agregar los datos como una nueva fila en la hoja de cálculo
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: 'Sheet1!A:C', // Ajusta la pestaña y el rango según sea necesario
                valueInputOption: 'RAW',
                resource: {
                    values: [[name, course, imageUrl]]
                }
            });

            res.status(200).json({ message: 'Datos guardados en Google Sheets' });
        } catch (error) {
            console.error('Error al guardar en Google Sheets:', error);
            res.status(500).json({ message: 'Error al guardar los datos' });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}
