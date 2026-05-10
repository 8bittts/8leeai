interface UnderlinedWordProps {
  text: string
  linkWord?: string | undefined
}

export function UnderlinedWord({ text, linkWord }: UnderlinedWordProps) {
  if (!linkWord || linkWord.trim() === "") {
    return <>{text}</>
  }

  const escapedLinkWord = linkWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const parts = text.split(new RegExp(`(${escapedLinkWord})`, "i"))
  const lower = linkWord.toLowerCase()

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = part.toLowerCase() === lower
        return (
          // react-doctor-disable-next-line react-doctor/no-array-index-as-key
          <span key={i} className={isMatch ? "underline" : undefined}>
            {part}
          </span>
        )
      })}
    </>
  )
}
