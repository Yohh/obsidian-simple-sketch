import {
	Eraser,
	PencilLine,
	Slash,
	Square,
	SquareDot,
	Circle,
	CircleDot,
} from "lucide-react";
import type { DrawMethod, Store } from "../types";

type DrawButtonsProps = {
	drawMethod: DrawMethod;
	setDrawMethod: React.Dispatch<React.SetStateAction<DrawMethod>>;
	store: Store;
	setStore: React.Dispatch<React.SetStateAction<Store>>;
};

const DrawButtons = ({
	drawMethod,
	setDrawMethod,
	store,
	setStore,
}: DrawButtonsProps) => {
	return (
		<div
			style={{
				position: "absolute",
				top: "6.5rem",
				left: "1rem",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<button
				onClick={() => {
					setDrawMethod("rubber");
					setStore({ ...store, isFilled: false });
				}}
				title="Rubber"
				style={{
					marginBottom: "0.5rem",
					color: drawMethod === "rubber" ? "lightgray" : "grey",
				}}
			>
				<Eraser size={24} />
			</button>
			<button
				onClick={() => {
					setDrawMethod("hand");
					setStore({ ...store, isFilled: false });
				}}
				title="Draw by hand"
				style={{
					marginBottom: "0.5rem",
					color: drawMethod === "hand" ? "lightgray" : "grey",
				}}
			>
				<PencilLine size={24} />
			</button>
			<button
				onClick={() => {
					setDrawMethod("line");
					setStore({ ...store, isFilled: false });
				}}
				title="Draw line"
				style={{
					marginBottom: "0.5rem",
					color: drawMethod === "line" ? "lightgray" : "grey",
				}}
			>
				<Slash size={24} />
			</button>
			<button
				onClick={() => {
					setDrawMethod("rect");
					setStore({ ...store, isFilled: false });
				}}
				title="Draw rectangle"
				style={{
					marginBottom: "0.5rem",
					color:
						drawMethod === "rect" && !store.isFilled
							? "lightgray"
							: "grey",
				}}
			>
				<Square size={24} />
			</button>
			{/* filled rect */}
			<button
				onClick={() => {
					setDrawMethod("rect");
					setStore({ ...store, isFilled: true });
				}}
				title="Draw filled rectangle"
				style={{
					marginBottom: "0.5rem",
					color:
						drawMethod === "rect" && store.isFilled
							? "lightgray"
							: "grey",
				}}
			>
				<SquareDot size={24} />
			</button>
			<button
				onClick={() => {
					setDrawMethod("elipse");
					setStore({ ...store, isFilled: false });
				}}
				title="Draw elipse"
				style={{
					marginBottom: "0.5rem",
					color:
						drawMethod === "elipse" && !store.isFilled
							? "lightgray"
							: "grey",
				}}
			>
				<Circle size={24} />
			</button>
			<button
				onClick={() => {
					setDrawMethod("elipse");
					setStore({ ...store, isFilled: true });
				}}
				title="Draw filled elipse"
				style={{
					marginBottom: "0.5rem",
					color:
						drawMethod === "elipse" && store.isFilled
							? "lightgray"
							: "grey",
				}}
			>
				<CircleDot size={24} />
			</button>
		</div>
	);
};

export default DrawButtons;
