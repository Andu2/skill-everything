const resourceCategories = <const>{
	"ore": {
		name: "Ores"
	}
};

const resources = <const>{
	"gravel": {
		name: "Gravel",
		category: "ore",
		rarity: 1
	},
	"stone": {
		name: "Stone",
		category: "ore",
		rarity: 1
	}
};

const skills = <const>{
	"mining": {
		category: "raw",
		name: "Mining",
		icon: "*"
	}
};

const contentSlice = {
	resourceCategories,
	resources,
	skills
}

export default contentSlice;
