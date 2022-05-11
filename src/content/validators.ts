import rawContent from "./index";
import type {
	ResourceId,
	ResourceCategoryId,
	SkillId,
	EventId,
	ActivityId,
	StationId
} from "./index";

export function isResourceCategoryId(id: string): id is ResourceCategoryId {
	return !!rawContent.resourceCategories[id];
}

export function isResourceId(id: string): id is ResourceId {
	return !!rawContent.resources[id];
}

export function isSkillId(id: string): id is SkillId {
	return !!rawContent.skills[id];
}

export function isEventId(id: string): id is EventId {
	return !!rawContent.events[id];
}

export function isActivityId(id: string): id is ActivityId {
	return !!rawContent.activities[id];
}

export function isStationId(id: string): id is StationId {
	return !!rawContent.stations[id];
}