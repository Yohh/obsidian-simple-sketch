import { clearCanvas } from "./clearCanvas";

export const drawGrid = (
	canvas: HTMLCanvasElement,
	canvasGridCtx: CanvasRenderingContext2D,
	CANVAS_WIDTH: number,
	CANVAS_HEIGHT: number,
	GRID_GAP: number
) => {
	clearCanvas(canvas, canvasGridCtx);
	canvasGridCtx.strokeStyle = "rgba(200, 200, 200, 0.3)";
	for (
		let i = 0;
		i < CANVAS_WIDTH;
		i += CANVAS_WIDTH / (CANVAS_WIDTH / GRID_GAP)
	) {
		canvasGridCtx.beginPath();
		canvasGridCtx.moveTo(i, 0);
		canvasGridCtx.lineTo(i, CANVAS_HEIGHT);
		canvasGridCtx.stroke();
	}
	for (
		let i = 0;
		i < CANVAS_HEIGHT;
		i += CANVAS_HEIGHT / (CANVAS_HEIGHT / GRID_GAP)
	) {
		canvasGridCtx.beginPath();
		canvasGridCtx.moveTo(0, i);
		canvasGridCtx.lineTo(CANVAS_WIDTH, i);
		canvasGridCtx.stroke();
	}
};
