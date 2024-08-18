export const clearCanvas = (
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D
) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
};
