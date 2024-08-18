import { StrictMode } from "react";
import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import CanvasSketch from "./components/CanvasSketch";

interface SimpleSketchSettings {
	mySetting: string;
}

export const SKETCH_VIEW_TYPE = "sketch-canvas";

export default class SimpleSketch extends Plugin {
	settings: SimpleSketchSettings;

	async onload() {
		this.registerView(SKETCH_VIEW_TYPE, (leaf) => new Sketch(leaf));

		this.addRibbonIcon("pencil-ruler", "Simple Sketch", () => {
			this.activateView();
		});
	}

	onunload() {}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(SKETCH_VIEW_TYPE);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({
				type: SKETCH_VIEW_TYPE,
				active: true,
			});

			workspace.revealLeaf(leaf!);
		}
	}
}

class Sketch extends ItemView {
	root: Root | null = null;

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

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<StrictMode>
				<CanvasSketch />
			</StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
