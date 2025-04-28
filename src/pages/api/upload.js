import { put } from '@vercel/blob';

export async function post({ request }) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    // Lee todo el body como un Buffer
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const blob = await put(filename, buffer, {
        access: 'public',
        token: 'vercel_blob_rw_UnA407qIo0rLSr7t_5f2JyKgGsWYp90jNq6dH16sM6cCiVc', // Tu token correcto
    });

    return new Response(JSON.stringify(blob), { status: 200 });
}
