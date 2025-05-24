type Props = {
    message: string
}

export default function ErrorMessage({ message }: Props) {
    return <div className="p-6 text-red-600">{message}</div>
}
