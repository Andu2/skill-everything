import { getType } from "@src/utils";
import { initialState_resources, initialState_skills, initialState_tick } from "@src/engine";
import { initialState_activities, initialState_locations, initialState_stations, initialState_events } from "@src/engine/activities"

const stateSlices = [
	initialState_resources,
	initialState_skills,
	initialState_tick,
	initialState_activities,
	initialState_locations,
	initialState_stations,
	initialState_events
];
export type GameState = typeof initialState_resources 
	& typeof initialState_skills
	& typeof initialState_tick
	& typeof initialState_activities
	& typeof initialState_locations
	& typeof initialState_stations
	& typeof initialState_events;

function getInitialState(): GameState {
	const initialState = {} as GameState;
	for (let slice of stateSlices) {
		mergeDeep(initialState, slice);
	}
	return initialState;
}

export function saveState() {

}

export function loadState() {
	if (false) {
		// Load old game
	}
	else {
		return getInitialState();
	}
}

function mergeDeep(target: object, add: object) {
	for (const key in add) {
		let type = getType(add[key]);
		if (type === "function") {
			throw Error("Cannot include function in state")
		}
		else if (type === "array") {
			if (getType(target[key]) === "undefined") {
				target[key] = [];
			}
			else {
				target[key] = target[key].concat(add[key]);
			}
		}
		else if (type === "object") {
			if (getType(target[key]) === "undefined") {
				target[key] = {};
			}
			mergeDeep(target[key], add[key]);
		}
		else {
			target[key] = add[key];
		}
	}
}
