async function uploadImageToImgur(imageFile) {
    const clientId = 'cc3243a6889aef6'; // Reemplaza con tu Client ID de Imgur
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const response = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
                Authorization: `Client-ID ${clientId}`
            },
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            return result.data.link; // Devuelve el enlace de la imagen en Imgur
        } else {
            console.error("Error al subir la imagen a Imgur:", result);
            return null;
        }
    } catch (error) {
        console.error("Error de red al subir a Imgur:", error);
        return null;
    }
}

async function saveDataToGoogleSheets(name, course, imageUrl) {
    try {
        const response = await fetch("/api/saveData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, course, imageUrl })
        });

        const result = await response.json();
        if (response.ok) {
            console.log(result.message);
        } else {
            console.error("Error al guardar en Google Sheets:", result.message);
        }
    } catch (error) {
        console.error("Error de red al guardar en Google Sheets:", error);
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const name = document.getElementById("name").value;
    const course = document.getElementById("course").value;
    const imageFile = document.getElementById("image").files[0];

    // Subir la imagen a Imgur
    const imageUrl = await uploadImageToImgur(imageFile);
    if (!imageUrl) {
        alert("Error al subir la imagen. Inténtalo de nuevo.");
        return;
    }

    // Guardar los datos en Google Sheets
    await saveDataToGoogleSheets(name, course, imageUrl);
    alert("Datos enviados exitosamente");
}
