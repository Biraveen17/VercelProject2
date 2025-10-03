"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

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
  const [isAttending, setIsAttending] = useState<string>("")
  const [events, setEvents] = useState<string[]>([])
  const [dietaryRequirements, setDietaryRequirements] = useState("")
  const [questions, setQuestions] = useState("")
  const [guestNames, setGuestNames] = useState<{ [key: string]: string }>({})
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
      } else if (data.type === "group" && data.guests) {
        const initialNames: { [key: string]: string } = {}
        data.guests.forEach((guest: Guest) => {
          initialNames[guest._id] = guest.guestType === "tbc" ? "" : guest.name
        })
        setGuestNames(initialNames)

        const firstGuest = data.guests[0]
        if (firstGuest) {
          setIsAttending(
            firstGuest.rsvpStatus === "attending" ? "yes" : firstGuest.rsvpStatus === "not-attending" ? "no" : "",
          )
          setEvents(firstGuest.events || [])
          setDietaryRequirements(firstGuest.dietaryRequirements || "")
          setQuestions(firstGuest.questions || "")
        }
      }

      setStep(2)
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
      const totalGuests = searchResult.guests.length
      const namedGuests = searchResult.guests.filter((g) => {
        const name = guestNames[g._id]
        return name && name.trim() !== ""
      }).length

      if (namedGuests < totalGuests) {
        setError(
          `This group contains ${totalGuests} guest${totalGuests > 1 ? "s" : ""} but you have only provided ${namedGuests} name${namedGuests !== 1 ? "s" : ""}. Please enter all guest names or contact us if you need assistance.`,
        )
        return
      }
    }

    setIsLoading(true)

    try {
      let requestBody: any

      if (searchResult?.type === "group") {
        const guests = searchResult.guests?.map((guest) => ({
          _id: guest._id,
          name: guestNames[guest._id] || guest.name,
          guestType: guest.guestType,
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
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">{t("rsvpTitle")}</h1>
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

        {step === 2 && searchResult && (
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  {t("welcomeGuest", {
                    name: searchResult.type === "group" ? searchResult.group?.name : searchResult.guest?.name,
                  })}
                </h2>
                {searchResult.type === "group" && searchResult.guests && (
                  <p className="text-muted-foreground">{t("groupBooking", { size: searchResult.guests.length })}</p>
                )}
              </div>

              <form onSubmit={handleRSVPSubmit} className="space-y-6">
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
                        <div className="space-y-2">
                          {searchResult.guests.map((guest, index) => (
                            <div key={guest._id}>
                              <input
                                type="text"
                                value={guestNames[guest._id] || ""}
                                onChange={(e) => {
                                  setGuestNames({ ...guestNames, [guest._id]: e.target.value })
                                }}
                                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                                placeholder={
                                  guest.guestType === "tbc"
                                    ? t("memberNamePlaceholder", { number: index + 1 })
                                    : guest.name
                                }
                                readOnly={guest.guestType === "defined"}
                              />
                              {guest.guestType === "tbc" && (
                                <p className="text-xs text-muted-foreground mt-1">Please enter the guest name</p>
                              )}
                            </div>
                          ))}
                        </div>
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
                      setStep(1)
                      setSearchResult(null)
                      setIsAttending("")
                      setEvents([])
                      setDietaryRequirements("")
                      setQuestions("")
                      setGuestNames({})
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
