import { clearCanvas } from "./clearCanvas";

export const rubber = (
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	finalCtx: CanvasRenderingContext2D,
	saveHistory: (ctx: CanvasRenderingContext2D) => void
) => {
	let startX = 0;
	let startY = 0;

	const handleMouseMove = (e: MouseEvent) => {
		clearCanvas(canvas, ctx);

		startX = e.offsetX;
		startY = e.offsetY;

		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
		ctx.lineWidth = 1;
		ctx.strokeRect(startX - 10, startY - 10, 20, 20);

		if (e.buttons === 1) {
			finalCtx.clearRect(startX - 10, startY - 10, 20, 20);
		}
	};

	const handleMouseClick = () => {
		finalCtx.clearRect(startX - 10, startY - 10, 20, 20);
	};

	const handleMouseUp = () => {
		clearCanvas(canvas, ctx);
		saveHistory(finalCtx);
	};

	const handleMouseOut = () => {
		clearCanvas(canvas, ctx);
	};

	canvas.addEventListener("mousemove", handleMouseMove);
	canvas.addEventListener("click", handleMouseClick);
	canvas.addEventListener("mouseup", handleMouseUp);
	canvas.addEventListener("mouseout", handleMouseOut);

	return () => {
		canvas.removeEventListener("mousemove", handleMouseMove);
		canvas.removeEventListener("click", handleMouseClick);
		canvas.removeEventListener("mouseup", handleMouseUp);
		canvas.removeEventListener("mouseout", handleMouseOut);
	};
};
