export type Store = {
	primaryColor: string;
	lineWidth: number;
	isFilled: boolean;
	isSaving: boolean;
};

export type DrawMethod =
	| "hand"
	| "line"
	| "rect"
	| "elipse"
	| "rubber"
	| "text";

export type Method = {
	name: DrawMethod;
	icon: string;
	isFilled: boolean;
	title: string;
};
