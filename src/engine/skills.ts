import content from "@src/content";
import { queueEffect } from "@src/engine/state";
import * as Log from "@src/engine/log";
import { objectMap, isValidIcon } from "@src/utils";
import type { SkillId } from "@src/content";
import type { GameState } from "@src/engine/state";

////////////////////////////////////////////////////////////////////////////////////////////////
// Skill
////////////////////////////////////////////////////////////////////////////////////////////////
interface Skill {
	id: string,
	name: string,
	category: string,
	icon: string
}

export interface Args_Skill {
	name: string,
	category?: string,
	icon?: string
}

const DEFAULT_SKILL_ICON = "•";
// const DEFAULT_SKILL_COLOR = "000000";
const DEFAULT_SKILL_CATEGORY = "misc";

function processSkill(id: string, args: Args_Skill): Skill {
	let {
		name,
		icon = DEFAULT_SKILL_ICON,
		category = DEFAULT_SKILL_CATEGORY
	} = args;
	
	if (!isValidIcon(icon)) {
		Log.logWarning(`Skill icon "${icon}" invalid: Must be one unicode character`);
		icon = DEFAULT_SKILL_ICON;
	}

	let newSkill = {
		id,
		name,
		category,
		icon
	};
	return newSkill;
}

export const skills: Record<SkillId, Skill> = objectMap(content.skills, processSkill);

////////////////////////////////////////////////////////////////////////////////////////////////
// Level scaling
////////////////////////////////////////////////////////////////////////////////////////////////
const MAX_LEVEL = 100;

// This is a curated list of "nice" numbers that roughly follows the commented-out method for calculating exp
// The list repeats, multiplying by 10 each time
const BASE_EXP_VALUES = [ 10, 12, 16, 20, 25, 32, 40, 50, 64, 80 ];
function getExpForLevel(level: number) {
	// const BASE_EXP_FOR_LEVEL = 100;
	// const LEVELS_PER_MAGNITUDE = 10;
	// const EXP_SIGNIFICANT_DIGITS = 2;
	// let exp = BASE_LEVEL_EXP_REQUIREMENT * Math.pow(10, level / LEVELS_PER_MAGNITUDE);
	// let roundToNearest = Math.pow(10, Math.max(magnitude(exp) - EXP_SIGNIFICANT_DIGITS + 1, 0));
	// let expRounded = Math.round(exp / roundToNearest) * roundToNearest;
	// return expRounded;
	return BASE_EXP_VALUES[level % 10] * Math.pow(10, (Math.floor(level / 10) + 1));
}

const getTotalExpForLevel = (function() {
	const expTable = [0];
	let currentTotal = 0;
	for (let level = 1; level <= MAX_LEVEL; level++) {
		currentTotal += getExpForLevel(level);
		expTable.push(currentTotal);
	}
	
	return function getTotalExpForLevel(level: number) {
		if (level > MAX_LEVEL) return expTable[MAX_LEVEL];
		else if (level < 0) return expTable[0];
		else return expTable[level];
	}
})();

////////////////////////////////////////////////////////////////////////////////////////////////
// Skill state
////////////////////////////////////////////////////////////////////////////////////////////////
interface IndividualSkillState {
	exp: number;
	level: number;
	unlocked: boolean;
}

interface SkillState {
	skills: Record<SkillId, IndividualSkillState>;
}

function getInitialSkillState(skills: Record<SkillId, Skill>): SkillState {
	let skillState = {
		skills: {}
	};
	for (const skill of Object.values(skills)) {
		skillState.skills[skill.id] = {
			exp: 0,
			level: 0,
			unlocked: false
		};
	}
	if (stateContainsAllSkills(skillState)) {
		return skillState;
	}
	else {
		throw Error("Unable to initialize all skills");
	}
}

function stateContainsAllSkills(skillState: { skills: object }): skillState is SkillState {
	for (const skillId in skills) {
		if (!skillState.skills[skillId]) {
			return false;
		}
	}
	return true;
}

export const initialState_skills = getInitialSkillState(skills);

////////////////////////////////////////////////////////////////////////////////////////////////
// Skill effects
////////////////////////////////////////////////////////////////////////////////////////////////
interface Effect_GainExp {
	effectType: "gainExp";
	skillId: string;
	amount: number;
}

function computeGainExp(state: GameState, effect: Effect_GainExp) {
	const skillState = state.skills[effect.skillId];
	if (!skillState.unlocked) {
		queueEffect({ effectType: "unlockSkill", skillId: effect.skillId });
	}
	skillState.exp += effect.amount;
	while (skillState.exp >= getTotalExpForLevel(skillState.level + 1)) {
		// IDEA: Level up rewards?
		skillState.level++;
		Log.logGameMessage(`${skills[effect.skillId].name} level up to ${skillState.level}!`);
	}
}

interface Effect_UnlockSkill {
	effectType: "unlockSkill";
	skillId: string;
}

function computeUnlockSkill(state: GameState, effect: Effect_UnlockSkill) {
	state.skills[effect.skillId].unlocked = true;
}

export const effects_skills = {
	"gainExp": computeGainExp,
	"unlockSkill": computeUnlockSkill
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Skill conditions
////////////////////////////////////////////////////////////////////////////////////////////////
interface Condition_SkillLevel {
	conditionType: "skillLevel";
	skillId: string;
	level: number;
}

function checkSkillLevel(state: GameState, condition: Condition_SkillLevel): boolean {
	return (state.skills[condition.skillId].level >= condition.level);
}

export const conditions_skills = {
	"skillLevel": checkSkillLevel
}
