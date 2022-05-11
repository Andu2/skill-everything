// import * as Log from "@src/engine/log";
import type { GameState } from "./state";
import type { Condition, ICheckCondition } from "./conditionTypes";
import { 
	conditions_resources, 
	conditions_skills 
} from "@src/engine";
import {
	conditions_activities,
	conditions_locations,
	conditions_stations
} from "@src/engine/activities";

////////////////////////////////////////////////////////////////////////////////////////////////
// General Conditions
////////////////////////////////////////////////////////////////////////////////////////////////
interface Condition_Nothing {
	conditionType: "nothing";
}

function checkNothing(_state: GameState, _condition: Condition_Nothing): boolean { return true; }

export const conditions_general = {
	"nothing": checkNothing
}

////////////////////////////////////////////////////////////////////////////////////////////////
// All Conditions
////////////////////////////////////////////////////////////////////////////////////////////////
const conditions = {
	...conditions_general,
	...conditions_resources,
	...conditions_skills,
	...conditions_activities,
	...conditions_locations,
	...conditions_stations
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Condition Checks
////////////////////////////////////////////////////////////////////////////////////////////////
export function checkConditions(state: GameState, conditions: readonly Condition[]): boolean {
	return conditions.every(function(condition) {
		return checkCondition(state, condition);
	})
}

// Must use type assertion
// We'll just rely on the Condition type confirming the conditions have all the args
// The other thing to check is that the condition keys match the conditionTypes
// https://github.com/microsoft/TypeScript/issues/30581
// https://stackoverflow.com/a/70629204/4015048
function checkCondition(state: GameState, condition: Condition): boolean {
	const checkFn = conditions[condition.conditionType] as ICheckCondition;
	return checkFn(state, condition);
}
