"use client"

import {
    createContext,
    useContext,
    useRef,
} from "react"

import { createPortal } from "react-dom"

interface IPortalContext {
    root: React.RefObject<
        HTMLDivElement | null
    >
}

const PortalContext =
    createContext<
        IPortalContext | null
    >(null)

export interface IPortalProvider {
    children: React.ReactNode
}

export const PortalProvider = ({
    children,
}: IPortalProvider) => {
    const root =
        useRef<HTMLDivElement>(null)

    return (
        <PortalContext.Provider
            value={{ root }}
        >
            {children}

            <div 
                ref={root} 
            />
        </PortalContext.Provider>
    )
}

export interface IPortal {
    children: React.ReactNode
}

export const Portal = ({
    children,
}: IPortal) => {
    const context = useContext(
        PortalContext
    )

    if (!context?.root.current)
        return null

    return createPortal(
        children,
        context.root.current
    )
}