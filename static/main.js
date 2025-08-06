// Configuración (puedes cambiar esto sin tocar el resto del código)
const API_BASE_URL = 'http://localhost:3000'; // Cambia esto a tu URL base de la API
const VIDEO_UPLOAD_ENDPOINT = '/api/v1/generation/upload';
const STEAM_LOGIN_ENDPOINT = '/auth/steam';

document.addEventListener('DOMContentLoaded', () => {
    let videoName = '';
    const videoInput = document.getElementById('videoUrl');
    const generateButton = document.getElementById('generateBtn');

    // Lógica de subida
    document.getElementById('uploadBtn').addEventListener('click', async () => {
        const fileInput = document.getElementById('videoInput');
        const file = fileInput.files[0];

        if (!file) {
            alert('Selecciona un archivo primero.');
            return;
        }

        if (file.type !== 'video/mp4') {
            alert('Solo se permiten archivos .mp4');
            return;
        }

        const formData = new FormData();
        formData.append('video', file);

        try {
            const response = await fetch(`${API_BASE_URL}${VIDEO_UPLOAD_ENDPOINT}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Error en la subida');
            const result = await response.json();
            alert('Video subido con éxito!');

            generateButton.disabled = false; // Deshabilitar el botón después de procesar
            videoInput.value = result.message; // Asignar la URL del video al input

        } catch (err) {
            console.error(err);
            alert('Falló la subida del vídeo.');
        }
    });

    // Redirección al login de Steam
    document.getElementById('steamLoginBtn').addEventListener('click', () => {
        window.location.href = `${API_BASE_URL}${STEAM_LOGIN_ENDPOINT}`;
    });    // Lógica para procesar el nombre del video
    generateButton.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto
        
        /*if (!videoInput.value) {
            alert('Por favor, sube un video primero.');
            return;
        }*/

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/generation/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ videoName: videoInput.value })
            });

            if (!response.ok) throw new Error('Error al procesar el video');

            const result = await response.json();
            alert('Video procesado con éxito!');

        } catch (err) {
            console.error(err);
            alert('Falló el procesamiento del video.');
        }
    });
});



