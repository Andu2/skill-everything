<script lang="ts">
	import type { GameState } from "@src/engine/state";
	export let gameState: GameState;
	import Inventory from "@src/ui/Inventory.svelte"
	import { log } from "@src/engine/log";

	import { queueEffect } from "@src/engine/state";

	let thisLog = log;
	// force refresh
	setInterval(function() {
		gameState = gameState;
		thisLog = log;
	}, 500);

	function clickButton() {
		queueEffect({ effectType: "setActivity", locationId: "gardenOfCreation", stationId: "pineTree", activityId: "pineTree:chop" });
		gameState = gameState;
	}
</script>

<div>
	Total ticks: {gameState.totalTicks}
	<div>
		Location / Station / Activity: {gameState.currentLocation} / {gameState.currentStation} / {gameState.currentActivity}
	</div>
	<Inventory resources={gameState.resources} />
	<div>
		Logging skill level: {gameState.skills.logging.level}
	</div>
	<div>
		Logging skill exp: {gameState.skills.logging.exp}
	</div>
	<div class="button" on:click={clickButton}>Start choppin</div>
	<div>
		{#each thisLog as logMsg}
			<div>{logMsg}</div>
		{/each}
	</div>
</div>

<style>
	.button {
		user-select: none;
		cursor: pointer;
		border: 1px solid black;
		padding: 5px;
		display: inline-block;
	}
</style>