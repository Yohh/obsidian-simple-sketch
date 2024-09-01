import { Store } from "../types";
import { clearCanvas } from "./clearCanvas";

export const drawByHand = (
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	finalCtx: CanvasRenderingContext2D,
	store: Store,
	saveHistory: (ctx: CanvasRenderingContext2D) => void
) => {
	const { lineWidth, primaryColor } = store;

	let isDrawingByHand = false;

	let lastX = 0;
	let lastY = 0;

	clearCanvas(canvas, ctx);

	const handleMouseDown = (e: MouseEvent) => {
		isDrawingByHand = true;
		[lastX, lastY] = [e.offsetX, e.offsetY];

		ctx.fillStyle = primaryColor;
		ctx.beginPath();
		ctx.ellipse(
			lastX,
			lastY,
			lineWidth / 2,
			lineWidth / 2,
			0,
			0,
			2 * Math.PI
		);
		ctx.fill();
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDrawingByHand) return;

		ctx.strokeStyle = primaryColor;
		ctx.lineWidth = lineWidth;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();
		[lastX, lastY] = [e.offsetX, e.offsetY];
	};

	const handleMouseUp = () => {
		isDrawingByHand = false;
		finalCtx.drawImage(canvas, 0, 0);
		saveHistory(finalCtx);
	};

	const handleMouseOut = () => {
		isDrawingByHand = false;
	};

	canvas.addEventListener("mousedown", handleMouseDown);
	canvas.addEventListener("mousemove", handleMouseMove);
	canvas.addEventListener("mouseup", handleMouseUp);
	canvas.addEventListener("mouseout", handleMouseOut);

	return () => {
		canvas.removeEventListener("mousedown", handleMouseDown);
		canvas.removeEventListener("mousemove", handleMouseMove);
		canvas.removeEventListener("mouseup", handleMouseUp);
		canvas.removeEventListener("mouseout", handleMouseOut);
	};
};
