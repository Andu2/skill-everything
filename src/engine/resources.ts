import rawContent from "@src/content";
import { queueEffect } from "@src/engine/state";
import * as Log from "@src/engine/log";
import { objectMap, isValidColor, isValidIcon } from "@src/utils";
import { isResourceCategoryId } from "@src/content/validators";
import type { ResourceId, ResourceCategoryId } from "@src/content";
import type { GameState } from "@src/engine/state";

////////////////////////////////////////////////////////////////////////////////////////////////
// ResourceCategory
////////////////////////////////////////////////////////////////////////////////////////////////
// ResourceCategory must be initialized first so resources can be assigned to categories
interface ResourceCategory {
	name: string;
	resources: Partial<typeof resources>
}

export interface Args_ResourceCategory {
	name: string;
}

function processResourceCategory(id: string, args: Args_ResourceCategory): ResourceCategory {
	let newCategory = {
		id,
		name: args.name,
		resources: {}
	}
	return newCategory;
}

export const resourceCategories: Record<ResourceCategoryId, ResourceCategory> = objectMap(rawContent.resourceCategories, processResourceCategory);

////////////////////////////////////////////////////////////////////////////////////////////////
// Resource
////////////////////////////////////////////////////////////////////////////////////////////////
interface Resource {
	id: ResourceId;
	name: string;
	icon: string; // length 1
	color: string; // hex code
	category: ResourceCategoryId;
	rarity: number;
}

export interface Args_Resource {
	name: string;
	icon?: string;
	color?: string;
	category?: string;
	rarity?: number;
}

const DEFAULT_RESOURCE_ICON = "•";
const DEFAULT_RESOURCE_COLOR = "000000";
const DEFAULT_RESOURCE_CATEGORY = "misc";
const DEFAULT_RESOURCE_RARITY = 1;

function processResource(id: ResourceId, args: Args_Resource): Resource {
	let {
		name,
		icon = DEFAULT_RESOURCE_ICON,
		color = DEFAULT_RESOURCE_COLOR,
		category = DEFAULT_RESOURCE_CATEGORY,
		rarity = DEFAULT_RESOURCE_RARITY
	} = args;

	if (!isValidIcon(icon)) {
		Log.logWarning(`Resource icon "${icon}" invalid: Must be one unicode character`);
		icon = DEFAULT_RESOURCE_ICON;
	}
	if (!isValidColor(color)) {
		Log.logWarning(`Resource color "${color}" invalid: Must be a 6-digit color hex code with a hash`);
		color = DEFAULT_RESOURCE_COLOR;	
	}
	if (!isResourceCategoryId(category)) {
		throw Error(`Unable to assign resource "${id}" to non-existant category "${category}"`)
	}

	let newResource = {
		id,
		name,
		icon,
		color,
		category,
		rarity
	};
	resourceCategories[category][id] = newResource;
	return newResource;
}

export const resources: Record<ResourceId, Resource> = objectMap(rawContent.resources, processResource);

////////////////////////////////////////////////////////////////////////////////////////////////
// Resource State
////////////////////////////////////////////////////////////////////////////////////////////////
interface IndividualResourceState {
	amount: number;
	unlocked: boolean;
}

interface ResourceState {
	resources: Record<ResourceId, IndividualResourceState>;
}

function getInitialResourceState(resources: Record<ResourceId, Resource>): ResourceState {
	let resourceState = {
		resources: {}
	};
	for (const resource of Object.values(resources)) {
		resourceState.resources[resource.id] = {
			amount: 0,
			unlocked: false
		};
	}
	if (stateContainsAllResources(resourceState)) {
		return resourceState;
	}
	else {
		throw Error("Unable to initialize all resources");
	}
}

function stateContainsAllResources(resourceState: { resources: object }): resourceState is ResourceState {
	for (const resourceId in resources) {
		if (!resourceState.resources[resourceId]) {
			return false;
		}
	}
	return true;
}

export const initialState_resources = getInitialResourceState(resources);

////////////////////////////////////////////////////////////////////////////////////////////////
// Resource Effects
////////////////////////////////////////////////////////////////////////////////////////////////
interface Effect_AddResource {
	effectType: "addResource";
	resourceId: ResourceId;
	amount: number;
}

function computeAddResource(state: GameState, effect: Effect_AddResource) {
	if (!state.resources[effect.resourceId].unlocked) {
		queueEffect({ effectType: "unlockResource", resourceId: effect.resourceId });
	}
	state.resources[effect.resourceId].amount += effect.amount;
}

interface Effect_RemoveResource {
	effectType: "removeResource";
	resourceId: ResourceId;
	amount: number;
}

function computeRemoveResource(state: GameState, effect: Effect_RemoveResource) {
	if (state.resources[effect.resourceId].amount < effect.amount) {
		Log.logInfo("Removing as much of resource " + effect.resourceId + " as possible (to zero)")
	}
	state.resources[effect.resourceId].amount = Math.max(state.resources[effect.resourceId].amount - effect.amount, 0);
}

interface Effect_UnlockResource {
	effectType: "unlockResource";
	resourceId: ResourceId;
}

function computeUnlockResource(state: GameState, effect: Effect_UnlockResource): void {
	state.resources[effect.resourceId].unlocked = true;
}

export const effects_resources = {
	"addResource": computeAddResource,
	"removeResource": computeRemoveResource,
	"unlockResource": computeUnlockResource
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Resource Conditions
////////////////////////////////////////////////////////////////////////////////////////////////
interface Condition_ResourceAmount {
	conditionType: "resourceAmount";
	resources: {
		[K in ResourceId]?: number
	}
}

function checkResourceAmount(state: GameState, condition: Condition_ResourceAmount): boolean {
	for (const resourceId in condition.resources) {
		if (state.resources[resourceId] < condition.resources[resourceId]) {
			return false;
		}
	}
	return true;
}

export const conditions_resources = {
	"resourceAmount": checkResourceAmount
}
