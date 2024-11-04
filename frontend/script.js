document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nameInput = document.getElementById('nameInput').value.trim();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!nameInput || !file) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const formData = new FormData();
    formData.append('name', nameInput);
    formData.append('image', file);

    try {
        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            loadImages(); // Recargar las imágenes después de subir
            document.getElementById('status').innerText = "Imagen subida con éxito!";
            document.getElementById('uploadForm').reset(); // Limpiar el formulario
        } else {
            alert("Hubo un problema al subir la imagen.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al subir la imagen.");
    }
});

// Cargar imágenes desde el servidor
async function loadImages() {
    const response = await fetch('http://localhost:5000/images');
    const images = await response.json();

    const uploadedImagesDiv = document.getElementById('uploadedImages');
    uploadedImagesDiv.innerHTML = ''; // Limpiar el contenedor antes de cargar nuevas imágenes

    images.forEach(image => {
        const imageElement = document.createElement('div');
        imageElement.innerHTML = `
            <p><strong>Nombre:</strong> ${image.name}</p>
            <img src="${image.url}" alt="${image.name}" style="max-width: 200px;">
            <button onclick="deleteImage('${image._id}')">Eliminar</button>
            <hr>
        `;
        uploadedImagesDiv.appendChild(imageElement);
    });
}

// Función para eliminar imágenes
async function deleteImage(id) {
    const response = await fetch(`http://localhost:5000/images/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        loadImages(); // Recargar las imágenes después de eliminar
    } else {
        alert("Error al eliminar la imagen.");
    }
}

// Cargar imágenes al inicio
loadImages();
