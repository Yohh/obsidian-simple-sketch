import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { useApp } from "../hooks";
import { App, TFolder } from "obsidian";

type SaveModalProps = {
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	finalCanvas: HTMLCanvasElement | null;
};

const SaveModal = ({ setShowModal, finalCanvas }: SaveModalProps) => {
	const { vault } = useApp() as App;

	// TODO: isolate this logic into a util function
	const date = new Date(Date.now())
		.toLocaleString()
		.replace(/\//g, "-")
		.replace(/,/g, "")
		.replace(/ /g, "_")
		.replace(/:/g, "-");

	const [folders, setFolders] = useState<TFolder[]>([]);
	const [selectedFolder, setSelectedFolder] = useState<string>("");
	const [sketchName, setSketchName] = useState<string>(
		`simple_sketch-${date}.jpg`
	);

	const saveCanvas = () => {
		if (!finalCanvas) return;

		// TODO: isolate this logic into a util function
		const canvas = document.createElement("canvas");
		canvas.width = finalCanvas.width;
		canvas.height = finalCanvas.height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(finalCanvas, 0, 0);

		const dataUrl = canvas.toDataURL();
		const base64 = dataUrl.split(",")[1];
		const binary = atob(base64);
		const buffer = new ArrayBuffer(binary.length);
		const view = new Uint8Array(buffer);
		for (let i = 0; i < binary.length; i++) {
			view[i] = binary.charCodeAt(i);
		}

		let path = `${sketchName}.jpg`;

		let counter = 1;
		while (vault.getAbstractFileByPath(selectedFolder + path)) {
			path = `${sketchName}-${counter}.jpg`;
			counter++;
		}

		vault.createBinary(selectedFolder + path, buffer);
	};

	useEffect(() => {
		if (vault) {
			const rootFolder = vault.getRoot();
			const allFolders: TFolder[] = [];

			const getAllFolders = (folder: TFolder) => {
				allFolders.push(folder);
				for (const child of folder.children) {
					if (child instanceof TFolder) {
						getAllFolders(child);
					}
				}
			};

			getAllFolders(rootFolder);
			setFolders(allFolders);
		}
	}, [vault]);

	return (
		<div
			style={{
				position: "absolute",
				top: "5rem",
				left: "3rem",
				width: "100%",
				height: "100%",
				zIndex: 100,
			}}
			onClickCapture={(e) => {
				if (e.target === e.currentTarget) {
					setShowModal(false);
				}
			}}
		>
			<form
				style={{
					position: "absolute",
					top: "10rem",
					left: "2rem",
					width: "40rem",
					backgroundColor: "var(--color-base-00)",
					borderRadius: "0.5rem",
				}}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						setShowModal(false);
					}
				}}
				onSubmit={(e) => {
					e.preventDefault();
					saveCanvas();
					setShowModal(false);
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						padding: "1rem",
						margin: 0,
						backgroundColor: "var(--color-base-30)",
						borderTopLeftRadius: "0.5rem",
						borderTopRightRadius: "0.5rem",
						fontWeight: "bold",
					}}
				>
					<span>Save Sketch</span>
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						padding: "1rem",
						marginTop: "1rem",
					}}
				>
					<label
						htmlFor="sketch-name"
						style={{
							width: "20%",
							marginRight: "1rem",
						}}
					>
						Name
					</label>
					<input
						id="sketch-name"
						type="text"
						value={sketchName}
						onChange={(e) => setSketchName(e.target.value)}
						style={{
							width: "100%",
						}}
					/>
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						padding: "1rem",
					}}
				>
					<label
						htmlFor="sketch-destination"
						style={{
							width: "20%",
							marginRight: "1rem",
						}}
					>
						Destination
					</label>
					<select
						id="sketch-destination"
						value={selectedFolder}
						onChange={(e) =>
							setSelectedFolder(e.target.value + "/")
						}
						style={{
							width: "100%",
						}}
					>
						{folders.map((folder) => (
							<option key={folder.path} value={folder.path}>
								{folder.path}
							</option>
						))}
					</select>
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						padding: "1rem",
					}}
				>
					<button
						type="submit"
						style={{
							marginRight: "1rem",
						}}
					>
						<Check size={24} />
					</button>
					<button onClick={() => setShowModal(false)}>
						<X size={24} />
					</button>
				</div>
			</form>
		</div>
	);
};

export default SaveModal;
