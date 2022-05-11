// 	let event_clearTrees = {
// 		baseWork: 500,
// 		distribution: "fixed",
// 		requirements: [
// 			{
// 				type: "doingActivity",
// 				args: {
// 					station: "pineTree",
// 					activity: "chop"
// 				}
// 			}
// 		],
// 		effects: []
// 	};

// 	registerLocation("gardenOfCreation", {
// 		displayName: "Garden of Creation",
// 		description: "Where you start",
// 		x: 0,
// 		y: 0,
// 		stations: {
// 			"pineTree": true
// 		},
// 		rows: 2,
// 		columns: 2,
// 		events: {
// 			"clearTrees": event_clearTrees
// 		}
// 	});
// }

const locations = <const>{
	"gardenOfCreation": {
		name: "Garden of Creation",
		description: "Where you start",
		x: 0,
		y: 0,
		width: 2,
		height: 2,
		stations: [
			"pineTree"
		],
		// events: {
		// 	"clearTrees": event_clearTrees
		// }
	}
}

const contentSlice = {
	locations
}

export default contentSlice;

