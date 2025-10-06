import Image from "next/image"

interface FlagIconProps {
  flag: string
  imageUrl?: string
  alt: string
  className?: string
}

export function FlagIcon({ flag, imageUrl, alt, className = "" }: FlagIconProps) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={alt}
        width={20}
        height={20}
        priority
        unoptimized={imageUrl.includes("blob.vercel-storage.com")}
        className={`inline-block ${className}`}
        style={{ objectFit: "contain" }}
        sizes="20px"
      />
    )
  }

  return <span className={className}>{flag}</span>
}
