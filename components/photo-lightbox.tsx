"use client"

import { useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PhotoLightboxProps {
  photoUrl: string
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
  currentIndex?: number
  totalPhotos?: number
}

export function PhotoLightbox({ photoUrl, onClose, onNext, onPrev, currentIndex, totalPhotos }: PhotoLightboxProps) {
  useEffect(() => {
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden"

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowRight" && onNext) {
        onNext()
      } else if (e.key === "ArrowLeft" && onPrev) {
        onPrev()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, onNext, onPrev])

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Navigation Buttons */}
      {onPrev && totalPhotos && totalPhotos > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
      )}

      {onNext && totalPhotos && totalPhotos > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      )}

      {/* Photo Counter */}
      {currentIndex !== undefined && totalPhotos && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-light">
          {currentIndex + 1} / {totalPhotos}
        </div>
      )}

      {/* Photo */}
      <div
        className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photoUrl || "/placeholder.svg"}
          alt="Memory"
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  )
}
