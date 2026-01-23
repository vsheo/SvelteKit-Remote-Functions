// npm install valibot
import * as v from 'valibot';
import { form } from '$app/server';
import { getImages } from '$lib/server';

// Define a remote form action that filters images
export const filterImages = form(
	// Valibot schema describing the expected form input
	// - Valibot validates the incoming form data on the server
	// - Validation runs BEFORE the async handler is executed
	// - If the data does NOT match this schema,
	//   the async handler is NOT called and a validation error is returned
	v.object({
		// - Both fields are optional because the user might not select anything
		// - Arrays are used because checkboxes can send multiple values
		id: v.optional(v.array(v.string())),
		title: v.optional(v.array(v.string()))
	}),
	// Async that runs when the form is submitted. This is where the form request is sent
	// ---------------------- EVERYTHING INSIDE IS WHAT YOUR REMOTE FUNCTION DOES ON THE SERVER ----------------------
	async ({ id, title }) => {
		// Retrieve the full list of images from the lib/server/images
		const images = getImages();

		// Combine the submitted form values into a single filters object
		// This structure matches what the filterList function expects
		const filters = { id, title };

		// Use the reusable filterList function to search for the item
		const filtered = filterList(images, filters);

		// Debug: log the filtered result on the server
        console.log('FILTERED RESULTS')
		console.log(filtered);

		// Return the filtered images and active filters
		// The returned data is sent back to the page automatically
		return {
			data: {
				images: filtered
			}
		};
	}
	// ---------------------- EVERYTHING INSIDE IS WHAT YOUR REMOTE FUNCTION DOES ON THE SERVER ----------------------
);

// A function for filtering
function filterList(items, fields) {
	const ids = fields.id?.map(String) ?? [];
	const titles = fields.title?.map((t) => String(t).toLowerCase()) ?? [];

	if (!ids.length && !titles.length) return items;

	return items.filter((item) => {
		const idMatch = ids.length ? ids.includes(String(item.id)) : false;
		const titleMatch = titles.length
			? titles.some((t) => String(item.title).toLowerCase().includes(t))
			: false;

		return idMatch || titleMatch;
	});
}
