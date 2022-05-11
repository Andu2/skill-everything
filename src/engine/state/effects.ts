// import * as Log from "@src/engine/log";
import type { GameState } from "./state";
import type { Effect, IComputeEffect } from "./effectTypes";
import { 
	effects_resources, 
	effects_skills 
} from "@src/engine";
import {
	effects_activities,
	effects_locations,
	effects_stations,
	effects_events
} from "@src/engine/activities";

////////////////////////////////////////////////////////////////////////////////////////////////
// General Effects
////////////////////////////////////////////////////////////////////////////////////////////////
interface Effect_Nothing {
	effectType: "nothing";
}

function computeNothing(_state: GameState, _effect: Effect_Nothing): void {}

export const effects_general = {
	"nothing": computeNothing
}

////////////////////////////////////////////////////////////////////////////////////////////////
// All Effects
////////////////////////////////////////////////////////////////////////////////////////////////
const effects = {
	...effects_general,
	...effects_resources,
	...effects_skills,
	...effects_activities,
	...effects_locations,
	...effects_stations,
	...effects_events
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Effect Queue
////////////////////////////////////////////////////////////////////////////////////////////////
const effectQueue: Effect[] = [];

export function queueEffect(eff: Effect) {
	effectQueue.push(eff);
}

// Note that effects can cause other effects
// Prevent infinite loop somehow?
export function computeEffects(state: GameState) {
	while (effectQueue.length > 0) {
		computeEffect(state, effectQueue.shift());
	}
}

// Must use type assertion
// We'll just rely on the Effect type confirming the effects have all the args
// https://github.com/microsoft/TypeScript/issues/30581
// https://stackoverflow.com/a/70629204/4015048
function computeEffect(state: GameState, effect: Effect): void {
	const computeFn = effects[effect.effectType] as IComputeEffect;
	computeFn(state, effect);
}
