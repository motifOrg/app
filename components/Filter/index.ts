interface IBaseFilter {
	id: string
	title: string
}

interface ISelectFilter extends IBaseFilter {
	type: "select"
	children: {
        name: string
        value: string
    }[]
}

interface IMultiFilter extends IBaseFilter {
	type: "multi"
	children: {
        name: string
        value: string
    }[]
}

export type IFilter =
	| ISelectFilter
	| IMultiFilter

export { Filter } from "./Filter"
