import type { Config, Data } from "@puckeditor/core";
import { z } from "zod";

export const componentPropsSchemas = z.object({
	HeadingBlock: z.object({
		title: z.string(),
	}),
});

const contentItemSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("HeadingBlock"),
		props: componentPropsSchemas.shape.HeadingBlock.extend({ id: z.string() }),
	}),
]);

export const puckDataSchema = z.object({
	root: z.object({ props: z.object({ title: z.string() }).partial().optional() }).loose(),
	content: z.array(contentItemSchema),
	zones: z.record(z.string(), z.array(contentItemSchema)).optional(),
}) satisfies z.ZodType<Partial<Data>>;

type Props = z.infer<typeof componentPropsSchemas>;

const config: Config<Props> = {
	components: {
		HeadingBlock: {
			fields: {
				title: { type: "text" },
			},
			defaultProps: {
				title: "Heading",
			},
			render: ({ title }) => (
				<div style={{ padding: 64 }}>
					<h1>{title}</h1>
				</div>
			),
		},
	},
};

export default config;
