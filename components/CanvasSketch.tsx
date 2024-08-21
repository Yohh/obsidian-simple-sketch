import { useEffect, useState, useRef } from "react";
import {
	drawByHand,
	drawElipse,
	drawGrid,
	drawRect,
	rubber,
	drawLine,
	drawText,
} from "../components/helpers/index";
import Panel from "../components/sidePanel/Panel";
import type { DrawMethod, Store } from "./types";

const CANVAS_WIDTH = 827;
const CANVAS_HEIGHT = 1170;
const GRID_GAP = 30;

const CanvasSketch = () => {
	const canvasGridRef = useRef<HTMLCanvasElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const finalCanvasRef = useRef<HTMLCanvasElement | null>(null);

	const [drawMethod, setDrawMethod] = useState<DrawMethod>("hand");
	const [isDrawing, setIsDrawing] = useState<boolean>(false);
	const [isShowingGrid, setIsShowingGrid] = useState<boolean>(true);
	const [isWritingText, setIsWritingText] = useState<boolean>(false);

	const [store, setStore] = useState<Store>({
		primaryColor: "rgb(0, 0, 0)",
		lineWidth: 3,
		isFilled: false,
		isSaving: false,
	});

	// TODO : add a custom hook to handle the drawing methods
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const finalCanvas = finalCanvasRef.current;
		if (!finalCanvas) return;
		const finalCtx = finalCanvas.getContext("2d");
		if (!finalCtx) return;

		let cleanup: (() => void) | undefined;

		if (drawMethod === "rubber") cleanup = rubber(canvas, ctx, finalCtx);
		if (drawMethod === "hand") cleanup = drawByHand(canvas, ctx, store);
		if (drawMethod === "line") cleanup = drawLine(canvas, ctx, store);
		if (drawMethod === "rect") cleanup = drawRect(canvas, ctx, store);
		if (drawMethod === "elipse") cleanup = drawElipse(canvas, ctx, store);

		return () => {
			if (cleanup) cleanup();
			finalCtx.drawImage(canvas, 0, 0);
		};
	}, [drawMethod, isDrawing, store]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const finalCanvas = finalCanvasRef.current;
		if (!finalCanvas) return;
		const finalCtx = finalCanvas.getContext("2d");
		if (!finalCtx) return;

		let cleanup: (() => void) | undefined;

		if (drawMethod === "text") {
			setIsWritingText(true);
			cleanup = drawText(canvas, ctx, store, setIsWritingText);
		}

		return () => {
			if (cleanup) cleanup();
			finalCtx.drawImage(canvas, 0, 0);
		};
	}, [drawMethod, store, isWritingText]);

	useEffect(() => {
		const canvasGrid = canvasGridRef.current;
		if (!canvasGrid) return;
		const canvasGridCtx = canvasGrid.getContext("2d");
		if (!canvasGridCtx) return;

		drawGrid(canvasGridCtx, CANVAS_WIDTH, CANVAS_HEIGHT, GRID_GAP);
	}, [isShowingGrid]);

	return (
		<div
			style={{
				position: "relative",
				maxWidth: `${CANVAS_WIDTH}px`,
				height: "100%",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					overflow: "auto",
					width: "100%",
					height: "100%",
				}}
			>
				{isShowingGrid && (
					<canvas
						ref={canvasGridRef}
						width={CANVAS_WIDTH}
						height={CANVAS_HEIGHT}
						style={{
							position: "absolute",
							backgroundColor: "white",
						}}
					/>
				)}
				<canvas
					ref={finalCanvasRef}
					width={CANVAS_WIDTH}
					height={CANVAS_HEIGHT}
					style={{
						position: "absolute",
						backgroundColor: isShowingGrid
							? "transparent"
							: "white",
					}}
				/>
				<canvas
					ref={canvasRef}
					width={CANVAS_WIDTH}
					height={CANVAS_HEIGHT}
					style={{
						position: "absolute",
					}}
					tabIndex={0}
					onClick={() => setIsDrawing(!isDrawing)}
				/>
			</div>
			<Panel
				canvas={canvasRef.current}
				finalCanvas={finalCanvasRef.current}
				isShowingGrid={isShowingGrid}
				setIsShowingGrid={setIsShowingGrid}
				drawMethod={drawMethod}
				setDrawMethod={setDrawMethod}
				store={store}
				setStore={setStore}
			/>
		</div>
	);
};

export default CanvasSketch;
