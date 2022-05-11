const skills = <const>{
	"logging": {
		category: "raw",
		name: "Logging",
		icon: "*"
	}
};

const resourceCategories = <const>{
	"wood": {
		name: "Wood"
	}
};

const resources = <const>{
	"softWood": {
		name: "Softwood",
		icon: "≡",
		color: "fdf1c7",
		category: "wood",
		rarity: 1
	},
	"hardWood": {
		name: "Hardwood",
		icon: "≡",
		color: "dfb279",
		category: "wood",
		rarity: 1
	},
	"ironWood": {
		name: "Ironwood",
		icon: "≡",
		color: "5b4611",
		category: "wood",
		rarity: 2
	}
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Pine tree
////////////////////////////////////////////////////////////////////////////////////////////////
const stations_pineTree = <const>{
	"pineTree": {
		name: "Pine Tree",
		description: "A pine tree",
		activities: [
			"pineTree:chop"
			// "harvest", {} pine nuts
			// "tap" amber
		]
	}
}

const activities_pineTree = <const>{
	"pineTree:chop": {
		name: "Chop",
		events: [
			"pineTree:chop:getWood"
		]
	}
}

const events_pineTree = <const>{
	"pineTree:chop:getWood": {
		baseWork: 5,
		repeat: true,
		scaleFactors: {
			skills: {
				logging: 2
			},
			tools: {
				axe: 3
			}
		},
		distribution: "normal",
		conditions: [],
		message: "You chopped some soft wood.",
		effects: [
			{
				effectType: "addResource",
				resourceId: "softWood",
				amount: 1
			}, {
				effectType: "gainExp",
				skillId: "logging",
				amount: 5
			}
		]
	}
}

const stations = <const>{
	...stations_pineTree
};

const activities = <const>{
	...activities_pineTree
};

const events = {
	...events_pineTree
};

const contentSlice = {
	resourceCategories,
	resources,
	skills,
	stations,
	events,
	activities
};

export default contentSlice;
