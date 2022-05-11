import { objectMap } from "@src/utils";
import rawContent from "@src/content";
import { checkConditions, queueEffect } from "@src/engine/state";
import * as Log from "@src/engine/log";
import type { EventId, ActivityId } from "@src/content";
import type { Condition, Effect, GameState } from "@src/engine/state";

////////////////////////////////////////////////////////////////////////////////////////////////
// Event
////////////////////////////////////////////////////////////////////////////////////////////////
export interface Event {
	id: EventId;
	baseWork: number;
	distribution: WorkDistribution;
	scaleFactors: any;
	repeat: boolean | number;
	conditions: readonly Condition[];
	effects: readonly Effect[];
	saveProgress: boolean;
	message: string;
}

export interface Args_Event {
	baseWork: number;
	distribution?: WorkDistribution;
	scaleFactors?: any;
	repeat?: boolean | number;
	conditions?: readonly Condition[];
	effects?: readonly Effect[];
	saveProgress?: boolean;
	message?: string;
}

type WorkDistribution = "fixed" | "normal" | "binomial";

function processEvent(id: EventId, args: Args_Event): Event {
	let {
		baseWork,
		distribution = "fixed",
		scaleFactors = {},
		repeat = false,
		conditions = [],
		effects = [],
		saveProgress = false,
		message = ""
	} = args;

	const newEvent = {
		id,
		baseWork,
		distribution,
		scaleFactors,
		repeat,
		conditions,
		effects,
		saveProgress,
		message
	}
	return newEvent;
}

export const events: Record<EventId, Event> = objectMap(rawContent.events, processEvent);

////////////////////////////////////////////////////////////////////////////////////////////////
// Event state
////////////////////////////////////////////////////////////////////////////////////////////////
interface IndividualEventState {
	workDone: number;
	workRequired: number;
	totalWorkDone: number;
}

type ActivityEventState = {
	[K in EventId]?: IndividualEventState;
}

type EventState = {
	eventProgress: {
		[K in ActivityId]?: ActivityEventState
	}
}

export const initialState_events: EventState = {
	eventProgress: {}
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Work progression
////////////////////////////////////////////////////////////////////////////////////////////////
function getNextWorkRequired(baseWork: number, distribution: WorkDistribution): number {
	if (distribution === "fixed") {
		return baseWork;
	}
	return baseWork;
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Event effects
////////////////////////////////////////////////////////////////////////////////////////////////
interface Effect_ProgressEvent {
	effectType: "progressEvent";
	activityId: ActivityId;
	eventId: EventId;
}

function computeProgressEvent(state: GameState, effect: Effect_ProgressEvent) {
	const event = events[effect.eventId];
	if (!checkConditions(state, event.conditions)) {
		return;
	}

	if (!state.eventProgress[effect.activityId]) {
		state.eventProgress[effect.activityId] = {};
	}
	if (!state.eventProgress[effect.activityId][effect.eventId]) {
		state.eventProgress[effect.activityId][effect.eventId] = {
			workDone: 0,
			workRequired: getNextWorkRequired(event.baseWork, event.distribution),
			totalWorkDone: 0
		};
	}

	const eventState = state.eventProgress[effect.activityId][effect.eventId];
	eventState.workDone++;
	eventState.totalWorkDone++;
	if (eventState.workDone >= eventState.workRequired) {
		event.effects.forEach(queueEffect);
		if (event.message) {
			Log.logGameMessage(event.message);
		}
		eventState.workDone = 0;
		eventState.workRequired = getNextWorkRequired(event.baseWork, event.distribution);
	}
}

export const effects_events = {
	"progressEvent": computeProgressEvent
}
