const uploadForm = document.getElementById("uploadForm");
const imageGallery = document.getElementById("imageGallery");

uploadForm.addEventListener("submit", async (e) => {
   e.preventDefault();
   const formData = new FormData(uploadForm);

   try {
      const response = await fetch("http://localhost:5000/upload", {
         method: "POST",
         body: formData,
      });

      if (response.ok) {
         alert("Imagen subida exitosamente");
         uploadForm.reset();
         fetchImages(); // Refresca la galería después de subir una imagen
      } else {
         alert("Error al subir la imagen");
      }
   } catch (error) {
      console.error("Error:", error);
   }
});

async function fetchImages() {
   try {
      const response = await fetch("http://localhost:5000/images");
      const images = await response.json();

      imageGallery.innerHTML = "";  // Limpia la galería antes de añadir nuevas imágenes

      images.forEach(image => {
         const imgElement = document.createElement("div");
         imgElement.innerHTML = `<p>${image.name}</p><img src="${image.imageUrl}" alt="${image.name}" width="100">`;
         imageGallery.appendChild(imgElement);
      });
   } catch (error) {
      console.error("Error:", error);
   }
}

fetchImages();  // Carga las imágenes al cargar la página