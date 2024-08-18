import { Minus, Paintbrush } from "lucide-react";
import type { Store } from "../types";

type SetButtonsProps = {
	store: Store;
	setStore: React.Dispatch<React.SetStateAction<Store>>;
};

export const SetButtons = ({ store, setStore }: SetButtonsProps) => {
	const handleSetPRimaryColor = (color: string) => {
		setStore((prev) => ({ ...prev, primaryColor: color }));
	};

	const handleSetLineWidth = (width: number) => {
		setStore((prev) => ({ ...prev, lineWidth: width }));
	};

	return (
		<div
			style={{
				position: "absolute",
				top: "1rem",
				right: "1rem",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<button
				onClick={() => handleSetPRimaryColor("rgb(0, 0, 0)")}
				title="Black"
				style={{
					marginBottom: "0.5rem",
					color:
						store.primaryColor === "rgb(0, 0, 0)"
							? "rgb(0, 0, 0)"
							: "rgb(100, 100, 100)",
				}}
			>
				<Paintbrush size={24} />
			</button>
			<button
				onClick={() => handleSetPRimaryColor("rgb(255, 0, 0)")}
				title="Red"
				style={{
					marginBottom: "0.5rem",
					color:
						store.primaryColor === "rgb(255, 0, 0)"
							? "rgb(255, 0, 0)"
							: "rgba(255, 0, 0, 0.5)",
				}}
			>
				<Paintbrush size={24} />
			</button>
			<button
				onClick={() => handleSetPRimaryColor("rgb(0, 255, 0)")}
				title="Green"
				style={{
					marginBottom: "0.5rem",
					color:
						store.primaryColor === "rgb(0, 255, 0)"
							? "rgb(0, 255, 0)"
							: "rgba(0, 255, 0, 0.5)",
				}}
			>
				<Paintbrush size={24} />
			</button>
			<button
				onClick={() => handleSetPRimaryColor("rgb(0, 0, 255)")}
				title="Blue"
				style={{
					marginBottom: "0.5rem",
					color:
						store.primaryColor === "rgb(0, 0, 255)"
							? "rgb(0, 0, 255)"
							: "rgba(0, 0, 255, 0.5)",
				}}
			>
				<Paintbrush size={24} />
			</button>
			<button
				onClick={() => handleSetPRimaryColor("rgb(255, 165, 0)")}
				title="Orange"
				style={{
					marginBottom: "0.5rem",
					color:
						store.primaryColor === "rgb(255, 165, 0)"
							? "rgb(255, 165, 0)"
							: "rgba(255, 165, 0, 0.5)",
				}}
			>
				<Paintbrush size={24} />
			</button>
			<button
				onClick={() => handleSetPRimaryColor("rgb(128, 0, 128)")}
				title="Purple"
				style={{
					marginBottom: "1rem",
					color:
						store.primaryColor === "rgb(128, 0, 128)"
							? "rgb(128, 0, 128)"
							: "rgba(128, 0, 128, 0.5)",
				}}
			>
				<Paintbrush size={24} />
			</button>
			<button
				onClick={() => handleSetLineWidth(1)}
				title="1px"
				style={{
					marginBottom: "0.5rem",
					color: store.lineWidth === 1 ? "white" : "grey",
				}}
			>
				<Minus size={8} />
			</button>
			<button
				onClick={() => handleSetLineWidth(3)}
				title="3px"
				style={{
					marginBottom: "0.5rem",
					color: store.lineWidth === 3 ? "white" : "grey",
				}}
			>
				<Minus size={16} />
			</button>
			<button
				onClick={() => handleSetLineWidth(5)}
				title="5px"
				style={{
					marginBottom: "0.5rem",
					color: store.lineWidth === 5 ? "white" : "grey",
				}}
			>
				<Minus size={24} />
			</button>
		</div>
	);
};

export default SetButtons;
