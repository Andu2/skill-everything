<script lang="ts">
	import Game from "@src/ui/Game.svelte"
	import { start } from "@src/engine/tick";
	import { saveState, loadState } from "@src/engine/state";
	import { isDev } from "@src/utils";

	let gameState = loadState();
	start(gameState);
	if (isDev() && window !== undefined) {
		window["gameState"] = gameState;
	}
</script>

<main>
	<Game gameState={gameState} />
</main>

<style>
</style>