import { colors, lines } from "../consts";
import type { Store } from "../types";

type SetButtonsProps = {
	store: Store;
	setStore: React.Dispatch<React.SetStateAction<Store>>;
	width: number;
};

export const SetButtons = ({ store, setStore, width }: SetButtonsProps) => {
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
				right: `${width ? null : "1rem"}`,
				left: `${width ? width - 60 + "px" : null}`,
				display: "flex",
				flexDirection: "column",
			}}
		>
			{colors.map((color) => (
				<button
					key={color.rgb}
					onClick={() => handleSetPRimaryColor(color.rgb)}
					title={color.rgb}
					style={{
						marginBottom: "0.5rem",
					}}
				>
					<div
						style={{
							width: "24px",
							height: "16px",
							backgroundColor:
								store.primaryColor === color.rgb
									? color.rgb
									: color.rgba,
							borderRadius: "0.2rem",
							border: `1px solid ${
								store.primaryColor === color.rgb
									? "white"
									: "grey"
							}`,
						}}
					/>
				</button>
			))}
			<hr
				style={{
					marginTop: "0.5rem",
					marginBottom: "1rem",
				}}
			/>
			{lines.map((line) => (
				<button
					key={line}
					onClick={() => handleSetLineWidth(line)}
					title={`${line}px`}
					style={{
						marginBottom: "0.5rem",
						color: store.lineWidth === line ? "white" : "grey",
					}}
				>
					<div
						style={{
							width: `${line * 4}px`,
							height: `${line * 4}px`,
							backgroundColor:
								store.lineWidth === line ? "white" : "grey",
							borderRadius: "50%",
						}}
					/>
				</button>
			))}
		</div>
	);
};

export default SetButtons;
