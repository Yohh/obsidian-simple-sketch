import { Method } from "./types";

export const methods: Method[] = [
	{
		name: "rubber",
		icon: "Eraser",
		isFilled: false,
		title: "Erase",
	},
	{
		name: "hand",
		icon: "PencilLine",
		isFilled: false,
		title: "Draw by hand",
	},
	{
		name: "line",
		icon: "Slash",
		isFilled: false,
		title: "Draw line",
	},
	{
		name: "rect",
		icon: "Square",
		isFilled: false,
		title: "Draw rectangle",
	},
	{
		name: "rect",
		icon: "Square",
		isFilled: true,
		title: "Draw filled rectangle",
	},
	{
		name: "elipse",
		icon: "Circle",
		isFilled: false,
		title: "Draw elipse",
	},
	{
		name: "elipse",
		icon: "Circle",
		isFilled: true,
		title: "Draw filled elipse",
	},
	{
		name: "text",
		icon: "Type",
		isFilled: false,
		title: "Write text",
	},
];

export const colors = [
	{
		rgb: "rgb(0, 0, 0)",
		rgba: "rgba(0, 0, 0, 0.5)",
	},
	{
		rgb: "rgb(255, 0, 0)",
		rgba: "rgba(255, 0, 0, 0.5)",
	},
	{
		rgb: "rgb(0, 255, 0)",
		rgba: "rgba(0, 255, 0, 0.5)",
	},
	{
		rgb: "rgb(0, 0, 255)",
		rgba: "rgba(0, 0, 255, 0.5)",
	},
	{
		rgb: "rgb(255, 165, 0)",
		rgba: "rgba(255, 165, 0, 0.5)",
	},
	{
		rgb: "rgb(128, 0, 128)",
		rgba: "rgba(128, 0, 128, 0.5)",
	},
];

export const lines = [1, 2, 3, 4, 5];
