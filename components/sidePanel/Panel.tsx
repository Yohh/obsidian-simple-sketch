import { Trash2, Download, Grid2X2 } from "lucide-react";
import DrawButtons from "./DrawButtons";
import SetButtons from "./SetButtons";
import { clearCanvas } from "components/helpers";
import type { DrawMethod, Store } from "components/types";

type PanelProps = {
	canvas: HTMLCanvasElement | null;
	finalCanvas: HTMLCanvasElement | null;
	isShowingGrid: boolean;
	setIsShowingGrid: (isShowingGrid: boolean) => void;
	drawMethod: DrawMethod;
	setDrawMethod: React.Dispatch<React.SetStateAction<DrawMethod>>;
	store: Store;
	setStore: React.Dispatch<React.SetStateAction<Store>>;
};

const Panel = ({
	canvas,
	finalCanvas,
	isShowingGrid,
	setIsShowingGrid,
	drawMethod,
	setDrawMethod,
	store,
	setStore,
}: PanelProps) => {
	const handleReset = () => {
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		clearCanvas(canvas, ctx);

		if (!finalCanvas) return;
		const finalCtx = finalCanvas.getContext("2d");
		if (!finalCtx) return;
		clearCanvas(finalCanvas, finalCtx);
	};

	const saveCanvas = () => {
		if (!finalCanvas) return;

		setStore((prev) => ({ ...prev, isSaving: true }));

		const date = new Date(Date.now())
			.toLocaleString()
			.replace(/\//g, "-")
			.replace(/,/g, "")
			.replace(/ /g, "_");

		const canvas = document.createElement("canvas");
		canvas.width = finalCanvas.width;
		canvas.height = finalCanvas.height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(finalCanvas, 0, 0);

		const link = document.createElement("a");
		link.download = `obsidian_sketch-${date}.jpg`;
		link.href = canvas.toDataURL();
		link.click();
	};

	return (
		<>
			<button
				onClick={handleReset}
				title="Reset"
				style={{
					position: "absolute",
					top: "1rem",
					left: "1rem",
				}}
			>
				<Trash2 size={24} />
			</button>
			<button
				onClick={() => setIsShowingGrid(!isShowingGrid)}
				title="Toggle grid"
				style={{
					position: "absolute",
					top: "3.5rem",
					left: "1rem",
					color: isShowingGrid ? "lightgray" : "grey",
				}}
			>
				<Grid2X2 size={24} />
			</button>
			<button
				onClick={saveCanvas}
				title="Download"
				style={{
					position: "absolute",
					bottom: "1rem",
					left: "1rem",
				}}
			>
				<Download size={24} />
			</button>
			<DrawButtons
				setDrawMethod={setDrawMethod}
				drawMethod={drawMethod}
				store={store}
				setStore={setStore}
			/>
			<SetButtons store={store} setStore={setStore} />
		</>
	);
};

export default Panel;
