import { Store } from "components/CanvasSketch";
import { clearCanvas } from "./clearCanvas";

export const drawLine = (
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	store: Store
) => {
	const { lineWidth, primaryColor } = store;

	let isDrawingLine = false;

	let startX = 0;
	let startY = 0;

	const handleMouseDown = (e: MouseEvent) => {
		isDrawingLine = true;
		[startX, startY] = [e.offsetX, e.offsetY];
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDrawingLine) return;

		clearCanvas(canvas, ctx);

		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
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
