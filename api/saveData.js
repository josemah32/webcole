import { google } from 'googleapis';

// Configuración de autenticación con la API de Google Sheets
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCjUxS+BNEPsBNS\njUz+MzI6xHT0kcVchvgEkaqF/zSvuoxY3nhq0Ze/cPIezPUMMznOBmJEy3VM9bbi\nL4Zw210SErV0fXe8Pb4P2V1t5sVs/tR9vlz0dzT7BT0pPt4WmBbkICimYWejx0HN\nqkjH7JC/r53rQen8g7NRl4EEyqXun97azLlAdeS2oCtVcl+KihFEgfF+NoH7rbSJ\nAp+kykRjO04bRqMVUavTOTVGL24ptaDiadATIu9Hz8+/XF6obdP2sUbYJ1V8Rouc\n6aOClphAC4f6UjN7JszxJSY5m9ZRaRkueUgwK+hBD81t7i0YFfs5VEw0ps1cJdZO\nJdssnI+ZAgMBAAECggEANgKM+vOr0RTIpwWMPwneI/oAtToZeqo1jYlAS3SkTzKR\nI/hZ+PUbyhbHMrFTnfe4t218BMUFovAkzPKrclnQkt/1+rJdLLZ8SlB26ZellRBG\nY9jWc4+SSSqn2aJtHiqoc0NBPhg7BjmoBKO50sdj7MfeIMTY5IUHAUXpSBTdv6W+\nRNpJWw3Fk5IGa7Il43A13yBc2zPyCzeiHzLp/DZ0Ch+CGUh02mKujyr+iHiHYxUr\nGQeXz2wiSzwW+dy+FEBvSWWsbTQRGiGaoU0jG7PatsEGQwVTburSewgi8Hb29z9k\nQDtJ5rXInbqtgeMiY145wREpcyCFNjm/69fMol2juwKBgQDXw1VASv1SFHMN6vXF\n07gVsi7AOe2/ih4yip+ePn0RD9kGNHoccJA061SQa14NDDvq1sAD/DYxqPLU8BBQ\n1oowWDpEQKilUMEfGPiiZpCbjx4Nw4Pg0sA7BwFO9guPGmk4go3giA+XxpjcN59g\n6dIO51rkkdc+yACC8Uzx2cRDfwKBgQDByEz2vLM1AAFZzaGzmwBXiZTHqLC3QWl0\n6GLWggyVsmUSY4qDB+mxDBpSeJAwgbCEgjzieroLy5dry0dCSKqrHac8S7zE/hnP\nxkOIB8WU/xSNTte+YFfb7Pq9m0tBH4ZCWeOkiWuZlX5N6d6OBNs2X5U4K88fLkih\nba7ZMrBY5wKBgQC53BOlzHMmr2LkzE9mWBis586J29zHMC0PEIarA90sQ2CJjc7a\njMRMMaOovDRKPQ2oH9FMHYh5grWbZChJ2mUze+zFOoWL0mJpbVNQYdWTitcyuAb0\nNddNgZ1I7X3Lic611RBuKAZ2kaa/nFJ4YzKFkBml51NpS1PVeBL2Csab9QKBgQCj\nyEZ8eErC7ek2XJ1h7wzf77Gm+sW5bXjTTaJUCQDX+TqBy04Dp0l10XPh5nJ//O0T\nYfxRs0bRt1aYzevBcyeEjwCM7rpyiQ2J1dm3/FGbt+hH8q5YApffkrDuVnXJafqQ\n0+aaZ2dhHL/u3E61HBenIiw9mJFrmjPa9JhGjRgNWwKBgQDVIgH2NH2ep6QbL7fK\nBYRIGTyCJibtgY+Bsjo5xkNmw7gDVQEsQqkZEbOOfJKdAN2iBszSwJzmCL3XJBkp\nJEprVGi3OKU6Grnh2zFo5welhC03K+dZJxD0kFFCMDsYYde3cPG0bR7YF6By7gh3\nJTGxGDy27Jdi8B+xOkNd/slk5A==\n-----END PRIVATE KEY-----\n`
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
