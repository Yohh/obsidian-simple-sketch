import { Trash2, IterationCw, IterationCcw, Grid2X2 } from "lucide-react";
import DrawButtons from "./DrawButtons";
import SetButtons from "./SetButtons";
import SaveButtons from "./SaveButtons";
import { clearCanvas } from "components/helpers";
import type { DrawMethod, Store } from "components/types";
import { useState } from "react";
import SaveModal from "components/modal/SaveModal";

type PanelProps = {
	width: number;
	canvas: HTMLCanvasElement | null;
	finalCanvas: HTMLCanvasElement | null;
	isShowingGrid: boolean;
	setIsShowingGrid: (isShowingGrid: boolean) => void;
	drawMethod: DrawMethod;
	setDrawMethod: React.Dispatch<React.SetStateAction<DrawMethod>>;
	store: Store;
	setStore: React.Dispatch<React.SetStateAction<Store>>;
	history: ImageData[];
	setHistory: React.Dispatch<React.SetStateAction<ImageData[]>>;
	historyIndex: number;
	setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
	undo: (ctx: CanvasRenderingContext2D) => void;
	redo: (ctx: CanvasRenderingContext2D) => void;
};

const Panel = ({
	width,
	canvas,
	finalCanvas,
	isShowingGrid,
	setIsShowingGrid,
	drawMethod,
	setDrawMethod,
	store,
	setStore,
	history,
	setHistory,
	historyIndex,
	setHistoryIndex,
	undo,
	redo,
}: PanelProps) => {
	const [showModal, setShowModal] = useState(false);

	const handleReset = () => {
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		clearCanvas(canvas, ctx);

		if (!finalCanvas) return;
		const finalCtx = finalCanvas.getContext("2d");
		if (!finalCtx) return;
		clearCanvas(finalCanvas, finalCtx);

		setHistory([]);
		setHistoryIndex(-1);
	};

	// TODO: isolate last buttons into a component

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
				onClick={() =>
					undo(
						finalCanvas?.getContext(
							"2d"
						) as CanvasRenderingContext2D
					)
				}
				title="Undo"
				disabled={historyIndex === -1}
				style={{
					position: "absolute",
					top: "1rem",
					left: "4.5rem",
				}}
			>
				<IterationCw size={24} />
			</button>
			<button
				onClick={() =>
					redo(
						finalCanvas?.getContext(
							"2d"
						) as CanvasRenderingContext2D
					)
				}
				title="Redo"
				disabled={historyIndex >= history.length - 1}
				style={{
					position: "absolute",
					top: "1rem",
					left: "8rem",
				}}
			>
				<IterationCcw size={24} />
			</button>
			<div
				style={{
					position: "absolute",
					top: "6.5rem",
					left: "1rem",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<DrawButtons
					setDrawMethod={setDrawMethod}
					drawMethod={drawMethod}
					store={store}
					setStore={setStore}
				/>
				<SaveButtons
					historyIndex={historyIndex}
					setShowModal={setShowModal}
					finalCanvas={finalCanvas}
					setStore={setStore}
				/>
			</div>
			<SetButtons store={store} setStore={setStore} width={width} />
			{showModal && (
				<div
					style={{
						position: "absolute",
						height: "100%",
						width: "100%",
					}}
				>
					<SaveModal
						setShowModal={setShowModal}
						finalCanvas={finalCanvas}
					/>
				</div>
			)}
		</>
	);
};

export default Panel;
