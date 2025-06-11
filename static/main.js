// Configuración (puedes cambiar esto sin tocar el resto del código)
const API_BASE_URL = 'http://localhost:3000';
const VIDEO_UPLOAD_ENDPOINT = '/api/v1/generation/upload';
const STEAM_LOGIN_ENDPOINT = '/auth/steam';

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
        alert('Vídeo subido con éxito!');
        console.log(result);
    } catch (err) {
        console.error(err);
        alert('Falló la subida del vídeo.');
    }
});

// Redirección al login de Steam
document.getElementById('steamLoginBtn').addEventListener('click', () => {
    window.location.href = `${API_BASE_URL}${STEAM_LOGIN_ENDPOINT}`;
});