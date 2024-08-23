import { clearCanvas } from "./clearCanvas";
import { colors } from "../consts";
import type { Store } from "../types";

export const drawRect = (
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	store: Store
) => {
	const { lineWidth, primaryColor, isFilled } = store;

	let isDrawingRect = false;

	let startX = 0;
	let startY = 0;
	let width = 0;
	let height = 0;

	const handleMouseDown = (e: MouseEvent) => {
		isDrawingRect = true;

		startX = e.offsetX;
		startY = e.offsetY;
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDrawingRect) return;

		clearCanvas(canvas, ctx);

		width = e.offsetX - startX;
		height = e.offsetY - startY;

		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = colors.find(
			(color) => color.rgb === primaryColor
		)?.rgba!;
		ctx.fillStyle = colors
			.find((color) => color.rgb === primaryColor)
			?.rgba.replace("0.5)", "0.3)")!;
		ctx.setLineDash([5, 5]);
		ctx.strokeRect(startX, startY, width, height);
		if (isFilled) {
			ctx.fillRect(startX, startY, width, height);
		}

		ctx.setLineDash([2, 5]);
		ctx.beginPath();
		ctx.moveTo(startX, startY + height / 2);
		ctx.lineTo(startX + width, startY + height / 2);
		ctx.moveTo(startX + width / 2, startY);
		ctx.lineTo(startX + width / 2, startY + height);
		ctx.stroke();
	};

	const handleMouseUp = () => {
		clearCanvas(canvas, ctx);

		ctx.strokeStyle = primaryColor;
		ctx.setLineDash([]);
		ctx.beginPath();
		ctx.rect(startX, startY, width, height);
		if (isFilled) {
			ctx.fillStyle = primaryColor;
			ctx.fill();
		}
		ctx.stroke();

		startX = 0;
		startY = 0;
		width = 0;
		height = 0;

		isDrawingRect = false;
	};

	const handleMouseOut = () => {
		startX = 0;
		startY = 0;
		width = 0;
		height = 0;

		isDrawingRect = false;
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
