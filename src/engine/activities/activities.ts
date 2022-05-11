import rawContent from "@src/content";
import { objectMap } from "@src/utils";
import { isEventId } from "@src/content/validators";
import { locationHasStation } from "./locations";
import { stationHasActivity } from "./stations";
import * as Log from "@src/engine/log";
import { GameState, queueEffect } from "@src/engine/state";
import type { StationId, ActivityId, EventId, LocationId } from "@src/content";

////////////////////////////////////////////////////////////////////////////////////////////////
// Activity
////////////////////////////////////////////////////////////////////////////////////////////////
interface Activity {
	name: string;
	description: string;
	events: EventId[];
}

export interface Args_Activity {
	name: string;
	description?: string;
	events?: readonly string[];
}

function processActivity(id: ActivityId, args: Args_Activity): Activity {
	let {
		name,
		description = "",
		events = []
	} = args;

	events.forEach(function(eventId) {
		if (!isEventId(eventId)) {
			throw Error(`Activity ${id}: ${eventId} is not a valid event ID`);
		}
	});
	let validatedEvents = events as EventId[];

	const newActivity = {
		name,
		description,
		events: validatedEvents
	}
	return newActivity;
}

export const activities: Record<ActivityId, Activity> = objectMap(rawContent.activities, processActivity);

////////////////////////////////////////////////////////////////////////////////////////////////
// Activity state
////////////////////////////////////////////////////////////////////////////////////////////////
interface ActivityState {
	currentActivity: ActivityId;
}
export const initialState_activities: ActivityState = {
	currentActivity: "idle"
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Activity logic
////////////////////////////////////////////////////////////////////////////////////////////////
export function getCurrentActivities(state: GameState): ActivityId[] {
	const currentActivities: ActivityId[] = [
		// "be",
		// state.currentLocation + ":be",
		// state.currentStation + ":be",
		state.currentActivity
	];
	return currentActivities;
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Activity effects
////////////////////////////////////////////////////////////////////////////////////////////////
interface Effect_DoActivities {
	effectType: "doActivities";
}

function computeDoActivities(state: GameState, _effect: Effect_DoActivities): void {
	// Include "be" activities for station, location, and global
	const currentActivities = getCurrentActivities(state);

	currentActivities.forEach(function(activityId) {
		activities[activityId].events.forEach(function(eventId) {
			queueEffect({ effectType: "progressEvent", activityId: activityId, eventId: eventId });
		});
	});
}

interface Effect_SetActivity {
	effectType: "setActivity";
	locationId?: LocationId;
	stationId?: StationId;
	activityId: ActivityId;
}

function computeSetActivity(state: GameState, effect: Effect_SetActivity): void {
	let targetLocation = state.currentLocation;
	if (effect.locationId) {
		targetLocation = effect.locationId;
	}
	let targetStation = state.currentStation;
	if (effect.stationId) {
		targetStation = effect.stationId;
	}

	if (!locationHasStation(targetLocation, effect.stationId)) {
		Log.logWarning(`setActivity: Cannot set station to ${effect.stationId} because location ${targetLocation} does not have it`);
		return;
	}
	if (!stationHasActivity(targetStation, effect.activityId)) {
		Log.logWarning(`setActivity: Cannot set activity to ${effect.activityId} because station ${targetStation} does not have it`);
		return;
	}

	state.currentLocation = targetLocation;
	state.currentStation = targetStation;
	state.currentActivity = effect.activityId;
}

export const effects_activities = {
	"setActivity": computeSetActivity,
	"doActivities": computeDoActivities
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Activity conditions
////////////////////////////////////////////////////////////////////////////////////////////////

export const conditions_activities = {

}
