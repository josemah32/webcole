document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nameInput = document.getElementById('nameInput').value.trim();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!nameInput) {
        alert("Por favor, introduce tu nombre.");
        return;
    }

    if (!file) {
        alert("Por favor, selecciona un archivo.");
        return;
    }

    // Crea un FormData para enviar la imagen
    const formData = new FormData();
    formData.append('image', file);

    try {
        // Envía la imagen a Imgur usando tu Client ID
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: 'Client-ID 3e6496959d9b209', // Reemplaza TU_CLIENT_ID con tu Client ID de Imgur
            },
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            const imageUrl = result.data.link;
            // Muestra el mensaje de éxito
            document.getElementById('status').innerText = "Imagen subida con éxito!";

            // Añade el nombre y la URL a la lista de imágenes subidas
            const uploadedImages = document.getElementById('uploadedImages');
            const imageElement = document.createElement('div');
            imageElement.innerHTML = `
                <p><strong>Nombre:</strong> ${nameInput}</p>
                <p><strong>URL:</strong> <a href="${imageUrl}" target="_blank">${imageUrl}</a></p>
                <img src="${imageUrl}" alt="${nameInput}" style="max-width: 200px; margin-top: 10px;">
            `;
            uploadedImages.appendChild(imageElement);
        } else {
            document.getElementById('status').innerText = "Hubo un problema al subir la imagen.";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('status').innerText = "Hubo un error al subir la imagen.";
    }
});
