import rawContent from "@src/content";
import { objectMap } from "@src/utils";
import { isActivityId, isEventId } from "@src/content/validators";
import { locationHasStation } from "./locations";
import * as Log from "@src/engine/log";
import type { GameState } from "@src/engine/state";
import type { StationId, ActivityId, EventId, LocationId } from "@src/content";

////////////////////////////////////////////////////////////////////////////////////////////////
// Station
////////////////////////////////////////////////////////////////////////////////////////////////
interface Station {
	name: string;
	description: string;
	activities: ActivityId[];
	events: EventId[];
}

export interface Args_Station {
	name: string;
	description?: string;
	activities?: readonly string[];
	events?: readonly string[]; // Station events are "be" events
}

function processStation(id: StationId, args: Args_Station): Station {
	let {
		name,
		description = "",
		activities = [],
		events = []
	} = args;

	activities.forEach(function(activityId) {
		if (!isActivityId(activityId)) {
			throw Error(`Station ${id}: ${activityId} is not a valid activity ID`);
		}
	});
	let validatedActivities = activities as ActivityId[];

	events.forEach(function(eventId) {
		if (!isEventId(eventId)) {
			throw Error(`Station ${id}: ${eventId} is not a valid event ID`);
		}
	});
	let validatedEvents = events as EventId[];

	const newStation = {
		name,
		description,
		activities: validatedActivities,
		events: validatedEvents
	}
	return newStation;
}

export const stations: Record<StationId, Station> = objectMap(rawContent.stations, processStation);

////////////////////////////////////////////////////////////////////////////////////////////////
// Station logic
////////////////////////////////////////////////////////////////////////////////////////////////
export function stationHasActivity(stationId: StationId, activityId: ActivityId): boolean {
	return stations[stationId].activities.includes(activityId);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Station state
////////////////////////////////////////////////////////////////////////////////////////////////
interface StationState {
	currentStation: StationId;
}
export const initialState_stations: StationState = {
	currentStation: "anyplace"
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Station effects
////////////////////////////////////////////////////////////////////////////////////////////////
interface Effect_SetStation {
	effectType: "setStation";
	stationId: StationId;
	locationId?: LocationId;
}

function computeSetStation(state: GameState, effect: Effect_SetStation): void {
	let targetLocation = state.currentLocation;
	if (effect.locationId) {
		targetLocation = effect.locationId;
	}
	if (!locationHasStation(targetLocation, effect.stationId)) {
		Log.logWarning(`Cannot set station to ${effect.stationId} because location ${targetLocation} does not have it`);
	}
	else {
		state.currentLocation = targetLocation;
		state.currentStation = effect.stationId;
		state.currentActivity = "idle";
	}
}

export const effects_stations = {
	setStation: computeSetStation
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Station conditions
////////////////////////////////////////////////////////////////////////////////////////////////
interface Condition_AtStation {
	conditionType: "atStation";
	stationId: StationId;
}

function checkAtStation(state: GameState, condition: Condition_AtStation): boolean {
	return state.currentStation === condition.stationId;
}

export const conditions_stations = {
	atStation: checkAtStation
}
