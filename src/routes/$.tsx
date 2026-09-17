import type { Data } from "@puckeditor/core";
import { Puck, Render } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import config from "#/lib/puck/config.puck";
import { getPageFn, setPageFn } from "#/lib/puck/page.function";

const EDIT_SUFFIX = "/edit";

const EMPTY_PAGE_DATA: Data = {
	content: [],
	root: {
		props: {
			title: "",
		},
	},
};

export const Route = createFileRoute("/$")({
	beforeLoad: ({ params }) => {
		const splat = `/${params._splat ?? ""}`;
		const isEdit = splat === EDIT_SUFFIX || splat.endsWith(EDIT_SUFFIX);
		const path = isEdit ? splat.slice(0, -EDIT_SUFFIX.length) || "/" : splat;

		return { path, isEdit };
	},
	loader: async ({ context }) => {
		const { path, isEdit } = context;

		const data = await getPageFn({ data: { path } });
		if (!isEdit && !data) {
			throw notFound();
		}

		return { path, isEdit, data: data ?? EMPTY_PAGE_DATA };
	},
	head: ({ loaderData }) => {
		return {
			meta: [
				{
					title: `${loaderData?.isEdit ? "Puck: " : ""} ${loaderData?.data.root.props?.title || loaderData?.path}`,
				},
			],
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { path, isEdit, data } = Route.useLoaderData();
	const setPage = useServerFn(setPageFn);

	if (isEdit) {
		return (
			<Puck
				config={config}
				data={data}
				onPublish={(newData) => {
					setPage({ data: { data: newData, path } });
				}}
			/>
		);
	}

	return <Render config={config} data={data} />;
}
