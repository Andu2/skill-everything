import { generalContent } from "./general";
import { locationContent } from "./locations";
import type { 
	Args_ResourceCategory, Args_Resource, 
	Args_Skill,
} from "@src/engine";
import type {
	Args_Event,
	Args_Activity,
	Args_Station,
	Args_Location
} from "@src/engine/activities";

const baseContent = <const>{
	resourceCategories: {
		"misc": {
			name: "Misc"
		}
	},
	resources: {},
	skills: {},
	events: {},
	activities: {
		"idle": {
			name: "Idle"
		}
	},
	stations: {
		"anyplace": {
			name: "Anyplace"
		}
	},
	locations: {
		"anywhere": {
			name: "Anywhere"
		}
	}
};

export type RawContent = typeof baseContent
	& typeof generalContent.logging
	& typeof generalContent.mining 
	& typeof locationContent.gardenOfCreation

export type ResourceId = keyof RawContent["resources"];
export type ResourceCategoryId = keyof RawContent["resourceCategories"];
export type SkillId = keyof RawContent["skills"];
export type EventId = keyof RawContent["events"];
export type ActivityId = keyof RawContent["activities"];
export type StationId = keyof RawContent["stations"];
export type LocationId = keyof RawContent["locations"];

// This function is essentially a workaround for TypeScript oddities.
// I want to get types for ID values using "keyof typeof X",
// but when X is type "Record<string, Args_XContent>", TypeScript only knows that the keys are strings
// This function forces the input to be "Record<string, Args_XContent>"
// but it still returns an object literal I can get the keys of
// See https://stackoverflow.com/questions/64119527/typescript-create-typed-record-without-explicitly-defining-the-keys
// export function createContent<K extends keyof ContentFile, T extends ContentFile[K]>(_string: K, content: T): T {
// 	return content;
// }

// Can't do the following because it doesn't guarantee order, thus TypeScript infers unions of every possible order which is no good
// const allContentSlices = Object.values(generalContent);

// Must add new generic for every content file imported
// If this looks absolutely moronic...well, it's the only way I can think of doing it.
// It's all in the name of getting the object literal types through to the complete content object
// so we can get type hints when using content IDs.
// If TypeScript introduces a better way at some point, 
// or if there's a better way I'm unaware of, PLEASE change this.
// Similar pattern used:
// https://github.com/cerebral/overmind/blob/next/packages/overmind/src/config/merge.ts
// function mergeContent<
// 	A extends ContentFile, 
// 	B extends ContentFile,
// 	C extends ContentFile,
// 	D extends ContentFile
// >(
// 	a: A,
// 	b: B,
// 	c: C,
// 	d: D
// ): A & B & C & D

interface ContentFile {
	resourceCategories?: Record<string, Args_ResourceCategory>;
	resources?: Record<string, Args_Resource>;
	skills?: Record<string, Args_Skill>;
	events?: Record<string, Args_Event>;
	activities?: Record<string, Args_Activity>;
	stations?: Record<string, Args_Station>;
	locations?: Record<string, Args_Location>
}

function mergeContent(...files: ContentFile[]): RawContent {
	const mergedFiles = files.reduce(function(aggr, nextFile) {
		const nextAggr = {};
		for (const contentType in baseContent) {
			nextAggr[contentType] = { ...aggr[contentType], ...nextFile[contentType] };
		}
		return nextAggr;
	}, baseContent);
	return mergedFiles as RawContent;
}

const rawContent = mergeContent(
	generalContent.logging,
	generalContent.mining,
	locationContent.gardenOfCreation
);

export default rawContent;
