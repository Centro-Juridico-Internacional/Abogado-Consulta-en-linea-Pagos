'use client';

import { useState, useRef } from 'react';

export default function AvatarUploadPage() {
	const inputFileRef = useRef(null);
	const [blob, setBlob] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [progress, setProgress] = useState(0);

	const handleUpload = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		setError('');
		setBlob(null);
		setProgress(0);

		try {
			const file = inputFileRef.current.files[0];
			if (!file) {
				throw new Error('No se seleccionó ningún archivo.');
			}

			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', (e) => {
				if (e.lengthComputable) {
					const percent = Math.round((e.loaded * 100) / e.total);
					setProgress(percent);
				}
			});

			xhr.onreadystatechange = () => {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					setIsLoading(false);
					if (xhr.status === 200) {
						const newBlob = JSON.parse(xhr.responseText);
						setBlob(newBlob);
					} else {
						setError('Error al subir el archivo.');
					}
				}
			};

			xhr.open('POST', `/api/upload?filename=${encodeURIComponent(file.name)}`);
			xhr.send(file);
		} catch (err) {
			console.error(err);
			setError(err.message || 'Error inesperado.');
			setIsLoading(false);
		}
	};

	return (
		<>
			<h1>Subir tu Avatars</h1>

			<form onSubmit={handleUpload}>
				<input name="file" ref={inputFileRef} type="file" accept="image/*" required />
				<button type="submit" disabled={isLoading}>
					{isLoading ? 'Subiendo...' : 'Subir'}
				</button>
			</form>

			{/* Barra de progreso */}
			{isLoading && (
				<div style={{ marginTop: '10px' }}>
					<p>Progreso: {progress}%</p>
					<div
						style={{ width: '100%', backgroundColor: '#eee', height: '10px', borderRadius: '5px' }}
					>
						<div
							style={{
								width: `${progress}%`,
								height: '10px',
								backgroundColor: '#4caf50',
								borderRadius: '5px',
								transition: 'width 0.2s'
							}}
						/>
					</div>
				</div>
			)}

			{/* Mensaje de error */}
			{error && <p style={{ color: 'red', marginTop: '10px' }}>⚠️ {error}</p>}

			{/* Imagen subida */}
			{blob && (
				<div style={{ marginTop: '20px' }}>
					<p>
						Archivo subido:{' '}
						<a href={blob.url} target="_blank" rel="noopener noreferrer">
							{blob.url}
						</a>
					</p>
					<img
						src={blob.url}
						alt="Avatar Subido"
						style={{ width: '200px', height: 'auto', marginTop: '10px' }}
					/>
				</div>
			)}
		</>
	);
}
