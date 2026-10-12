"use client"

// #region imports
import {
    ReactNode,
    useEffect,
    useRef
} from "react"

import { Cancel } from "@/icons"

import {
    cn,
} from "@/lib"

import {
    useMouse
} from "@/hooks"

import { Portal } from "@/context"
// #endregion

const modalVariants = {
    overlay: `
        fixed inset-0 z-101 bg-charcoal-100/20 backdrop-blur-[1px]
        flex p-3
    `,
    container: `
        bg-white rounded-2xl relative animate-modal shadow-xl
        flex flex-col overflow-y-auto ring-1 ring-grey-100
    `,
    positions: {
        side: "ml-auto h-full",
        center: "m-auto max-h-[90vh]",
    },
    sizes: {
        sm: `
            w-[420px]
            max-mobile:w-full
        `,
        md: `
            w-[560px]
            max-mobile:w-full
        `,
        lg: `
            w-[760px]
            max-mobile:w-full
        `,
        full: `
            w-full h-full
        `,
    },
    padding: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    },
    close: `
        absolute top-7 right-6
        cursor-pointer smooth
        text-grey-200 hover:text-charcoal-100

        max-mobile:top-4
        max-mobile:right-4
    `,
}

export interface IModalProps {
    open: boolean
    onClose: () => void

    children: ReactNode
    title?: ReactNode

    size?: keyof typeof modalVariants.sizes
    padding?: keyof typeof modalVariants.padding
    position?: keyof typeof modalVariants.positions

    closeOnOutside?: boolean
    showClose?: boolean

    className?: string
    overlayClassName?: string
    contentClassName?: string
}

const Modal = ({
    open,
    onClose,

    children,
    title,

    size = "md",
    padding = "md",
    position = "center",

    closeOnOutside = true,
    showClose = true,

    className = "",
    overlayClassName = "",
    contentClassName = "",
}: IModalProps) => {
    const modalRef = useRef<HTMLDivElement | null>(null)

    useMouse({
        combination: "mousedown",
        handler: (e) => {
            if(
                open &&
                closeOnOutside &&
                modalRef.current &&
                !modalRef.current.contains(e.target as Node)
            ){
                onClose()
            }
        },
    })

    useEffect(() => {
        if(!open)
            return

        const original = document.body.style.overflow
        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = original
        }
    }, [open])

    if(!open || typeof window === "undefined")
        return null

    return(
        <Portal>
            <div
                className={cn(
                    modalVariants.overlay,
                    overlayClassName
                )}
            >
                <aside
                    ref={modalRef}
                    onMouseDown={e => e.stopPropagation()}
                    onClick={e => e.stopPropagation()}
                    className={cn(
                        modalVariants.container,
                        modalVariants.sizes[size],
                        modalVariants.padding[padding],
                        modalVariants.positions[position],
                        className
                    )}
                >
                    {
                        showClose &&
                        <Cancel
                            size={10}
                            onClick={onClose}
                            className={modalVariants.close}
                        />
                    }

                    {
                        title &&
                        <h2 className="
                            text-charcoal-100 text-lg font-bold
                            mb-5 pr-8
                        ">
                            {title}
                        </h2>
                    }

                    <section
                        className={cn(
                            "flex flex-col",
                            contentClassName
                        )}
                    >
                        {children}
                    </section>
                </aside>
            </div>
        </Portal>
    )
}

export default Modal