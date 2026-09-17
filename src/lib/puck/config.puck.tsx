import type { Config, Data } from "@puckeditor/core";
import { z } from "zod";

export const componentPropsSchemas = z.object({
	HeadingBlock: z.object({
		title: z.string(),
	}),
	Button: z.object({
		title: z.string(),
	}),
});

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
		Button: {
			fields: {
				title: { type: "text" },
			},
			defaultProps: {
				title: "Click",
			},
			render: ({ title }) => <div style={{ padding: 64 }}>{title}</div>,
		},
	},
};

const componentContentSchemas = Object.entries(componentPropsSchemas.shape).map(([type, schema]) =>
	z.object({
		type: z.literal(type),
		props: schema.extend({ id: z.string() }),
	}),
);

const contentItemSchema = z.discriminatedUnion(
	"type",
	componentContentSchemas as [(typeof componentContentSchemas)[number], ...(typeof componentContentSchemas)[number][]],
);

export const puckDataSchema = z.object({
	root: z.object({ props: z.object({ title: z.string() }).partial().optional() }).loose(),
	content: z.array(contentItemSchema),
	zones: z.record(z.string(), z.array(contentItemSchema)).optional(),
}) satisfies z.ZodType<Partial<Data>>;

export default config;
