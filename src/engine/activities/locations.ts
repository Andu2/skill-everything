import rawContent from "@src/content";
import { objectMap } from "@src/utils";
import { isStationId, isActivityId, isEventId } from "@src/content/validators";
import type { GameState } from "@src/engine/state";
import type { LocationId, StationId, ActivityId, EventId } from "@src/content";

////////////////////////////////////////////////////////////////////////////////////////////////
// Location
////////////////////////////////////////////////////////////////////////////////////////////////
interface Location {
	name: string;
	description: string;
	activities: ActivityId[];
	stations: StationId[];
	events: EventId[];
	x: number | null;
	y: number | null;
	width: number;
	height: number;
}

export interface Args_Location {
	name: string;
	x?: number;
	y?: number;
	description?: string;
	activities?: readonly string[];
	stations?: readonly string[];
	events?: readonly string[];
	width?: number;
	height?: number;
}

function processLocation(id: LocationId, args: Args_Location): Location {
	let {
		name,
		x = null,
		y = null,
		description = "",
		activities = [],
		events = [],
		stations = [],
		width = 1,
		height = 1
	} = args;

	activities.forEach(function(activityId) {
		if (!isActivityId(activityId)) {
			throw Error(`Location ${id}: ${activityId} is not a valid activity ID`);
		}
	});
	let validatedActivities = activities as ActivityId[];

	events.forEach(function(eventId) {
		if (!isEventId(eventId)) {
			throw Error(`Location ${id}: ${eventId} is not a valid event ID`);
		}
	});
	let validatedEvents = events as EventId[];

	stations.forEach(function(stationId) {
		if (!isStationId(stationId)) {
			throw Error(`Location ${id}: ${stationId} is not a valid station ID`);
		}
	});
	let validatedStations = stations as StationId[];

	const newLocation = {
		name,
		x,
		y,
		description,
		activities: validatedActivities,
		events: validatedEvents,
		stations: validatedStations,
		width,
		height
	}
	return newLocation;
}

export const locations: Record<LocationId, Location> = objectMap(rawContent.locations, processLocation);

////////////////////////////////////////////////////////////////////////////////////////////////
// Location logic
////////////////////////////////////////////////////////////////////////////////////////////////
export function locationHasStation(locationId: LocationId, stationId: StationId): boolean {
	return locations[locationId].stations.includes(stationId);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Location state
////////////////////////////////////////////////////////////////////////////////////////////////
interface LocationState {
	currentLocation: LocationId;
}
export const initialState_locations: LocationState = {
	currentLocation: "anywhere"
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Location effects
////////////////////////////////////////////////////////////////////////////////////////////////
interface Effect_SetLocation {
	effectType: "setLocation";
	locationId: LocationId;
}

function computeSetLocation(state: GameState, effect: Effect_SetLocation): void {
	state.currentLocation = effect.locationId;
	state.currentStation = "anyplace";
	state.currentActivity = "idle";
}

export const effects_locations = {
	setLocation: computeSetLocation
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Location conditions
////////////////////////////////////////////////////////////////////////////////////////////////
interface Condition_AtLocation {
	conditionType: "atLocation";
	locationId: LocationId;
}

function checkAtLocation(state: GameState, condition: Condition_AtLocation): boolean {
	return state.currentLocation === condition.locationId;
}

export const conditions_locations = {
	atLocation: checkAtLocation
}
