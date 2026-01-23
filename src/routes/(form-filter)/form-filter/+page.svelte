<script>
	import { FilterForm, FilterResults } from '$lib';
	const { data } = $props();
</script>

<FilterForm />
<FilterResults images={data.images} />
