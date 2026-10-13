"use server"

// #region imports
import { sendMessage } from "@/lib/api"
// #endregion

export const chatAction = async (companyId: string, query: string) => {
	if (!query.trim())
		return { success: false, error: "Write a question or note first", data: [] }

	const res = await sendMessage(companyId, query.trim())

	return {
		success: res.success,
		error: res.error,
		data: res.data ?? [],
	}
}
