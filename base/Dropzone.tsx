"use client"

// #region imports
import {
    ReactNode,
    useRef,
    useState,
} from "react"

import { Upload } from "@/icons"
import { cn } from "@/lib"
// #endregion

export interface IDropzoneProps {
    accept: string
    multiple?: boolean
    disabled?: boolean
    title?: ReactNode
    hint?: ReactNode
    onFiles: (files: File[]) => void
    className?: string
}

const Dropzone = ({
    accept,
    multiple = false,
    disabled = false,
    title = "Drop files here or browse",
    hint,
    onFiles,
    className,
}: IDropzoneProps) => {
    const input = useRef<HTMLInputElement | null>(null)
    const [dragging, setDragging] = useState<boolean>(false)

    const emit = (list: FileList | null) => {
        if (!list || disabled) return
        const files = Array.from(list)
        onFiles(multiple ? files : files.slice(0, 1))
    }

    return (
        <button
            type="button"
            className="w-full disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
            onClick={() => input.current?.click()}
            onDragOver={e => {
                e.preventDefault()
                if (!disabled) setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
                e.preventDefault()
                setDragging(false)
                emit(e.dataTransfer.files)
            }}
        >
            <section
                data-dragging={dragging}
                className={cn(
                    "flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-grey-100 bg-default p-8 text-center smooth",
                    "hover:border-mint-200 hover:bg-mint-50",
                    "data-[dragging=true]:border-mint-300 data-[dragging=true]:bg-mint-50",
                    className
                )}
            >
                <span className="
                    w-10 h-10 rounded-full bg-paper ring-1 ring-grey-100
                    flex items-center justify-center text-mint-300
                ">
                    <Upload size={16}/>
                </span>

                <span className="font-bold text-charcoal-100">
                    {title}
                </span>

                {
                    hint &&
                    <span className="text-xs text-grey-200">
                        {hint}
                    </span>
                }

                <input
                    ref={input}
                    type="file"
                    hidden
                    accept={accept}
                    multiple={multiple}
                    onChange={e => {
                        emit(e.target.files)
                        e.target.value = ""
                    }}
                />
            </section>
        </button>
    )
}

export default Dropzone
