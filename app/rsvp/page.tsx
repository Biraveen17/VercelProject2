"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { PageTracker } from "@/components/page-tracker"
import { Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Guest {
  _id: string
  name: string
  guestType: "defined" | "tbc"
  isChild: boolean
  side?: "bride" | "groom"
  groupId?: string
  notes?: string
  rsvpStatus: "pending" | "attending" | "not-attending"
  events: ("wedding" | "reception")[]
  dietaryRequirements?: string
  questions?: string
  ageGroup?: string
  lockStatus?: "locked" | "unlocked"
  creationStatus?: "Original" | "New" | "Removed"
}

interface Group {
  _id: string
  name: string
}

export default function RSVPPage() {
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [guestName, setGuestName] = useState("")
  const [searchResult, setSearchResult] = useState<{
    type: "individual" | "group"
    guest?: Guest
    group?: Group
    guests?: Guest[]
  } | null>(null)

  const [guestEvents, setGuestEvents] = useState<{ [key: string]: ("wedding" | "reception" | "not-attending")[] }>({})
  const [dietaryRequirements, setDietaryRequirements] = useState("")
  const [questions, setQuestions] = useState("")
  const [guestNames, setGuestNames] = useState<{ [key: string]: string }>({})
  const [guestChildStatus, setGuestChildStatus] = useState<{ [key: string]: boolean }>({})
  const [guestAgeGroups, setGuestAgeGroups] = useState<{ [key: string]: string }>({})
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [guestToDelete, setGuestToDelete] = useState<string | null>(null)

  const handleGuestSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`/api/guests/rsvp/search?name=${encodeURIComponent(guestName)}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to find guest")
        setIsLoading(false)
        return
      }

      if (data.type === "group" && data.guests) {
        const activeGuests = data.guests.filter((g: Guest) => g.creationStatus !== "Removed")

        const initialNames: { [key: string]: string } = {}
        const initialChildStatus: { [key: string]: boolean } = {}
        const initialAgeGroups: { [key: string]: string } = {}
        const initialEvents: { [key: string]: ("wedding" | "reception" | "not-attending")[] } = {}

        activeGuests.forEach((guest: Guest) => {
          initialNames[guest._id] = guest.name || ""
          initialChildStatus[guest._id] = guest.isChild
          initialAgeGroups[guest._id] = guest.ageGroup || ""

          if (guest.rsvpStatus === "not-attending") {
            initialEvents[guest._id] = ["not-attending"]
          } else {
            initialEvents[guest._id] = guest.events || []
          }
        })

        setGuestNames(initialNames)
        setGuestChildStatus(initialChildStatus)
        setGuestAgeGroups(initialAgeGroups)
        setGuestEvents(initialEvents)
        setSearchResult({ ...data, guests: activeGuests })
        setDietaryRequirements(activeGuests[0]?.dietaryRequirements || "")
        setQuestions(activeGuests[0]?.questions || "")
        setStep(2)
      } else if (data.type === "individual" && data.guest) {
        const guest = data.guest

        setSearchResult(data)
        setGuestChildStatus({ [guest._id]: guest.isChild })
        setGuestAgeGroups({ [guest._id]: guest.ageGroup || "" })
        setGuestNames({ [guest._id]: guest.name })

        if (guest.rsvpStatus === "not-attending") {
          setGuestEvents({ [guest._id]: ["not-attending"] })
        } else {
          setGuestEvents({ [guest._id]: guest.events || [] })
        }

        setDietaryRequirements(guest.dietaryRequirements || "")
        setQuestions(guest.questions || "")
        setStep(2)
      }
    } catch (error) {
      console.error("Error searching for guest:", error)
      setError("An error occurred while searching. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (searchResult?.type === "group" && searchResult.guests) {
      for (const guest of searchResult.guests) {
        if (!guestEvents[guest._id] || guestEvents[guest._id].length === 0) {
          setError(`Please select attendance for ${guest.name}`)
          return
        }
      }
    } else if (searchResult?.type === "individual" && searchResult.guest) {
      if (!guestEvents[searchResult.guest._id] || guestEvents[searchResult.guest._id].length === 0) {
        setError("Please select your attendance")
        return
      }
    }

    if (searchResult?.type === "group" && searchResult.guests) {
      for (const guest of searchResult.guests) {
        if (guestChildStatus[guest._id] && !guestAgeGroups[guest._id]) {
          setError(`Please select an age group for ${guest.name}`)
          return
        }
      }
    } else if (searchResult?.type === "individual" && searchResult.guest) {
      if (guestChildStatus[searchResult.guest._id] && !guestAgeGroups[searchResult.guest._id]) {
        setError("Please select an age group if marking as a child.")
        return
      }
    }

    setIsLoading(true)

    try {
      let requestBody: any

      if (searchResult?.type === "group") {
        const guestsData = searchResult.guests?.map((guest) => ({
          _id: guest._id,
          name: guestNames[guest._id] || guest.name,
          isChild: guestChildStatus[guest._id] || false,
          ageGroup: guestChildStatus[guest._id] && guestAgeGroups[guest._id] ? guestAgeGroups[guest._id] : undefined,
          events: guestEvents[guest._id] || [],
          rsvpStatus: guestEvents[guest._id]?.includes("not-attending") ? "not-attending" : "attending",
        }))

        requestBody = {
          type: "group",
          groupId: searchResult.group?._id,
          guests: guestsData,
          dietaryRequirements: dietaryRequirements,
          questions: questions,
        }
      } else {
        const events = guestEvents[searchResult?.guest?._id || ""] || []
        const isAttending = !events.includes("not-attending")

        requestBody = {
          type: "individual",
          guestId: searchResult?.guest?._id,
          events: isAttending ? events.filter((e) => e !== "not-attending") : [],
          rsvpStatus: isAttending ? "attending" : "not-attending",
          dietaryRequirements: isAttending ? dietaryRequirements : "",
          questions: questions,
          isChild: guestChildStatus[searchResult?.guest?._id || ""] || false,
          ageGroup:
            guestChildStatus[searchResult?.guest?._id || ""] && guestAgeGroups[searchResult?.guest?._id || ""]
              ? guestAgeGroups[searchResult?.guest?._id || ""]
              : undefined,
        }
      }

      const response = await fetch("/api/guests/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to submit RSVP")
        setIsLoading(false)
        return
      }

      setSuccess(true)
    } catch (error) {
      console.error("Error submitting RSVP:", error)
      setError("An error occurred while submitting. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGuest = async (guestId: string) => {
    try {
      const response = await fetch(`/api/guests/${guestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creationStatus: "Removed",
          lockStatus: "locked",
        }),
      })

      if (!response.ok) {
        setError("Failed to delete guest")
        return
      }

      if (searchResult?.type === "group" && searchResult.guests) {
        const updatedGuests = searchResult.guests.filter((g) => g._id !== guestId)
        setSearchResult({ ...searchResult, guests: updatedGuests })

        const newGuestNames = { ...guestNames }
        const newGuestChildStatus = { ...guestChildStatus }
        const newGuestAgeGroups = { ...guestAgeGroups }
        const newGuestEvents = { ...guestEvents }

        delete newGuestNames[guestId]
        delete newGuestChildStatus[guestId]
        delete newGuestAgeGroups[guestId]
        delete newGuestEvents[guestId]

        setGuestNames(newGuestNames)
        setGuestChildStatus(newGuestChildStatus)
        setGuestAgeGroups(newGuestAgeGroups)
        setGuestEvents(newGuestEvents)
      }

      setDeleteDialogOpen(false)
      setGuestToDelete(null)
    } catch (error) {
      console.error("Error deleting guest:", error)
      setError("An error occurred while deleting the guest")
    }
  }

  const openDeleteDialog = (guestId: string) => {
    setGuestToDelete(guestId)
    setDeleteDialogOpen(true)
  }

  if (success) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <PageTracker pageName="rsvp" />

        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-16 h-16 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-4">{t("thankYouTitle")}</h2>
            <p className="text-muted-foreground mb-6">{t("thankYouAttending")}</p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              {t("backToHome")}
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <PageTracker pageName="rsvp" />

      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="display-text mb-6">{t("rsvpTitle")}</h1>
          <p className="text-lg text-muted-foreground">{t("rsvpSubtitle")}</p>
        </div>

        {step === 1 && (
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleGuestSearch} className="space-y-4">
                <div>
                  <label htmlFor="guestName" className="block text-sm font-medium mb-2">
                    {t("enterYourName")}
                  </label>
                  <input
                    type="text"
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    placeholder={t("namePlaceholder")}
                    required
                  />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? t("searching") : t("findMyInvitation")}
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && searchResult && (
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  {t("welcomeGuest", {
                    name: searchResult.type === "group" ? searchResult.group?.name : searchResult.guest?.name,
                  })}
                </h2>
              </div>

              <form onSubmit={handleRSVPSubmit} className="space-y-6">
                {searchResult.type === "group" && searchResult.guests && searchResult.guests.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-3">{t("groupMemberNames")}</label>
                    <div className="space-y-4">
                      {searchResult.guests.map((guest, index) => {
                        const isLocked = guest.lockStatus === "locked"
                        const events = guestEvents[guest._id] || []
                        const isNotAttending = events.includes("not-attending")

                        return (
                          <div
                            key={guest._id}
                            className={`border rounded-lg p-4 space-y-3 relative ${
                              isLocked ? "bg-muted/20 border-muted" : "bg-muted/30 border-muted"
                            }`}
                          >
                            {!isLocked && (
                              <button
                                type="button"
                                onClick={() => openDeleteDialog(guest._id)}
                                className="absolute top-3 right-3 p-1 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
                                title={t("deleteGuest")}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}

                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm font-medium text-muted-foreground min-w-[60px]">
                                Guest {index + 1}
                              </span>
                              {isLocked && (
                                <span className="text-xs text-muted-foreground">(Locked - Already RSVP'd)</span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-3 mb-3">
                              <label
                                className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-colors ${
                                  events.includes("wedding") && !isNotAttending
                                    ? "bg-green-100 border-green-500 text-green-700"
                                    : "bg-background border-input hover:bg-muted"
                                } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={events.includes("wedding") && !isNotAttending}
                                  onChange={(e) => {
                                    if (isLocked) return
                                    const newEvents = [...events].filter((e) => e !== "not-attending")
                                    if (e.target.checked) {
                                      if (!newEvents.includes("wedding")) newEvents.push("wedding")
                                    } else {
                                      const idx = newEvents.indexOf("wedding")
                                      if (idx > -1) newEvents.splice(idx, 1)
                                    }
                                    setGuestEvents({ ...guestEvents, [guest._id]: newEvents })
                                    setError("")
                                  }}
                                  disabled={isLocked}
                                  className="rounded"
                                />
                                <Check
                                  className={`w-4 h-4 ${events.includes("wedding") && !isNotAttending ? "opacity-100" : "opacity-0"}`}
                                />
                                <span className="text-sm font-medium">{t("attendingWedding")}</span>
                              </label>

                              <label
                                className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-colors ${
                                  events.includes("reception") && !isNotAttending
                                    ? "bg-green-100 border-green-500 text-green-700"
                                    : "bg-background border-input hover:bg-muted"
                                } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={events.includes("reception") && !isNotAttending}
                                  onChange={(e) => {
                                    if (isLocked) return
                                    const newEvents = [...events].filter((e) => e !== "not-attending")
                                    if (e.target.checked) {
                                      if (!newEvents.includes("reception")) newEvents.push("reception")
                                    } else {
                                      const idx = newEvents.indexOf("reception")
                                      if (idx > -1) newEvents.splice(idx, 1)
                                    }
                                    setGuestEvents({ ...guestEvents, [guest._id]: newEvents })
                                    setError("")
                                  }}
                                  disabled={isLocked}
                                  className="rounded"
                                />
                                <Check
                                  className={`w-4 h-4 ${events.includes("reception") && !isNotAttending ? "opacity-100" : "opacity-0"}`}
                                />
                                <span className="text-sm font-medium">{t("attendingReception")}</span>
                              </label>

                              <label
                                className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-colors ${
                                  isNotAttending
                                    ? "bg-red-100 border-red-500 text-red-700"
                                    : "bg-background border-input hover:bg-muted"
                                } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isNotAttending}
                                  onChange={(e) => {
                                    if (isLocked) return
                                    if (e.target.checked) {
                                      setGuestEvents({ ...guestEvents, [guest._id]: ["not-attending"] })
                                    } else {
                                      setGuestEvents({ ...guestEvents, [guest._id]: [] })
                                    }
                                    setError("")
                                  }}
                                  disabled={isLocked}
                                  className="rounded"
                                />
                                <Check className={`w-4 h-4 ${isNotAttending ? "opacity-100" : "opacity-0"}`} />
                                <span className="text-sm font-medium">{t("sorryCannotMakeIt")}</span>
                              </label>
                            </div>

                            {!isNotAttending && (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-muted-foreground min-w-[60px]">Name</span>
                                  <input
                                    type="text"
                                    value={guestNames[guest._id] || ""}
                                    onChange={(e) => {
                                      if (!isLocked) {
                                        setGuestNames({ ...guestNames, [guest._id]: e.target.value })
                                      }
                                    }}
                                    disabled={isLocked}
                                    className={`flex-1 px-3 py-1.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                                      isLocked
                                        ? "bg-muted/70 cursor-not-allowed opacity-80 text-muted-foreground"
                                        : "bg-background"
                                    }`}
                                    placeholder={t("memberNamePlaceholder", { number: index + 1 })}
                                    required
                                    readOnly={isLocked}
                                  />
                                </div>
                                <div className="flex items-center gap-4 pl-[68px]">
                                  <label className="flex items-center gap-2 text-sm">
                                    <input
                                      type="checkbox"
                                      checked={guestChildStatus[guest._id] || false}
                                      onChange={(e) => {
                                        if (!isLocked) {
                                          setGuestChildStatus({
                                            ...guestChildStatus,
                                            [guest._id]: e.target.checked,
                                          })
                                          if (!e.target.checked) {
                                            const newAgeGroups = { ...guestAgeGroups }
                                            delete newAgeGroups[guest._id]
                                            setGuestAgeGroups(newAgeGroups)
                                          }
                                        }
                                      }}
                                      disabled={isLocked}
                                      className="rounded"
                                    />
                                    <span className="text-muted-foreground">Child</span>
                                  </label>
                                  {guestChildStatus[guest._id] && (
                                    <select
                                      value={guestAgeGroups[guest._id] || ""}
                                      onChange={(e) => {
                                        if (!isLocked) {
                                          setGuestAgeGroups({ ...guestAgeGroups, [guest._id]: e.target.value })
                                        }
                                      }}
                                      disabled={isLocked}
                                      className={`flex-1 px-2 py-1 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                                        isLocked ? "bg-muted/70 cursor-not-allowed opacity-80" : "bg-background"
                                      }`}
                                      required
                                    >
                                      <option value="">Age group *</option>
                                      <option value="under-4">Under 4 years</option>
                                      <option value="4-12">4-12 years</option>
                                      <option value="over-12">Over 12 years</option>
                                    </select>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {searchResult.type === "individual" && searchResult.guest && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-3">Select your attendance</label>
                      <div className="flex flex-wrap gap-3">
                        <label
                          className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-colors ${
                            guestEvents[searchResult.guest._id]?.includes("wedding") &&
                            !guestEvents[searchResult.guest._id]?.includes("not-attending")
                              ? "bg-green-100 border-green-500 text-green-700"
                              : "bg-background border-input hover:bg-muted"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={
                              guestEvents[searchResult.guest._id]?.includes("wedding") &&
                              !guestEvents[searchResult.guest._id]?.includes("not-attending")
                            }
                            onChange={(e) => {
                              const events = [...(guestEvents[searchResult.guest._id] || [])].filter(
                                (e) => e !== "not-attending",
                              )
                              if (e.target.checked) {
                                if (!events.includes("wedding")) events.push("wedding")
                              } else {
                                const idx = events.indexOf("wedding")
                                if (idx > -1) events.splice(idx, 1)
                              }
                              setGuestEvents({ ...guestEvents, [searchResult.guest._id]: events })
                              setError("")
                            }}
                            className="rounded"
                          />
                          <Check
                            className={`w-4 h-4 ${
                              guestEvents[searchResult.guest._id]?.includes("wedding") &&
                              !guestEvents[searchResult.guest._id]?.includes("not-attending")
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          <span className="text-sm font-medium">{t("attendingWedding")}</span>
                        </label>

                        <label
                          className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-colors ${
                            guestEvents[searchResult.guest._id]?.includes("reception") &&
                            !guestEvents[searchResult.guest._id]?.includes("not-attending")
                              ? "bg-green-100 border-green-500 text-green-700"
                              : "bg-background border-input hover:bg-muted"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={
                              guestEvents[searchResult.guest._id]?.includes("reception") &&
                              !guestEvents[searchResult.guest._id]?.includes("not-attending")
                            }
                            onChange={(e) => {
                              const events = [...(guestEvents[searchResult.guest._id] || [])].filter(
                                (e) => e !== "not-attending",
                              )
                              if (e.target.checked) {
                                if (!events.includes("reception")) events.push("reception")
                              } else {
                                const idx = events.indexOf("reception")
                                if (idx > -1) events.splice(idx, 1)
                              }
                              setGuestEvents({ ...guestEvents, [searchResult.guest._id]: events })
                              setError("")
                            }}
                            className="rounded"
                          />
                          <Check
                            className={`w-4 h-4 ${
                              guestEvents[searchResult.guest._id]?.includes("reception") &&
                              !guestEvents[searchResult.guest._id]?.includes("not-attending")
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          <span className="text-sm font-medium">{t("attendingReception")}</span>
                        </label>

                        <label
                          className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-colors ${
                            guestEvents[searchResult.guest._id]?.includes("not-attending")
                              ? "bg-red-100 border-red-500 text-red-700"
                              : "bg-background border-input hover:bg-muted"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={guestEvents[searchResult.guest._id]?.includes("not-attending")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGuestEvents({ ...guestEvents, [searchResult.guest._id]: ["not-attending"] })
                              } else {
                                setGuestEvents({ ...guestEvents, [searchResult.guest._id]: [] })
                              }
                              setError("")
                            }}
                            className="rounded"
                          />
                          <Check
                            className={`w-4 h-4 ${
                              guestEvents[searchResult.guest._id]?.includes("not-attending")
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          <span className="text-sm font-medium">{t("sorryCannotMakeIt")}</span>
                        </label>
                      </div>
                    </div>

                    {!guestEvents[searchResult.guest._id]?.includes("not-attending") && (
                      <>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`child-${searchResult.guest._id}`}
                            checked={guestChildStatus[searchResult.guest._id] || false}
                            onChange={(e) => {
                              setGuestChildStatus({
                                ...guestChildStatus,
                                [searchResult.guest._id]: e.target.checked,
                              })
                              if (!e.target.checked) {
                                const newAgeGroups = { ...guestAgeGroups }
                                delete newAgeGroups[searchResult.guest._id]
                                setGuestAgeGroups(newAgeGroups)
                              }
                            }}
                            className="mr-2"
                          />
                          <label htmlFor={`child-${searchResult.guest._id}`} className="text-sm">
                            I am a child
                          </label>
                        </div>
                        {guestChildStatus[searchResult.guest._id] && (
                          <div>
                            <label className="block text-sm font-medium mb-2">Age Group *</label>
                            <select
                              value={guestAgeGroups[searchResult.guest._id] || ""}
                              onChange={(e) => {
                                setGuestAgeGroups({
                                  ...guestAgeGroups,
                                  [searchResult.guest._id]: e.target.value,
                                })
                              }}
                              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                              required
                            >
                              <option value="">Select age group *</option>
                              <option value="under-4">Under 4 years</option>
                              <option value="4-12">4-12 years</option>
                              <option value="over-12">Over 12 years</option>
                            </select>
                          </div>
                        )}

                        <div>
                          <label htmlFor="dietary" className="block text-sm font-medium mb-2">
                            {t("dietaryRequirements")}
                          </label>
                          <textarea
                            id="dietary"
                            value={dietaryRequirements}
                            onChange={(e) => setDietaryRequirements(e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                            rows={3}
                            placeholder={t("dietaryPlaceholder")}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {searchResult.type === "group" &&
                  searchResult.guests?.some(
                    (g) => !guestEvents[g._id]?.includes("not-attending") && guestEvents[g._id]?.length > 0,
                  ) && (
                    <div>
                      <label htmlFor="dietary" className="block text-sm font-medium mb-2">
                        {t("dietaryRequirements")}
                      </label>
                      <textarea
                        id="dietary"
                        value={dietaryRequirements}
                        onChange={(e) => setDietaryRequirements(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                        rows={3}
                        placeholder={t("dietaryPlaceholder")}
                      />
                    </div>
                  )}

                <div>
                  <label htmlFor="questions" className="block text-sm font-medium mb-2">
                    {t("questionsComments")}
                  </label>
                  <textarea
                    id="questions"
                    value={questions}
                    onChange={(e) => setQuestions(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    rows={3}
                    placeholder={t("questionsPlaceholder")}
                  />
                </div>

                {error && <p className="text-destructive text-sm">{error}</p>}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1)
                      setSearchResult(null)
                      setError("")
                    }}
                    className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80 transition-colors"
                    disabled={isLoading}
                  >
                    {t("back")}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : t("submitRSVP")}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("confirmDeleteGuest")}</DialogTitle>
            <DialogDescription className="pt-4">{t("confirmDeleteMessage")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setGuestToDelete(null)
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (guestToDelete) {
                  handleDeleteGuest(guestToDelete)
                }
              }}
            >
              {t("confirmDelete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
