"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { PageTracker } from "@/components/page-tracker"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const [attendingGuestCount, setAttendingGuestCount] = useState<number>(0)
  const [isAttending, setIsAttending] = useState<string>("")
  const [events, setEvents] = useState<string[]>([])
  const [dietaryRequirements, setDietaryRequirements] = useState("")
  const [questions, setQuestions] = useState("")
  const [guestNames, setGuestNames] = useState<{ [key: string]: string }>({})
  const [guestChildStatus, setGuestChildStatus] = useState<{ [key: string]: boolean }>({})
  const [guestAgeGroups, setGuestAgeGroups] = useState<{ [key: string]: string }>({})
  const [showSuggestions, setShowSuggestions] = useState<{ [key: string]: boolean }>({})
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showRemovalConfirmation, setShowRemovalConfirmation] = useState(false)
  const [guestsToRemove, setGuestsToRemove] = useState<string[]>([])

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

      setSearchResult(data)

      if (data.type === "individual" && data.guest) {
        const guest = data.guest
        setIsAttending(guest.rsvpStatus === "attending" ? "yes" : guest.rsvpStatus === "not-attending" ? "no" : "")
        setEvents(guest.events || [])
        setDietaryRequirements(guest.dietaryRequirements || "")
        setQuestions(guest.questions || "")
        setGuestChildStatus({ [guest._id]: guest.isChild })
        setGuestAgeGroups({ [guest._id]: guest.ageGroup || "" })
        setStep(2)
      } else if (data.type === "group" && data.guests) {
        const initialNames: { [key: string]: string } = {}
        const initialChildStatus: { [key: string]: boolean } = {}
        const initialAgeGroups: { [key: string]: string } = {}
        data.guests.forEach((guest: Guest) => {
          initialNames[guest._id] = ""
          initialChildStatus[guest._id] = guest.isChild
          initialAgeGroups[guest._id] = guest.ageGroup || ""
        })
        setGuestNames(initialNames)
        setGuestChildStatus(initialChildStatus)
        setGuestAgeGroups(initialAgeGroups)

        const firstGuest = data.guests[0]
        if (firstGuest) {
          setIsAttending(
            firstGuest.rsvpStatus === "attending" ? "yes" : firstGuest.rsvpStatus === "not-attending" ? "no" : "",
          )
          setEvents(firstGuest.events || [])
          setDietaryRequirements(firstGuest.dietaryRequirements || "")
          setQuestions(firstGuest.questions || "")
        }
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

    if (isAttending === "yes" && events.length === 0) {
      setError("Please select at least one event (wedding or reception) to attend.")
      return
    }

    if (searchResult?.type === "group" && searchResult.guests) {
      const attendingGuests = Array.from({ length: attendingGuestCount }).map((_, index) => {
        const tempId = `temp-${index}`
        return {
          name: guestNames[tempId] || "",
          isChild: guestChildStatus[tempId] || false,
          ageGroup: guestChildStatus[tempId] && guestAgeGroups[tempId] ? guestAgeGroups[tempId] : undefined,
        }
      })

      const emptyNames = attendingGuests.filter((g) => !g.name || !g.name.trim())

      if (emptyNames.length > 0) {
        setError("Please enter names for all attending guests")
        return
      }

      for (const guest of attendingGuests) {
        if (guest.isChild && !guest.ageGroup) {
          setError("Please select an age group for all children.")
          return
        }
      }
    }

    if (searchResult?.type === "individual" && searchResult.guest) {
      if (guestChildStatus[searchResult.guest._id] && !guestAgeGroups[searchResult.guest._id]) {
        setError("Please select an age group if marking as a child.")
        return
      }
    }

    if (searchResult?.type === "group" && searchResult.guests) {
      const attendingGuests = Array.from({ length: attendingGuestCount }).map((_, index) => {
        const tempId = `temp-${index}`
        return {
          name: guestNames[tempId] || "",
          isChild: guestChildStatus[tempId] || false,
          ageGroup: guestChildStatus[tempId] && guestAgeGroups[tempId] ? guestAgeGroups[tempId] : undefined,
        }
      })

      const originalGuestNames = searchResult.guests.map((g) => g.name.toLowerCase().trim())
      const attendingGuestNames = attendingGuests.map((g) => g.name.toLowerCase().trim())
      const removedNames = searchResult.guests
        .filter((g) => !attendingGuestNames.includes(g.name.toLowerCase().trim()))
        .map((g) => g.name)

      if (removedNames.length > 0) {
        setGuestsToRemove(removedNames)
        setShowRemovalConfirmation(true)
        return
      }
    }

    await submitRSVP()
  }

  const submitRSVP = async () => {
    setIsLoading(true)

    try {
      let requestBody: any

      if (searchResult?.type === "group") {
        const attendingGuests = Array.from({ length: attendingGuestCount }).map((_, index) => {
          const tempId = `temp-${index}`
          return {
            name: guestNames[tempId] || "",
            isChild: guestChildStatus[tempId] || false,
            ageGroup: guestChildStatus[tempId] && guestAgeGroups[tempId] ? guestAgeGroups[tempId] : undefined,
          }
        })

        requestBody = {
          type: "group",
          groupId: searchResult.group?._id,
          isAttending: isAttending === "yes",
          events: isAttending === "yes" ? events : [],
          dietaryRequirements: isAttending === "yes" ? dietaryRequirements : "",
          questions: questions,
          attendingGuests: attendingGuests,
          originalGuests: searchResult.guests,
          totalGroupSize: searchResult.guests?.length || 0,
        }
      } else {
        requestBody = {
          type: "individual",
          guestId: searchResult?.guest?._id,
          isAttending: isAttending === "yes",
          events: isAttending === "yes" ? events : [],
          dietaryRequirements: isAttending === "yes" ? dietaryRequirements : "",
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
            <p className="text-muted-foreground mb-6">
              {isAttending === "yes" ? t("thankYouAttending") : t("thankYouNotAttending")}
            </p>
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

      <AlertDialog open={showRemovalConfirmation} onOpenChange={setShowRemovalConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmRemoval")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmRemovalMessage")}
              <ul className="mt-2 list-disc list-inside">
                {guestsToRemove.map((name, index) => (
                  <li key={index} className="font-medium">
                    {name}
                  </li>
                ))}
              </ul>
              <p className="mt-2">{t("confirmRemovalList")}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowRemovalConfirmation(false)
                submitRSVP()
              }}
            >
              {t("confirmSubmit")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="display-text mb-6">{t("rsvpTitle")}</h1>
          <p className="text-lg text-muted-foreground">{t("rsvpSubtitle")}</p>
        </div>

        {/* Step 1 - Guest search form */}
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

        {/* Step 2 for group attendance question */}
        {step === 2 && searchResult?.type === "group" && (
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{t("welcomeGuest", { name: searchResult.group?.name })}</h2>
                <p className="text-muted-foreground">
                  {t("groupSize")}: {searchResult.guests?.length || 0} {t("guests")}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">{t("willYouAttend")}</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="attending"
                        value="yes"
                        checked={isAttending === "yes"}
                        onChange={(e) => setIsAttending(e.target.value)}
                        className="mr-2"
                      />
                      {t("yesAttending")}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="attending"
                        value="no"
                        checked={isAttending === "no"}
                        onChange={(e) => setIsAttending(e.target.value)}
                        className="mr-2"
                      />
                      {t("noAttending")}
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1)
                      setSearchResult(null)
                      setIsAttending("")
                    }}
                    className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    {t("back")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (isAttending === "yes") {
                        setStep(3)
                      } else if (isAttending === "no") {
                        setStep(5)
                      }
                    }}
                    className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                    disabled={!isAttending}
                  >
                    {t("continue")}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 for group guest count selection */}
        {step === 3 && searchResult?.type === "group" && searchResult.guests && (
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{t("howManyAttending")}</h2>
                <p className="text-muted-foreground">
                  {t("selectGuestCount")} (max {searchResult.guests.length})
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="guestCount" className="block text-sm font-medium mb-2">
                    {t("numberOfGuests")}
                  </label>
                  <select
                    id="guestCount"
                    value={attendingGuestCount}
                    onChange={(e) => setAttendingGuestCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                  >
                    <option value={0}>{t("selectNumber")}</option>
                    {Array.from({ length: searchResult.guests.length }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? t("guest") : t("guests")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(2)
                      setAttendingGuestCount(0)
                    }}
                    className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    {t("back")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (attendingGuestCount === searchResult.guests?.length) {
                        setStep(4)
                      } else {
                        setStep(5)
                      }
                    }}
                    className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                    disabled={attendingGuestCount === 0}
                  >
                    {t("continue")}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4 for quick submit option */}
        {step === 4 && searchResult?.type === "group" && (
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{t("confirmAttendance")}</h2>
                <p className="text-muted-foreground">
                  {attendingGuestCount} {attendingGuestCount === 1 ? t("guest") : t("guests")} {t("attending")}
                </p>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={async () => {
                    setIsLoading(true)
                    setError("")

                    try {
                      const requestBody = {
                        type: "group",
                        groupId: searchResult.group?._id,
                        isAttending: true,
                        events: ["wedding", "reception"],
                        dietaryRequirements: "",
                        questions: "",
                        attendingGuests: searchResult.guests?.map((g) => ({
                          name: g.name,
                          isChild: g.isChild,
                          ageGroup: g.ageGroup,
                        })),
                        originalGuests: searchResult.guests,
                        totalGroupSize: searchResult.guests?.length || 0,
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
                  }}
                  className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? t("submitting") : t("submitWithoutDetails")}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-md hover:bg-secondary/80 transition-colors"
                >
                  {t("enterGuestDetails")}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full bg-muted text-muted-foreground py-2 px-4 rounded-md hover:bg-muted/80 transition-colors text-sm"
                >
                  {t("back")}
                </button>
              </div>

              {error && <p className="text-destructive text-sm mt-4">{error}</p>}
            </CardContent>
          </Card>
        )}

        {((step === 2 && searchResult?.type === "individual") || (step === 5 && searchResult?.type === "group")) &&
          searchResult && (
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {t("welcomeGuest", {
                      name: searchResult.type === "group" ? searchResult.group?.name : searchResult.guest?.name,
                    })}
                  </h2>
                  {searchResult.type === "group" && attendingGuestCount > 0 && (
                    <p className="text-muted-foreground">
                      {attendingGuestCount} {attendingGuestCount === 1 ? "guest" : "guests"} attending
                    </p>
                  )}
                </div>

                <form onSubmit={handleRSVPSubmit} className="space-y-6">
                  {searchResult.type === "individual" && (
                    <div>
                      <label className="block text-sm font-medium mb-3">{t("willYouAttend")}</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="attending"
                            value="yes"
                            checked={isAttending === "yes"}
                            onChange={(e) => setIsAttending(e.target.value)}
                            className="mr-2"
                            required
                          />
                          {t("yesAttending")}
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="attending"
                            value="no"
                            checked={isAttending === "no"}
                            onChange={(e) => setIsAttending(e.target.value)}
                            className="mr-2"
                            required
                          />
                          {t("noAttending")}
                        </label>
                      </div>
                    </div>
                  )}

                  {isAttending === "yes" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-3">{t("whichEvents")}</label>
                        {error && <p className="text-destructive text-sm mb-2">{error}</p>}
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              value="wedding"
                              checked={events.includes("wedding")}
                              onChange={(e) => {
                                setError("")
                                if (e.target.checked) {
                                  setEvents([...events, "wedding"])
                                } else {
                                  setEvents(events.filter((event) => event !== "wedding"))
                                }
                              }}
                              className="mr-2"
                            />
                            {t("ceremonyEvent")}
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              value="reception"
                              checked={events.includes("reception")}
                              onChange={(e) => {
                                setError("")
                                if (e.target.checked) {
                                  setEvents([...events, "reception"])
                                } else {
                                  setEvents(events.filter((event) => event !== "reception"))
                                }
                              }}
                              className="mr-2"
                            />
                            {t("receptionEvent")}
                          </label>
                        </div>
                      </div>

                      {searchResult.type === "group" && searchResult.guests && searchResult.guests.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium mb-3">{t("groupMemberNames")}</label>
                          <p className="text-sm text-muted-foreground mb-3">{t("selectFromGroup")}</p>
                          <div className="space-y-3">
                            {Array.from({ length: attendingGuestCount }).map((_, index) => {
                              const tempId = `temp-${index}`
                              return (
                                <div key={tempId} className="bg-muted/30 border border-muted rounded-lg p-3 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground min-w-[60px]">
                                      Guest {index + 1}
                                    </span>
                                    <div className="flex-1 relative">
                                      <input
                                        type="text"
                                        value={guestNames[tempId] || ""}
                                        onChange={(e) => {
                                          setGuestNames({ ...guestNames, [tempId]: e.target.value })
                                          setShowSuggestions({ ...showSuggestions, [tempId]: true })
                                        }}
                                        onFocus={() => setShowSuggestions({ ...showSuggestions, [tempId]: true })}
                                        onBlur={() =>
                                          setTimeout(
                                            () => setShowSuggestions({ ...showSuggestions, [tempId]: false }),
                                            200,
                                          )
                                        }
                                        disabled={
                                          searchResult.guests && searchResult.guests[index]?.lockStatus === "locked"
                                        }
                                        className="w-full px-3 py-1.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder={t("memberNamePlaceholder", { number: index + 1 })}
                                        required
                                      />
                                      {showSuggestions[tempId] && searchResult.guests && (
                                        <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-40 overflow-y-auto">
                                          {searchResult.guests
                                            .filter((g) => g.name && g.name.trim())
                                            .map((guest, idx) => (
                                              <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                  setGuestNames({ ...guestNames, [tempId]: guest.name })
                                                  setShowSuggestions({ ...showSuggestions, [tempId]: false })
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                                              >
                                                {guest.name}
                                              </button>
                                            ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 pl-[68px]">
                                    <label className="flex items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={guestChildStatus[tempId] || false}
                                        onChange={(e) => {
                                          setGuestChildStatus({ ...guestChildStatus, [tempId]: e.target.checked })
                                          if (!e.target.checked) {
                                            const newAgeGroups = { ...guestAgeGroups }
                                            delete newAgeGroups[tempId]
                                            setGuestAgeGroups(newAgeGroups)
                                          }
                                        }}
                                        className="rounded"
                                      />
                                      <span className="text-muted-foreground">Child</span>
                                    </label>
                                    {guestChildStatus[tempId] && (
                                      <select
                                        value={guestAgeGroups[tempId] || ""}
                                        onChange={(e) => {
                                          setGuestAgeGroups({ ...guestAgeGroups, [tempId]: e.target.value })
                                        }}
                                        className="flex-1 px-2 py-1 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm"
                                        required
                                      >
                                        <option value="">Age group *</option>
                                        <option value="under-4">Under 4 years</option>
                                        <option value="4-12">4-12 years</option>
                                        <option value="over-12">Over 12 years</option>
                                      </select>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {searchResult.type === "individual" && searchResult.guest && (
                        <div className="space-y-4">
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

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (searchResult.type === "group") {
                          if (attendingGuestCount < (searchResult.guests?.length || 0)) {
                            setStep(3) // Go back to guest count selection
                          } else {
                            setStep(4) // Go back to quick submit option
                          }
                        } else {
                          setStep(1)
                          setSearchResult(null)
                        }
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
    </div>
  )
}
