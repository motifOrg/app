"use client"

// #region imports
import { useRouter } from "nextjs-toploader/app"

import {
    usePathname,
    useSearchParams
} from "next/navigation"

import {
    ReactElement,
    useCallback,
    useRef,
    useState
} from "react"

import { useMouse } from "@/hooks"
import { FILTERS_META } from "@/data"
import { IFilter } from "@/components/Filter"

import {
	Cancel,
    Funnel,
} from "@/icons"

import {
    Button,
    SelectGroup,
    CheckboxGroup,
} from "@/base"

import { Portal } from "@/context"
// #endregion

const menuClass = `
	w-[380px] h-full animate-slide-in-right bg-white
	rounded-2xl p-6 pt-16 flex flex-col
	gap-6 relative shadow-xl ring-1 ring-grey-100

	max-mobile:w-full
`

const closeClass = `
	cursor-pointer text-grey-200 smooth
	hover:text-charcoal-100 absolute top-7 right-6
`

const readFilters = (params: URLSearchParams) =>
    Object.fromEntries(
        FILTERS_META.map(filter => [
            filter.id,
            filter.type === "multi"
                ? params.get(filter.id)?.split(",").filter(Boolean) ?? []
                : params.get(filter.id) ?? ""
        ])
    ) as Record<string, string | string[]>

export const Filter = ({ filters = FILTERS_META }:{
    filters?: IFilter[]
}) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const menuRef = useRef<HTMLMenuElement | null>(null)
	const [open, setOpen] = useState<boolean>(false)
    const [values, setValues] = useState(
        () => readFilters(searchParams)
    )

    const active = filters.reduce(
        (count, filter) => {
            const value = searchParams.get(filter.id)
            if (!value || filter.type === "select")
                return count
            return count + value.split(",").length
        },
        0
    )

    useMouse({
        combination:"mousedown",
        handler: (e) => {
            if(open && !menuRef.current?.contains(e.target as Node)){
                setOpen(false)
            }
        },
    })

    const show = () => {
        setValues(readFilters(searchParams))
        setOpen(true)
    }

    const push = useCallback(
        (next: Record<string, string | string[]>) => {
            const params = new URLSearchParams(searchParams.toString())

            filters.forEach(filter => {
                const value = next[filter.id]
                const serialized = Array.isArray(value)
                    ? value.join(",")
                    : value

                if (serialized) params.set(filter.id, serialized)
                else params.delete(filter.id)
            })

            params.delete("page")
            router.push(`${pathname}?${params.toString()}`)
            setOpen(false)
        },
        [router, pathname, searchParams, filters]
    )

    const component = useCallback(
        (filter: IFilter): ReactElement => {
            switch(filter.type){
                case "select":
                    return (
                        <SelectGroup
                            className="text-sm"
                            options={filter.children}
                            value={values[filter.id] as string}
                            onChange={
                                (value) => setValues(
                                    prev => ({ ...prev, [filter.id]: value })
                                )
                            }
                        />
                    )
                case "multi":
                    return (
                        <CheckboxGroup
                            className="text-sm"
                            size="sm"
                            options={filter.children}
                            value={values[filter.id] as string[]}
                            columns={1}
                            onChange={
                                (value) => setValues(
                                    prev => ({ ...prev, [filter.id]: value })
                                )
                            }
                        />
                    )
            }
        },
        [values]
    )

	return(
		<>
			<Button
				onClick={show}
                variant="secondary"
                size="sm"
                startIcon={
                    <Funnel size={14}/>
                }
                endIcon={
                    active > 0 &&
                    <span className="
                        bg-mint-300 text-white rounded-full
                        text-[10px] min-w-4 h-4 px-1
                        inline-flex items-center justify-center
                    ">
                        {active}
                    </span>
                }
			>
				Filter
			</Button>

			{
				open &&
                <Portal>
                    <div className="
                        fixed inset-0 z-101 p-3
                        bg-charcoal-100/20 flex
                    ">
                        <menu
                            ref={menuRef}
                            className={`${menuClass} ml-auto`}
                        >
                            <Cancel
                                className={closeClass}
                                onClick={()=>setOpen(false)}
                                size={10}
                            />

                            <h2 className="
                                text-charcoal-100 text-lg font-bold
                                absolute top-6 left-6
                            ">
                                Filters
                            </h2>

                            <section className="
                                flex flex-col gap-6
                                overflow-y-auto pl-2
                            ">
                                {
                                    filters.map(filter =>
                                        <aside
                                            key={filter.id}
                                            className="space-y-2"
                                        >
                                            <h3 className="font-semibold text-grey-300">
                                                {filter.title}
                                            </h3>

                                            {component(filter)}
                                        </aside>
                                    )
                                }
                            </section>

                            <aside className="
                                flex gap-2 mt-auto pt-4
                                border-t border-grey-150
                            ">
                                <Button
                                    size="sm"
                                    onClick={() => push(values)}
                                >
                                    Apply filters
                                </Button>

                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => push({})}
                                >
                                    Clear all
                                </Button>
                            </aside>
                        </menu>
                    </div>
                </Portal>
			}
		</>
	)
}
