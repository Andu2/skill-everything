import { isDev } from "@src/utils";

const WARNING_COLOR = "#e02040";
const INFO_COLOR = "#9090c0";
const GAMEMESSAGE_COLOR = "#111111";

export const log: string[] = [];

export function logWarning(msg: string) {
	logMessage(msg, { devOnly: true, color: WARNING_COLOR, important: true });
}

export function logInfo(msg: string) {
	logMessage(msg, { devOnly: true, color: INFO_COLOR });
}

export function logGameMessage(msg: string) {
	logMessage(msg, { color: GAMEMESSAGE_COLOR });
}

interface LogArgs {
	devOnly?: boolean;
	color?: string;
	important?: boolean;
}

export function logMessage(msg: string, args: LogArgs) {
	if (args.devOnly) {
		if (args.important) {
			console.warn(msg);
		}
		else {
			console.info(msg);
		}
	}
	else {
		log.push(msg)
	}
}

export function initLog() {
	// registerState({
	// 	gameLog: []
	// })
}
