import { getImages } from '$lib/server';

export async function load() {
	return {
		images: await getImages()
	};
}