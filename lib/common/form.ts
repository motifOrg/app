// #region imports
// #endregion

export type IFieldErrors<T> =
    Partial<Record<keyof T, string>>

export type IValidator<T> = {
    [K in keyof T as T[K] extends string ? K : never]?: 
    (value: T[K]) => string | null
}

export interface IFormResponse<T, R = Record<keyof T, string>> {
	success: boolean
	errors?: Partial<Record<keyof T, string>>
	data?: R
}

export const parseForm = <T>(formData: FormData): Record<keyof T, unknown> =>
	Object.fromEntries(
		Array.from(formData.entries(), ([key, value]) => [
			key,
			value,
		])
	) as Record<keyof T, unknown>

export const validateForm = <T>(
  data: T,
  rules: IValidator<T>
): IFieldErrors<T> | null => {

    const errors: IFieldErrors<T> = {}

    for (const key in rules) {
        const rule = rules[key]
        if (!rule) continue

        const error = rule(data[key])
        if (error)
            errors[key] = error
    }

    if (Object.keys(errors).length)
        return errors

    return null
}

export const requireField =
  (message: string) =>
  (value?: string | null) =>
    !value || value.trim() === ""
      ? message
      : null
