import { Eraser, PencilLine, Slash, Square, Circle, Type } from "lucide-react";
import { methods } from "components/consts";
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
	const setIcon = (name: string, isFilled: boolean) => {
		switch (true) {
			case name === "Eraser":
				return <Eraser size={24} />;
			case name === "PencilLine":
				return <PencilLine size={24} />;
			case name === "Slash":
				return <Slash size={24} />;
			case name === "Square" && !isFilled:
				return <Square size={24} />;
			case name === "Square" && isFilled:
				return (
					<Square
						size={24}
						fill={`${
							drawMethod === "rect" && store.isFilled
								? "lightgray"
								: "grey"
						}`}
					/>
				);
			case name === "Circle" && !isFilled:
				return <Circle size={24} />;
			case name === "Circle" && isFilled:
				return (
					<Circle
						size={24}
						fill={`
					${drawMethod === "elipse" && store.isFilled ? "lightgray" : "grey"}
					`}
					/>
				);
			case name === "Type":
				return <Type size={24} />;
			default:
				return null;
		}
	};

	return (
		<>
			<hr
				style={{
					marginTop: "0",
					marginBottom: "1rem",
				}}
			/>
			{methods.map((method) => (
				<button
					key={method.title}
					onClick={() => {
						setDrawMethod(method.name);
						setStore({ ...store, isFilled: method.isFilled });
					}}
					title={method.title}
					style={{
						marginBottom: "0.5rem",
						color:
							drawMethod === method.name &&
							store.isFilled === method.isFilled
								? "lightgray"
								: "grey",
					}}
				>
					{setIcon(method.icon, method.isFilled)}
				</button>
			))}
		</>
	);
};

export default DrawButtons;
