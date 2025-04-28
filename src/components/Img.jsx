import { useState } from 'react';

export default function AvatarUploadPage() {
	const [previewUrl, setPreviewUrl] = useState(null);
	const [file, setFile] = useState(null);

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		setFile(selectedFile);
		setPreviewUrl(URL.createObjectURL(selectedFile));
	};

	const handleUpload = async () => {
		if (!file) {
			alert('Primero selecciona un archivo');
			return;
		}

		const formData = new FormData();
		formData.append('file', file);
		formData.append('publicKey', 'public_/SbBJ+9L3/gRftphd7QP/Onf71k='); // Tu nueva public key
		formData.append('fileName', file.name);
		formData.append('folder', '/uploads'); // Opcional: Puedes cambiar o eliminar esta línea
		formData.append('useUniqueFileName', 'false');

		try {
			const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
				method: 'POST',
				headers: {
					Authorization: 'Basic ' + btoa('private_/ZigOOKAXzZSZ+cMr+BgTJm/6m8=' + ':') // Tu nueva private key
				},
				body: formData
			});

			const data = await response.json();
			console.log('Subida exitosa:', data);
			alert('Imagen subida correctamente');
		} catch (error) {
			console.error('Error al subir:', error);
			alert('Error al subir imagen');
		}
	};

	const testVariable = 'test2';

	return (
		<div>
			<h1>Subir Imagen a {testVariable}</h1>
			<img src={`https://ik.imagekit.io/desarrollo1/uploads/${testVariable}.png`} alt="" />

			<input type="file" onChange={handleFileChange} accept="image/*" />

			{previewUrl && (
				<div style={{ marginTop: '20px' }}>
					<h2>Vista previa:</h2>
					<img src={previewUrl} alt="Preview" width="300" />
				</div>
			)}

			<button
				style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
				onClick={handleUpload}
			>
				https://ik.imagekit.io/desarrollo1/{testVariable}.png
			</button>
		</div>
	);
}
