import fs from "node:fs";
import path from "node:path";
import type { Data } from "@puckeditor/core";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const DB_PATH = path.join(import.meta.dirname, "database.json");

export const getPageFn = createServerFn({ method: "GET" })
	.validator(
		z.object({
			path: z.string(),
		}),
	)
	.handler(({ data }) => {
		const allData: Record<string, Data> | null = fs.existsSync(DB_PATH)
			? JSON.parse(fs.readFileSync(DB_PATH, "utf-8"))
			: null;

		return allData ? allData[data.path] : null;
	});
export const setPageFn = createServerFn({ method: "POST" })
	.validator(
		z.object({
			path: z.string(),
			data: z.any(),
		}),
	)
	.handler(({ data }) => {
		const existingData = JSON.parse(fs.existsSync(DB_PATH) ? fs.readFileSync(DB_PATH, "utf-8") : "{}");
		const updatedData = {
			...existingData,
			[data.path]: data.data,
		};
		fs.writeFileSync(DB_PATH, JSON.stringify(updatedData));
		return {
			status: "ok",
		};
	});
