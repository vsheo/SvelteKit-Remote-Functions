<script>
	import { RemoteFilter } from '$lib/remote';

	// Read initial images passed in from the server (layout/page load)
	const props = $props();

	// Make a derived getter for initial images (fallback to [])
	const initialImages = $derived(() => props.images ?? []);

	// Local state that we actually render
	let allImages = $state(initialImages());

	// React to remote-form results
	$effect(() => {
		// RemoteFilter.result contains the latest server response after submit
		const filtered = RemoteFilter.result?.data?.images;

		// If we have filtered results, use them; otherwise use initial images
		const nextImages = filtered ?? initialImages();

		// Optional smooth transition if supported
		if (document.startViewTransition && filtered) {
			document.startViewTransition(() => {
				allImages = nextImages;
			});
		} else {
			allImages = nextImages;
		}
	});

</script>

<h2>Results</h2>
<div class="grid">
	{#each allImages as image}
		<div class="card">
			<img src={image.imageUrl} alt={image.title} />
			<h3>{image.title}</h3>
            <p>ID: {image.id}</p>
		</div>
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}

	.card {
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}

	img {
		width: 100%;
		height: auto;
		display: block;
	}

	h3, p {
		padding: 0.5rem;
		font-size: 1rem;
	}
</style>
