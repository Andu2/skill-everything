// Must be a separate file to avoid circular dependency
import type { GameState } from "@src/engine/state";
import type { 
	conditions_resources, 
	conditions_skills 
} from "@src/engine";
import type { conditions_general } from "./conditions";
import type {
	conditions_activities,
	conditions_locations,
	conditions_stations
} from "@src/engine/activities";

interface ICondition {
	conditionType: string;
}
export interface ICheckCondition {
	(state: GameState, condition: ICondition): boolean;
}

export type CheckCondition = 
	typeof conditions_resources 
	& typeof conditions_skills 
	& typeof conditions_general
	& typeof conditions_activities
	& typeof conditions_locations
	& typeof conditions_stations

export type Condition = Parameters<CheckCondition[keyof CheckCondition]>[1]
