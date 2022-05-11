<script lang="ts">
	import type { GameState } from "@src/engine/state";
	export let resources: GameState["resources"];
</script>

<div>
	{#each Object.keys(resources) as resourceId}
	<div>
		{resourceId}: {resources[resourceId].amount}		
	</div>
	{/each}
</div>