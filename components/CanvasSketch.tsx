import { useEffect, useState, useRef } from "react";
import {
	drawByHand,
	drawElipse,
	drawGrid,
	drawRect,
	rubber,
	drawLine,
	drawText,
	clearCanvas,
} from "../components/helpers/index";
import Panel from "../components/sidePanel/Panel";
import { colors, lines } from "./consts";
import type { DrawMethod, Store } from "./types";
import { useApp } from "./hooks";
import { App, TFile } from "obsidian";

type CanvasSketchProps = {
	filePath: string;
};

const MIN_WIDTH = 600;
const MIN_HEIGHT = 800;
const GRID_GAP = 30;

const CanvasSketch = ({ filePath }: CanvasSketchProps) => {
	const { vault } = useApp() as App;

	const parentRef = useRef<HTMLDivElement | null>(null);

	const [width, setWidth] = useState<number>(
		parentRef.current?.clientWidth || MIN_WIDTH
	);
	const [height, setHeight] = useState<number>(
		parentRef.current?.clientHeight || MIN_HEIGHT
	);

	const canvasGridRef = useRef<HTMLCanvasElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const finalCanvasRef = useRef<HTMLCanvasElement | null>(null);

	const [drawMethod, setDrawMethod] = useState<DrawMethod>("hand");
	const [isDrawing, setIsDrawing] = useState<boolean>(false);
	const [isShowingGrid, setIsShowingGrid] = useState<boolean>(false);
	const [isWritingText, setIsWritingText] = useState<boolean>(false);
	const [history, setHistory] = useState<ImageData[]>([]);
	const [historyIndex, setHistoryIndex] = useState<number>(-1);

	const [store, setStore] = useState<Store>({
		primaryColor: colors[0].rgb,
		lineWidth: lines[1],
		isFilled: false,
		isSaving: false,
	});

	const saveHistory = (ctx: CanvasRenderingContext2D) => {
		const imageData = ctx.getImageData(
			0,
			0,
			ctx.canvas.width,
			ctx.canvas.height
		);
		const newHistory = history.slice(0, historyIndex + 1);
		newHistory.push(imageData);
		setHistory(newHistory);
		setHistoryIndex(newHistory.length - 1);
	};

	const undo = (ctx: CanvasRenderingContext2D) => {
		if (historyIndex === 0) {
			clearCanvas(finalCanvasRef.current!, ctx);
			setHistoryIndex(-1);
		}
		if (historyIndex > 0) {
			const newIndex = historyIndex - 1;
			setHistoryIndex(newIndex);
			ctx.putImageData(history[newIndex], 0, 0);
		}
	};

	const redo = (ctx: CanvasRenderingContext2D) => {
		if (historyIndex < history.length - 1) {
			const newIndex = historyIndex + 1;
			setHistoryIndex(newIndex);
			ctx.putImageData(history[newIndex], 0, 0);
		}
	};

	// TODO: isolate all those useEffects into dedicated hooks

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

		if (drawMethod === "rubber")
			cleanup = rubber(canvas, ctx, finalCtx, saveHistory);
		if (drawMethod === "hand")
			cleanup = drawByHand(canvas, ctx, finalCtx, store, saveHistory);
		if (drawMethod === "line")
			cleanup = drawLine(canvas, ctx, finalCtx, store, saveHistory);
		if (drawMethod === "rect")
			cleanup = drawRect(canvas, ctx, finalCtx, store, saveHistory);
		if (drawMethod === "elipse")
			cleanup = drawElipse(canvas, ctx, finalCtx, store, saveHistory);

		return () => {
			if (cleanup) cleanup();
		};
	}, [drawMethod, isDrawing, store, history, historyIndex, filePath]);

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
			cleanup = drawText(
				canvas,
				ctx,
				finalCtx,
				store,
				saveHistory,
				setIsWritingText
			);
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

		drawGrid(canvasGrid, canvasGridCtx, width, height, GRID_GAP);
	}, [isShowingGrid, width, height]);

	useEffect(() => {
		const finalCanvas = finalCanvasRef.current;
		if (!finalCanvas) return;
		const finalCtx = finalCanvas.getContext("2d");
		if (!finalCtx) return;

		const image = new Image();

		let offsets = {
			x: 0,
			y: 0,
		};

		if (filePath) {
			const file = vault.getAbstractFileByPath(filePath);
			if (file instanceof TFile) {
				const url = vault.getResourcePath(file);

				image.src = url;
				setWidth(image.width > MIN_WIDTH ? image.width : MIN_WIDTH);
				setHeight(
					image.height > MIN_HEIGHT ? image.height : MIN_HEIGHT
				);
				offsets = {
					x:
						image.width < MIN_WIDTH
							? (MIN_WIDTH - image.width) / 2
							: 0,
					y:
						image.height < MIN_HEIGHT
							? (MIN_HEIGHT - image.height) / 2
							: 0,
				};
			}
		}

		image.onload = () => {
			finalCtx.drawImage(image, offsets.x, offsets.y);
		};
	}, []);

	useEffect(() => {
		if (filePath) return;

		const updateCanvasSize = () => {
			if (parentRef.current) {
				const { clientWidth, clientHeight } = parentRef.current;
				setHeight(clientHeight);
				setWidth(clientWidth);
			}
		};

		updateCanvasSize();
		window.addEventListener("resize", updateCanvasSize);

		return () => {
			window.removeEventListener("resize", updateCanvasSize);
		};
	}, [height, width]);

	return (
		<div
			style={{
				position: "relative",
				width: "100%",
				height: "100%",
				overflow: "hidden",
			}}
			onKeyDown={(e) => {
				if (e.key === "z" && e.ctrlKey) {
					undo(
						finalCanvasRef.current?.getContext(
							"2d"
						) as CanvasRenderingContext2D
					);
				}
				if (e.key === "Z" && e.ctrlKey && e.shiftKey) {
					redo(
						finalCanvasRef.current?.getContext(
							"2d"
						) as CanvasRenderingContext2D
					);
				}
				if (e.key === "G" && e.ctrlKey && e.shiftKey) {
					setIsShowingGrid(!isShowingGrid);
				}
			}}
		>
			<div
				ref={parentRef}
				style={{
					position: "absolute",
					overflow: "auto",
					width: "100%",
					height: "100%",
				}}
			>
				<canvas
					ref={finalCanvasRef}
					width={width}
					height={height}
					style={{
						position: "absolute",
						backgroundColor: "white",
					}}
				/>
				{isShowingGrid && (
					<canvas
						ref={canvasGridRef}
						width={width}
						height={height}
						style={{
							position: "absolute",
						}}
					/>
				)}
				<canvas
					ref={canvasRef}
					width={width}
					height={height}
					style={{
						position: "absolute",
					}}
					tabIndex={0}
					onClick={() => setIsDrawing(!isDrawing)}
				/>
			</div>
			<Panel
				width={filePath ? width : 0}
				canvas={canvasRef.current}
				finalCanvas={finalCanvasRef.current}
				isShowingGrid={isShowingGrid}
				setIsShowingGrid={setIsShowingGrid}
				drawMethod={drawMethod}
				setDrawMethod={setDrawMethod}
				store={store}
				setStore={setStore}
				history={history}
				setHistory={setHistory}
				historyIndex={historyIndex}
				setHistoryIndex={setHistoryIndex}
				undo={undo}
				redo={redo}
			/>
		</div>
	);
};

export default CanvasSketch;
