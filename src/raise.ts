export function raise(error: unknown): never {
	if (typeof error === 'string') {
		throw new Error(error)
	}
	throw error
}
