import { clearCanvas } from "./clearCanvas";
import { colors } from "../consts";
import { Store } from "../types";

export const drawElipse = (
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	finalCtx: CanvasRenderingContext2D,
	store: Store,
	saveHistory: (ctx: CanvasRenderingContext2D) => void
) => {
	const { lineWidth, primaryColor, isFilled } = store;

	let isDrawingElipse = false;

	let startX = 0;
	let startY = 0;
	let width = 0;
	let height = 0;

	clearCanvas(canvas, ctx);

	const handleMouseDown = (e: MouseEvent) => {
		isDrawingElipse = true;

		startX = e.offsetX;
		startY = e.offsetY;
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDrawingElipse) return;

		clearCanvas(canvas, ctx);

		width = e.offsetX - startX;
		height = e.offsetY - startY;

		ctx.strokeStyle = colors.find(
			(color) => color.rgb === primaryColor
		)?.rgba!;
		ctx.lineWidth = lineWidth;
		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.ellipse(
			startX + width / 2,
			startY + height / 2,
			Math.abs(width / 2),
			Math.abs(height / 2),
			0,
			0,
			2 * Math.PI
		);
		if (isFilled) {
			ctx.fillStyle = colors
				.find((color) => color.rgb === primaryColor)
				?.rgba.replace("0.5)", "0.3)")!;
			ctx.fill();
		}
		ctx.stroke();

		ctx.setLineDash([2, 5]);
		ctx.rect(startX, startY, width, height);
		ctx.stroke();

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
		ctx.ellipse(
			startX + width / 2,
			startY + height / 2,
			Math.abs(width / 2),
			Math.abs(height / 2),
			0,
			0,
			2 * Math.PI
		);
		if (isFilled) {
			ctx.fillStyle = primaryColor;
			ctx.fill();
		}
		ctx.stroke();

		startX = 0;
		startY = 0;
		width = 0;
		height = 0;
		isDrawingElipse = false;
		finalCtx.drawImage(canvas, 0, 0);
		saveHistory(finalCtx);
	};

	const handleMouseOut = () => {
		startX = 0;
		startY = 0;
		width = 0;
		height = 0;
		isDrawingElipse = false;
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
