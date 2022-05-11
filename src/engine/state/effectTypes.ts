// Must be a separate file to avoid circular dependency
import type { GameState } from "@src/engine/state";
import type { 
	effects_resources, 
	effects_skills 
} from "@src/engine";
import type { effects_general } from "./effects";
import type {
	effects_activities,
	effects_locations,
	effects_stations,
	effects_events
} from "@src/engine/activities";

interface IEffect {
	effectType: string;
}
export interface IComputeEffect {
	(state: GameState, effect: IEffect): void;
}

export type ComputeEffect = 
	typeof effects_resources 
	& typeof effects_skills 
	& typeof effects_general
	& typeof effects_activities
	& typeof effects_locations
	& typeof effects_stations
	& typeof effects_events

export type Effect = Parameters<ComputeEffect[keyof ComputeEffect]>[1]
