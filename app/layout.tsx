// #region imports
import "@/globals.css"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Nunito_Sans } from "next/font/google"
import NextTopLoader from "nextjs-toploader"

import {
	SidenavSection,
	SidenavSkeleton,
} from "@/components"

import { PortalProvider } from "@/context"
// #endregion

export const metadata: Metadata = {
	title: {
		default: "Motif",
		template: "%s · Motif",
	},
	description: "Acquisition sourcing and research for searchers.",
	icons: {
		icon: "/favicon.ico",
	},
}

const nunito = Nunito_Sans({
	variable: "--font-nunito",
	subsets: ["latin"],
})

const RootLayout = ({ children }: LayoutProps<"/">) => (
	<html lang="en" className={nunito.variable}>
		<body
			className="
				font-main antialiased h-screen
				overflow-hidden text-sm
			"
		>
			<NextTopLoader
				color="#7AC3A3"
				height={2}
				showSpinner={false}
			/>

			<PortalProvider>
				<div className="flex h-full">
                    <Suspense fallback={<SidenavSkeleton />}>
                        <SidenavSection />
                    </Suspense>

                    <main
                        id="content"
                        className="
                            flex-1 h-full min-w-0 overflow-y-auto
                            p-6 max-mobile:p-4 max-mobile:pt-14
                            mx-auto flex flex-col gap-6
                        "
                    >
                        {children}
                    </main>
                </div>
			</PortalProvider>
		</body>
	</html>
)

export default RootLayout
