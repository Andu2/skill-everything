import { queueEffect, computeEffects } from "@src/engine/state/effects";
import * as Log from "@src/engine/log";
import type { GameState } from "@src/engine/state";

interface TickState {
	prevTickTime: number;
	partialTicks: number;
	totalTicks: number;
}
export const initialState_tick: TickState = {
	prevTickTime: 0,
	partialTicks: 0,
	totalTicks: 0
};

const TICK_TIME = 500;
const FRAME_TIME = 500;
const MAX_TICKS_PER_FRAME = 10 * 365 * 24 * 60 * 60 * (1000 / TICK_TIME);

let currentTimer = null;
export function start(state: GameState) {
	stop();
	currentTimer = setInterval(function frame() { 
		doFrame(state) 
	}, FRAME_TIME);
}

export function stop() {
	clearInterval(currentTimer);
}

function doFrame(state: GameState) {
	let currentTime = Date.now();
	if (state.prevTickTime === 0) {
		state.prevTickTime = currentTime;
		return;
	}

	var numTicks = (currentTime - state.prevTickTime) / TICK_TIME;
	var ticksToDo = numTicks + state.partialTicks;

	if (ticksToDo >= 1) {
		// Safety net; don't try to do too many ticks at once
		if (ticksToDo > MAX_TICKS_PER_FRAME) {
			ticksToDo = MAX_TICKS_PER_FRAME;
			Log.logInfo(`Limiting tick backlog to ${MAX_TICKS_PER_FRAME}`);
		}
		if (ticksToDo > 2) {
			Log.logInfo(`Doing ${Math.floor(ticksToDo)} ticks at once`);
		}

		while (ticksToDo >= 1) {
			doTick(state);
			ticksToDo--;
		}

		state.partialTicks = ticksToDo;
		state.prevTickTime = currentTime;
	}
}

function doTick(state: GameState) {
	state.totalTicks++;
	queueEffect({ effectType: "doActivities" });
	computeEffects(state);
}
