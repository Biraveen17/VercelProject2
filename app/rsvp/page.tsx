"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { submitIndividualRSVP, submitGroupRSVP, getGuests, type Guest } from "@/lib/database"
import { useLanguage } from "@/lib/language-context"

export default function RSVPPage() {
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [guestName, setGuestName] = useState("")
  const [foundGuest, setFoundGuest] = useState<Guest | null>(null)
  const [isAttending, setIsAttending] = useState<string>("")
  const [events, setEvents] = useState<string[]>([])
  const [dietaryRequirements, setDietaryRequirements] = useState("")
  const [questions, setQuestions] = useState("")
  const [groupMembers, setGroupMembers] = useState<string[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleGuestSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const allGuests = getGuests()
    const normalizedName = guestName.toLowerCase().trim()

    const groupByName = allGuests.find(
      (g: Guest) => g.type === "group" && g.groupName?.toLowerCase().trim() === normalizedName,
    )

    if (groupByName) {
      // Found group by name - show group RSVP form
      if (groupByName.rsvpStatus && groupByName.rsvpStatus !== "pending") {
        setError("Your group has already submitted an RSVP. If you need to make changes, please contact us directly.")
        return
      }
      setFoundGuest(groupByName)
      const maxSize = groupByName.maxGroupSize || 1
      const existingMembers = groupByName.groupMembers || []
      const initialMembers = Array(maxSize)
        .fill("")
        .map((_, index) => existingMembers[index] || "")
      setGroupMembers(initialMembers)
      setStep(2)
      return
    }

    const groupWithMember = allGuests.find(
      (g: Guest) =>
        g.type === "group" &&
        g.groupMembers &&
        g.groupMembers.some((member: string) => member.toLowerCase().trim() === normalizedName),
    )

    if (groupWithMember) {
      // Found as group member - show group RSVP form
      if (groupWithMember.rsvpStatus && groupWithMember.rsvpStatus !== "pending") {
        setError("Your group has already submitted an RSVP. If you need to make changes, please contact us directly.")
        return
      }
      setFoundGuest(groupWithMember)
      const maxSize = groupWithMember.maxGroupSize || 1
      const existingMembers = groupWithMember.groupMembers || []
      const initialMembers = Array(maxSize)
        .fill("")
        .map((_, index) => existingMembers[index] || "")
      setGroupMembers(initialMembers)
      setStep(2)
      return
    }

    const individualGuest = allGuests.find(
      (g: Guest) => g.type === "individual" && !g.groupName && g.guestName?.toLowerCase().trim() === normalizedName,
    )

    if (individualGuest) {
      // Found individual guest - show individual RSVP form
      if (individualGuest.rsvpStatus && individualGuest.rsvpStatus !== "pending") {
        setError("You have already submitted your RSVP. If you need to make changes, please contact us directly.")
        return
      }
      setFoundGuest(individualGuest)
      setStep(2)
      return
    }

    // No match found
    setError("Guest name not found. Please check the spelling or contact us for assistance.")
  }

  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!foundGuest) return

    if (isAttending === "yes" && events.length === 0) {
      setError("Please select at least one event (wedding ceremony or reception) to attend.")
      return
    }

    if (foundGuest.type === "group" && groupMembers.length > 0) {
      submitGroupRSVP(foundGuest, {
        isAttending: isAttending === "yes",
        events: isAttending === "yes" ? (events as ("ceremony" | "reception")[]) : [],
        dietaryRequirements: isAttending === "yes" ? dietaryRequirements : "",
        questions: questions,
        groupMembers: groupMembers,
      })
    } else {
      submitIndividualRSVP(foundGuest, {
        isAttending: isAttending === "yes",
        events: isAttending === "yes" ? (events as ("ceremony" | "reception")[]) : [],
        dietaryRequirements: isAttending === "yes" ? dietaryRequirements : "",
        questions: questions,
      })
    }

    setSuccess(true)
    setStep(3)
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
                  />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  {t("findGuest")}
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && foundGuest && (
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  {t("welcomeGuest", { name: foundGuest.guestName || foundGuest.groupName })}
                </h2>
                {foundGuest.type === "group" && (
                  <p className="text-muted-foreground">{t("groupBooking", { size: foundGuest.maxGroupSize })}</p>
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
                            value="ceremony"
                            checked={events.includes("ceremony")}
                            onChange={(e) => {
                              setError("") // Clear error when user makes selection
                              if (e.target.checked) {
                                setEvents([...events, "ceremony"])
                              } else {
                                setEvents(events.filter((event) => event !== "ceremony"))
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
                              setError("") // Clear error when user makes selection
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

                    {foundGuest.type === "group" && groupMembers.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-3">{t("groupMemberNames")}</label>
                        {(() => {
                          const filledMembers = groupMembers.filter((member) => member.trim() !== "")
                          const maxSize = foundGuest.maxGroupSize || groupMembers.length
                          if (filledMembers.length < maxSize && filledMembers.length > 0) {
                            const missingCount = maxSize - filledMembers.length
                            return (
                              <p className="text-amber-600 text-sm mb-2 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                                Note: You have {maxSize} group size but are submitting {filledMembers.length} guests.
                                The couple will understand your group size has reduced by {missingCount}.
                              </p>
                            )
                          }
                          return null
                        })()}
                        <div className="space-y-2">
                          {groupMembers.map((member, index) => (
                            <input
                              key={index}
                              type="text"
                              value={member}
                              onChange={(e) => {
                                setError("") // Clear error when user makes changes
                                const newMembers = [...groupMembers]
                                newMembers[index] = e.target.value
                                setGroupMembers(newMembers)
                              }}
                              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                              placeholder={t("memberNamePlaceholder", { number: index + 1 })}
                            />
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
                    onClick={() => setStep(1)}
                    className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    {t("back")}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {t("submitRSVP")}
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
