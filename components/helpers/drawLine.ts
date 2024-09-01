import { clearCanvas } from "./clearCanvas";
import { colors } from "../consts";
import type { Store } from "../types";

export const drawLine = (
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	finalCtx: CanvasRenderingContext2D,
	store: Store,
	saveHistory: (ctx: CanvasRenderingContext2D) => void
) => {
	const { lineWidth, primaryColor } = store;

	let isDrawingLine = false;

	let startX = 0;
	let startY = 0;

	clearCanvas(canvas, ctx);

	const handleMouseDown = (e: MouseEvent) => {
		isDrawingLine = true;
		[startX, startY] = [e.offsetX, e.offsetY];
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDrawingLine) return;

		clearCanvas(canvas, ctx);

		ctx.strokeStyle = colors.find(
			(color) => color.rgb === primaryColor
		)?.rgba!;
		ctx.lineWidth = lineWidth;
		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();
	};

	const handleMouseUp = (e: MouseEvent) => {
		clearCanvas(canvas, ctx);

		ctx.strokeStyle = primaryColor;
		ctx.setLineDash([]);
		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();

		isDrawingLine = false;
		finalCtx.drawImage(canvas, 0, 0);
		saveHistory(finalCtx);
	};

	const handleMouseOut = () => {
		isDrawingLine = false;
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
