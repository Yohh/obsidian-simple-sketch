import { Store } from "components/CanvasSketch";

export const drawByHand = (
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	store: Store
) => {
	const { lineWidth, primaryColor } = store;

	let isDrawingByHand = false;

	let lastX = 0;
	let lastY = 0;

	const handleMouseDown = (e: MouseEvent) => {
		isDrawingByHand = true;
		[lastX, lastY] = [e.offsetX, e.offsetY];
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDrawingByHand) return;

		ctx.strokeStyle = primaryColor;
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();
		[lastX, lastY] = [e.offsetX, e.offsetY];
	};

	const handleMouseUp = () => {
		isDrawingByHand = false;
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
