import { clearCanvas } from "./clearCanvas";
import type { Store } from "../types";

export const drawText = (
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	store: Store,
	setIsWritingText: React.Dispatch<React.SetStateAction<boolean>>
) => {
	const { primaryColor, lineWidth } = store;
	const actualLineWidth = lineWidth * 10;
	const actualPrimaryColor = primaryColor;

	let isDrawingText = false;
	let text = "";
	let startX = 0;
	let startY = 0;
	let cursorVisible = false;
	let cursorInterval: NodeJS.Timeout;

	canvas.focus();
	canvas.style.cursor = "text";

	const draw = () => {
		clearCanvas(canvas, ctx);
		ctx.font = `${actualLineWidth}px sans-serif`;
		ctx.fillStyle = actualPrimaryColor
			.replace("rgb", "rgba")
			.replace(")", ", 0.5)");
		ctx.fillText(text + (cursorVisible ? "|" : ""), startX, startY);
	};

	const handleMouseDown = (e: MouseEvent) => {
		isDrawingText = true;

		clearCanvas(canvas, ctx);

		text = "";
		startX = e.offsetX;
		startY = e.offsetY + 10;

		cursorVisible = true;

		if (cursorInterval) clearInterval(cursorInterval);
		cursorInterval = setInterval(() => {
			draw();
			cursorVisible = !cursorVisible;
		}, 500);
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		e.preventDefault();
		if (!isDrawingText) return;

		if (e.key.length === 1) {
			if (e.shiftKey) {
				text = text + e.key.toUpperCase();
			} else {
				text = text + e.key;
			}
		}

		if (e.key === "Backspace") {
			text = text.slice(0, -1);
		}

		if (e.key === "escape") {
			clearCanvas(canvas, ctx);
			isDrawingText = false;
			setIsWritingText(false);
			return;
		}

		draw();
	};

	const handleKeyUp = (e: KeyboardEvent) => {
		if (!isDrawingText) return;

		if (e.key === "Enter") {
			if (text === "") {
				clearCanvas(canvas, ctx);
				isDrawingText = false;
				setIsWritingText(false);
				return;
			}

			clearInterval(cursorInterval);
			cursorVisible = false;
			draw();

			ctx.font = `${actualLineWidth}px sans-serif`;
			ctx.fillStyle = actualPrimaryColor;

			ctx.fillText(text, startX, startY);

			text = "";
			isDrawingText = false;
			setIsWritingText(false);
		}
	};

	canvas.addEventListener("mousedown", handleMouseDown);
	canvas.addEventListener("keydown", handleKeyDown);
	canvas.addEventListener("keyup", handleKeyUp);

	return () => {
		canvas.removeEventListener("mousedown", handleMouseDown);
		canvas.removeEventListener("keydown", handleKeyDown);
		canvas.removeEventListener("keyup", handleKeyUp);
		if (cursorInterval) clearInterval(cursorInterval);
		canvas.style.cursor = "default";
	};
};
