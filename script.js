document.getElementById("uploadForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const course = document.getElementById("course").value;
    const imageFile = document.getElementById("image").files[0];
    const clientId = 'cc3243a6889aef6'; // Reemplaza con tu Client ID de Imgur

    // Verifica que todos los campos están completos
    if (!name || !course || !imageFile) {
        alert("Por favor completa todos los campos.");
        return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        // Subir imagen a Imgur
        const response = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
                Authorization: `Client-ID ${clientId}`
            },
            body: formData
        });
        
        const data = await response.json();

        if (data.success) {
            const imageUrl = data.data.link;
            document.getElementById("status").innerText = "¡Imagen subida con éxito!";
            
            // Enviar los datos a la API de Vercel para guardarlos
            const saveResponse = await fetch("https://webcole.vercel.app/api/saveData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, course, imageUrl })
            });
            
            if (saveResponse.ok) {
                document.getElementById("status").innerText = "¡Datos guardados con éxito!";
            } else {
                document.getElementById("status").innerText = "Error al guardar los datos.";
            }
        } else {
            document.getElementById("status").innerText = "Error al subir la imagen.";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("status").innerText = "Error al subir la imagen.";
    }
});
