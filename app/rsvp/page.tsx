"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { PageTracker } from "@/components/page-tracker"

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
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
          initialNames[guest._id] = guest.guestType === "tbc" ? "" : guest.name
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

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAttending === "yes") {
      // If attending, go to guest count selection
      setStep(3)
    } else {
      // If not attending, skip to final form
      setStep(4)
    }
  }

  const handleGuestCountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (attendingGuestCount < 1 || attendingGuestCount > (searchResult?.guests?.length || 0)) {
      setError(`Please select a number between 1 and ${searchResult?.guests?.length}`)
      return
    }
    setError("")
    setStep(4)
  }

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isAttending === "yes" && events.length === 0) {
      setError("Please select at least one event (wedding or reception) to attend.")
      return
    }

    if (searchResult?.type === "group" && searchResult.guests) {
      for (const guest of searchResult.guests) {
        if (guestChildStatus[guest._id] && !guestAgeGroups[guest._id]) {
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
      const totalGuests = searchResult.guests.length
      const guestsWithEmptyNames = searchResult.guests.filter((g) => {
        const name = guestNames[g._id]
        return !name || name.trim() === ""
      })

      if (guestsWithEmptyNames.length > 0) {
        const confirmMessage = `${guestsWithEmptyNames.length} guest${guestsWithEmptyNames.length !== 1 ? "s" : ""} with empty names will be permanently deleted from your group. Do you want to continue?`

        if (!window.confirm(confirmMessage)) {
          return
        }
      }
    }

    setIsLoading(true)

    try {
      let requestBody: any

      if (searchResult?.type === "group") {
        const guests = searchResult.guests?.map((guest) => ({
          _id: guest._id,
          name: guestNames[guest._id] || "",
          guestType: guest.guestType,
          isChild: guestChildStatus[guest._id] || false,
          ageGroup: guestChildStatus[guest._id] && guestAgeGroups[guest._id] ? guestAgeGroups[guest._id] : undefined,
        }))

        requestBody = {
          type: "group",
          groupId: searchResult.group?._id,
          isAttending: isAttending === "yes",
          events: isAttending === "yes" ? events : [],
          dietaryRequirements: isAttending === "yes" ? dietaryRequirements : "",
          questions: questions,
          guests: guests,
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
      setStep(3)
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
                    {t("enterName")}
                  </label>
                  <input
                    type="text"
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    placeholder={t("namePlaceholder")}
                    required
                    disabled={isLoading}
                  />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : t("findGuest")}
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && searchResult?.type === "group" && searchResult.guests && (
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  {t("welcomeGuest", {
                    name: searchResult.group?.name,
                  })}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {t("groupTotalGuests", { size: searchResult.guests.length })}
                </p>
              </div>

              <form onSubmit={handleAttendanceSubmit} className="space-y-6">
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

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1)
                      setSearchResult(null)
                      setIsAttending("")
                      setError("")
                    }}
                    className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    {t("back")}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {t("continue")}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 3 && searchResult?.type === "group" && searchResult.guests && isAttending === "yes" && (
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  {t("welcomeGuest", {
                    name: searchResult.group?.name,
                  })}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {t("groupTotalGuests", { size: searchResult.guests.length })}
                </p>
              </div>

              <form onSubmit={handleGuestCountSubmit} className="space-y-6">
                <div>
                  <label htmlFor="guestCount" className="block text-sm font-medium mb-3">
                    {t("howManyAttending")}
                  </label>
                  <select
                    id="guestCount"
                    value={attendingGuestCount}
                    onChange={(e) => {
                      setAttendingGuestCount(Number(e.target.value))
                      setError("")
                    }}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    required
                  >
                    <option value="0">{t("guestCountPlaceholder")}</option>
                    {Array.from({ length: searchResult.guests.length }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </div>

                {error && <p className="text-destructive text-sm">{error}</p>}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(2)
                      setAttendingGuestCount(0)
                      setError("")
                    }}
                    className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    {t("back")}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                    disabled={attendingGuestCount === 0}
                  >
                    {t("continueToDetails")}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {((step === 2 && searchResult?.type === "individual") || (step === 4 && searchResult?.type === "group")) &&
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
                          <div className="space-y-3">
                            {searchResult.guests.slice(0, attendingGuestCount).map((guest, index) => (
                              <div key={guest._id} className="bg-muted/30 border border-muted rounded-lg p-3 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-muted-foreground min-w-[60px]">
                                    Guest {index + 1}
                                  </span>
                                  <input
                                    type="text"
                                    value={guestNames[guest._id] || ""}
                                    onChange={(e) => {
                                      setGuestNames({ ...guestNames, [guest._id]: e.target.value })
                                    }}
                                    className="flex-1 px-3 py-1.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm"
                                    placeholder={
                                      guest.guestType === "tbc"
                                        ? t("memberNamePlaceholder", { number: index + 1 })
                                        : guest.name
                                    }
                                  />
                                </div>
                                <div className="flex items-center gap-4 pl-[68px]">
                                  <label className="flex items-center gap-2 text-sm">
                                    <input
                                      type="checkbox"
                                      checked={guestChildStatus[guest._id] || false}
                                      onChange={(e) => {
                                        setGuestChildStatus({ ...guestChildStatus, [guest._id]: e.target.checked })
                                        if (!e.target.checked) {
                                          const newAgeGroups = { ...guestAgeGroups }
                                          delete newAgeGroups[guest._id]
                                          setGuestAgeGroups(newAgeGroups)
                                        }
                                      }}
                                      className="rounded"
                                    />
                                    <span className="text-muted-foreground">Child</span>
                                  </label>
                                  {guestChildStatus[guest._id] && (
                                    <select
                                      value={guestAgeGroups[guest._id] || ""}
                                      onChange={(e) => {
                                        setGuestAgeGroups({ ...guestAgeGroups, [guest._id]: e.target.value })
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
                            ))}
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
                                  [searchResult.guest!._id]: e.target.checked,
                                })
                                if (!e.target.checked) {
                                  const newAgeGroups = { ...guestAgeGroups }
                                  delete newAgeGroups[searchResult.guest!._id]
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
                                    [searchResult.guest!._id]: e.target.value,
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
                          setStep(isAttending === "yes" ? 3 : 2)
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
