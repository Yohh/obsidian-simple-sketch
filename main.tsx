import { ItemView, Plugin, TFile, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import CanvasSketch from "./components/CanvasSketch";
import { AppContext } from "context";

const EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp"];
let state: { file: string | null } = {
	file: null,
};

interface SimpleSketchSettings {
	mySetting: string;
}

export const SKETCH_VIEW_TYPE = "sketch-canvas";

export default class SimpleSketch extends Plugin {
	settings: SimpleSketchSettings;

	async onload() {
		this.registerView(SKETCH_VIEW_TYPE, (leaf) => new Sketch(leaf));

		this.addRibbonIcon("pencil-ruler", "Simple Sketch", () => {
			state = { file: null };
			this.activateView();
		});

		this.app.workspace.on("file-menu", (menu, file) => {
			if (
				file instanceof TFile &&
				file.extension !== null &&
				!EXTENSIONS.includes(file.extension)
			)
				return;

			menu.addItem((item) => {
				item.setTitle("open with simple sketch")
					.setIcon("pencil-ruler")
					.onClick(() => {
						this.activateView(file.path);
					});
			});
		});
	}

	onunload() {}

	async activateView(filePath?: string) {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = workspace.getLeaf(false);

		if (!leaf) {
			leaf = workspace.getLeaf(true);
		}

		if (filePath) {
			state = { file: filePath };
		}

		await leaf.setViewState({
			type: SKETCH_VIEW_TYPE,
			active: true,
		});

		workspace.revealLeaf(leaf);
	}
}

class Sketch extends ItemView {
	root: Root | null = null;
	viewState = this.leaf.getViewState().state;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return SKETCH_VIEW_TYPE;
	}

	getDisplayText() {
		return "Simple Sketch";
	}

	getIcon() {
		return "pencil-ruler";
	}

	getState() {
		return state.file;
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		const viewState = this.leaf.getViewState();
		const filePath = viewState.state;
		this.root.render(
			<AppContext.Provider value={this.app}>
				<CanvasSketch filePath={filePath} />
			</AppContext.Provider>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
