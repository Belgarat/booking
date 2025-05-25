export async function verifyPassword(input: string): Promise<boolean> {
    const validPassword = process.env.ADMIN_PASSWORD
    return input === validPassword
}
