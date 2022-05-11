import { test, expect } from "vitest";

test("Sandbox", function() {});

// test("TypeScript experiment", function() {
// 	// Exploring some TypeScript oddities for potential use with effects
// 	let state = {
// 		monkeys: 0
// 	}

// 	type GameState = typeof state;

// 	interface Effect {
// 		type: string;
// 		args: EffectArgs;
// 	}

// 	interface EffectArgs {}

// 	interface Effect_ChangeResource extends Effect {
// 		type: "addResource";
// 		args: EffArgs_ChangeResource;
// 	}

// 	interface EffArgs_ChangeResource {
// 		resourceId: string;
// 		amount: number;
// 	}

// 	interface EffectTypes {
// 		"addResource": EffArgs_ChangeResource
// 	}

// 	type EffectHandler<T extends keyof EffectTypes> = (state: GameState, args: EffectTypes[T]) => void;

// 	function computeChangeResource(state: GameState, args: EffArgs_ChangeResource): void {
// 		if (args.resourceId === "monkeys") {
// 			state.monkeys += args.amount;
// 		}
// 	}

// 	let testEffect: Effect_ChangeResource = {
// 		type: "addResource",
// 		args: {
// 			resourceId: "monkeys",
// 			amolunt: 5
// 		}
// 	}

// 	computeChangeResource(state, testEffect.args);
// 	console.log(state.monkeys);
// });
