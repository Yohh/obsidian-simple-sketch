import { Download, Save } from "lucide-react";
import { Store } from "components/types";

type SaveButtonsProps = {
	historyIndex: number;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	finalCanvas: HTMLCanvasElement | null;
	setStore: React.Dispatch<React.SetStateAction<Store>>;
};

const SaveButtons = ({
	historyIndex,
	setShowModal,
	finalCanvas,
	setStore,
}: SaveButtonsProps) => {
	const downloadCanvas = () => {
		if (!finalCanvas) return;

		setStore((prev) => ({ ...prev, isSaving: true }));

		// TODO: isolate this logic into a util function
		const date = new Date(Date.now())
			.toLocaleString()
			.replace(/\//g, "-")
			.replace(/,/g, "")
			.replace(/ /g, "_");

		// TODO: isolate this logic into a util function
		const canvas = document.createElement("canvas");
		canvas.width = finalCanvas.width;
		canvas.height = finalCanvas.height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(finalCanvas, 0, 0);

		const link = document.createElement("a");
		link.download = `simple_sketch-${date}.jpg`;
		link.href = canvas.toDataURL();
		link.click();
	};

	return (
		<>
			<hr
				style={{
					marginTop: "0.5rem",
					marginBottom: "1rem",
				}}
			/>
			<button
				title="Save in vault"
				disabled={historyIndex === -1}
				onClick={() => setShowModal(true)}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						setShowModal(false);
					}
				}}
				style={{
					marginBottom: "0.5rem",
				}}
			>
				<Save size={24} />
			</button>
			<button
				onClick={downloadCanvas}
				title="Download"
				disabled={historyIndex === -1}
				style={{
					marginBottom: "0.5rem",
				}}
			>
				<Download size={24} />
			</button>
		</>
	);
};

export default SaveButtons;
