// #region imports
import { notFound } from "next/navigation"

import { ChatProvider } from "@/context"
import { Globe } from "@/icons"

import {
	Chat,
	Card,
	CompanyControls,
	CompanyTabs,
	Drafts,
	ErrorComponent,
	Fact,
	Findings,
	Fit,
	Header,
	Highlights,
} from "@/components"

import {
	getCampaign,
	getCompany,
	getDrafts,
	getIntegrations,
	getMessages,
	IFinding,
} from "@/lib"
// #endregion

const CompanyPage = async ({ params }: {
	params: Promise<{ id: string }>
}) => {
	const { id } = await params

	const { 
        success, 
        data: company, 
        status, 
        error 
    } = await getCompany(id)

	if (status === 404 || status === 400)
		notFound()

	if (!success || !company)
		return (
            <ErrorComponent 
                title="Couldn't load this company" 
                message={error}
            />
        )
        
	const [
		{ data: campaign },
		{ data: messages = [] },
		{ data: drafts = [] },
		{ data: integrations },
	] = await Promise.all([
		getCampaign(company.campaignId),
		getMessages(id),
		getDrafts({ company_id: id }),
		getIntegrations(),
	])

	const researchEnabled = integrations?.research.enabled ?? false

	const { findings } = company
	const of = (...kinds: IFinding["kind"][]) => 
        findings.filter(finding => kinds.includes(finding.kind))

	return (
		<>
			<div className="flex flex-col gap-1">
				<Header
					title={company.name}
					actions={
                        <CompanyControls 
                            company={company} 
                            researchEnabled={researchEnabled}
                        />
                    }
				/>

				{
					(company.domain || company.industry || company.location) &&
					<p className="
                        flex items-center gap-x-4 gap-y-1 
                        flex-wrap text-sm text-grey-300
                    ">
						{
							company.domain &&
							<a
								href={`https://${company.domain}`}
								target="_blank"
								rel="noopener noreferrer"
								className="
                                    inline-flex items-center gap-1.5 
                                    font-semibold text-mint-300 
                                    hover:underline
                                "
							>
								<Globe size={12}/>
								{company.domain}
							</a>
						}
						
					</p>
				}
			</div>

			<section className="
                grid grid-cols-[1fr_380px] gap-5 
                items-start max-tablet:grid-cols-1
            ">
				<CompanyTabs
					tabs={[
						{
							value: "overview",
							label: "Overview",
							content:
								<div className="flex flex-col gap-5">
									<Card title="Profile">
										<aside className="flex flex-col gap-5">
											<p className="text-grey-300 leading-relaxed">
												{company.description || "No description yet."}
											</p>

											<dl className="
                                                grid grid-cols-4 gap-4 
                                                max-desktop:grid-cols-3 
                                                max-mobile:grid-cols-2
                                            ">
												<Fact label="Employees">{company.employees}</Fact>
												<Fact label="Revenue">{company.revenue}</Fact>
												<Fact label="Founded">{company.foundedYear}</Fact>
												<Fact label="Owner">{company.owner}</Fact>
												<Fact label="Industry">{company.industry}</Fact>
												<Fact label="Location">{company.location}</Fact>
												<Fact label="Source">{company.source === "csv" ? "CSV import" : company.source}</Fact>
												<Fact label="Findings">{findings.length}</Fact>
											</dl>
										</aside>
									</Card>
									<Fit company={company} icp={campaign?.icp}/>
									<aside className="
                                        grid grid-cols-2 gap-5 
                                        max-desktop:grid-cols-1
                                    ">
										<Highlights
											title="Risks & missing information"
											findings={of("risk", "missing")}
											empty="Nothing logged yet. Add risks as you find them."
										/>
										<Highlights
											title="Next actions"
											findings={of("next_action")}
											empty="No next actions logged."
										/>
									</aside>
								</div>,
						},
						{
							value: "findings",
							label: `Findings (${findings.length})`,
							content: <Findings companyId={id} findings={findings}/>,
						},
						{
							value: "outreach",
							label: `Outreach${drafts.length ? ` (${drafts.length})` : ""}`,
							content:
								<Card
									title="Outreach draft"
									description="Templates use the company and owner details. Review before copying. Motif never sends email."
								>
									<Drafts kind="outreach" companyId={id} drafts={drafts}/>
								</Card>,
						},
					]}
				/>

                <ChatProvider 
                    key={id} 
                    initial={messages}
                >
                    <Chat 
                        companyId={id} 
                        enabled={researchEnabled} 
                    />
                </ChatProvider>
			</section>
		</>
	)
}

export default CompanyPage
