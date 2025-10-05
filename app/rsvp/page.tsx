"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { Users, User, AlertCircle, CheckCircle } from "lucide-react"

type Guest = {
  id: string
  guest_name?: string
  group_id?: string
  is_group_header: boolean
  group_name?: string
  is_tbc: boolean
  side?: "bride" | "groom"
  is_child: boolean
  child_age_category?: "3_or_below" | "4_to_12" | "above_12"
  rsvp_status: "pending" | "attending" | "not_attending"
  events: string[]
  dietary_requirements?: string
  questions_for_couple?: string
  notes?: string
  rsvp_submitted: boolean
}

type Group = {
  id: string
  group_name: string
  total_guests: number
  defined_guests: number
  tbc_guests: number
  rsvp_submitted: boolean
}

type RSVPFormData = {
  guest_name?: string
  side?: "bride" | "groom"
  is_child: boolean
  child_age_category?: "3_or_below" | "4_to_12" | "above_12"
  rsvp_status: "attending" | "not_attending"
  events: string[]
  dietary_requirements: string
  questions_for_couple: string
}

export default function RSVPPage() {
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [searchName, setSearchName] = useState("")
  const [matchedGuest, setMatchedGuest] = useState<Guest | null>(null)
  const [matchedGroup, setMatchedGroup] = useState<Group | null>(null)
  const [groupGuests, setGroupGuests] = useState<Guest[]>([])
  const [isGroupRSVP, setIsGroupRSVP] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Individual RSVP form data
  const [individualForm, setIndividualForm] = useState<RSVPFormData>({
    is_child: false,
    rsvp_status: "attending",
    events: [],
    dietary_requirements: "",
    questions_for_couple: "",
  })

  // Group RSVP form data
  const [groupForms, setGroupForms] = useState<RSVPFormData[]>([])

  const handleGuestSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/rsvp/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: searchName.trim() }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to search for guest")
        return
      }

      if (result.type === "individual") {
        // Individual guest found
        setMatchedGuest(result.guest)
        setIsGroupRSVP(false)
        setIndividualForm({
          guest_name: result.guest.guest_name,
          side: result.guest.side,
          is_child: result.guest.is_child,
          child_age_category: result.guest.child_age_category,
          rsvp_status: "attending",
          events: [],
          dietary_requirements: result.guest.dietary_requirements || "",
          questions_for_couple: result.guest.questions_for_couple || "",
        })
        setStep(2)
      } else if (result.type === "group") {
        // Group found
        setMatchedGroup(result.group)
        setGroupGuests(result.guests)
        setIsGroupRSVP(true)

        // Initialize group forms
        const forms = result.guests.map((guest: Guest) => ({
          guest_name: guest.is_tbc ? "" : guest.guest_name,
          side: guest.side,
          is_child: guest.is_child,
          child_age_category: guest.child_age_category,
          rsvp_status: "attending" as "attending" | "not_attending",
          events: [],
          dietary_requirements: guest.dietary_requirements || "",
          questions_for_couple: guest.questions_for_couple || "",
        }))
        setGroupForms(forms)
        setStep(2)
      }
    } catch (error) {
      console.error("Search error:", error)
      setError("An error occurred while searching. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (individualForm.rsvp_status === "attending" && individualForm.events.length === 0) {
      setError("Please select at least one event to attend.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "individual",
          guest_id: matchedGuest?.id,
          rsvp_data: individualForm,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to submit RSVP")
        return
      }

      setSuccess(true)
      setStep(3)
    } catch (error) {
      console.error("Submit error:", error)
      setError("An error occurred while submitting. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate that attending guests have selected events
    const attendingForms = groupForms.filter((form) => form.rsvp_status === "attending")
    const invalidForms = attendingForms.filter((form) => form.events.length === 0)

    if (invalidForms.length > 0) {
      setError("All attending guests must select at least one event.")
      return
    }

    // Check for duplicate names
    const filledNames = groupForms
      .map((form) => form.guest_name?.trim().toLowerCase())
      .filter((name) => name && name.length > 0)

    const uniqueNames = new Set(filledNames)
    if (filledNames.length !== uniqueNames.size) {
      setError("Multiple guests cannot have the same name. Please ensure all names are unique.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "group",
          group_id: matchedGroup?.id,
          guest_ids: groupGuests.map((g) => g.id),
          rsvp_data: groupForms,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to submit RSVP")
        return
      }

      setSuccess(true)
      setStep(3)
    } catch (error) {
      console.error("Submit error:", error)
      setError("An error occurred while submitting. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateGroupForm = (index: number, field: keyof RSVPFormData, value: any) => {
    const newForms = [...groupForms]
    newForms[index] = { ...newForms[index], [field]: value }
    setGroupForms(newForms)
  }

  if (success) {
    return (
      <div className="min-h-screen floral-background py-12 px-4 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-4">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              Your RSVP has been submitted successfully. We look forward to celebrating with you!
            </p>
            <Button onClick={() => (window.location.href = "/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen floral-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">RSVP</h1>
          <p className="text-lg text-muted-foreground">Please let us know if you can join us for our special day</p>
        </div>

        {step === 1 && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Find Your Invitation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGuestSearch} className="space-y-4">
                <div>
                  <Label htmlFor="searchName">Enter your name or group name</Label>
                  <Input
                    id="searchName"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="e.g., John Smith or Smith Family"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your name exactly as it appears on your invitation
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Searching..." : "Find My Invitation"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && !isGroupRSVP && matchedGuest && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Welcome, {matchedGuest.guest_name}!
              </CardTitle>
              <div className="flex gap-2">
                {matchedGuest.side && (
                  <Badge variant={matchedGuest.side === "bride" ? "default" : "secondary"}>
                    {matchedGuest.side} side
                  </Badge>
                )}
                {matchedGuest.is_child && <Badge variant="outline">Child</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleIndividualSubmit} className="space-y-6">
                {matchedGuest.is_child && (
                  <div>
                    <Label>Age Category</Label>
                    <Select
                      value={individualForm.child_age_category || ""}
                      onValueChange={(value: "3_or_below" | "4_to_12" | "above_12") =>
                        setIndividualForm((prev) => ({ ...prev, child_age_category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3_or_below">3 or below</SelectItem>
                        <SelectItem value="4_to_12">4 to 12</SelectItem>
                        <SelectItem value="above_12">Above 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label>Will you be attending?</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="attending"
                        name="rsvp_status"
                        value="attending"
                        checked={individualForm.rsvp_status === "attending"}
                        onChange={(e) =>
                          setIndividualForm((prev) => ({
                            ...prev,
                            rsvp_status: e.target.value as "attending" | "not_attending",
                          }))
                        }
                      />
                      <Label htmlFor="attending">Yes, I will be attending</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="not_attending"
                        name="rsvp_status"
                        value="not_attending"
                        checked={individualForm.rsvp_status === "not_attending"}
                        onChange={(e) =>
                          setIndividualForm((prev) => ({
                            ...prev,
                            rsvp_status: e.target.value as "attending" | "not_attending",
                          }))
                        }
                      />
                      <Label htmlFor="not_attending">Sorry, I cannot attend</Label>
                    </div>
                  </div>
                </div>

                {individualForm.rsvp_status === "attending" && (
                  <>
                    <div>
                      <Label>Which events will you attend?</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="wedding"
                            checked={individualForm.events.includes("wedding")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setIndividualForm((prev) => ({
                                  ...prev,
                                  events: [...prev.events, "wedding"],
                                }))
                              } else {
                                setIndividualForm((prev) => ({
                                  ...prev,
                                  events: prev.events.filter((e) => e !== "wedding"),
                                }))
                              }
                            }}
                          />
                          <Label htmlFor="wedding">Wedding Ceremony</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="reception"
                            checked={individualForm.events.includes("reception")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setIndividualForm((prev) => ({
                                  ...prev,
                                  events: [...prev.events, "reception"],
                                }))
                              } else {
                                setIndividualForm((prev) => ({
                                  ...prev,
                                  events: prev.events.filter((e) => e !== "reception"),
                                }))
                              }
                            }}
                          />
                          <Label htmlFor="reception">Reception</Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="dietary">Dietary Requirements</Label>
                      <Textarea
                        id="dietary"
                        value={individualForm.dietary_requirements}
                        onChange={(e) =>
                          setIndividualForm((prev) => ({
                            ...prev,
                            dietary_requirements: e.target.value,
                          }))
                        }
                        placeholder="Please let us know about any dietary restrictions or allergies"
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="questions">Questions for the Couple</Label>
                  <Textarea
                    id="questions"
                    value={individualForm.questions_for_couple}
                    onChange={(e) =>
                      setIndividualForm((prev) => ({
                        ...prev,
                        questions_for_couple: e.target.value,
                      }))
                    }
                    placeholder="Any questions or special messages for us?"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Submitting..." : "Submit RSVP"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && isGroupRSVP && matchedGroup && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {matchedGroup.group_name} - Group RSVP
              </CardTitle>
              <p className="text-muted-foreground">
                Please fill out the details for each member of your group. You can leave guest names empty if they are
                no longer attending.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGroupSubmit} className="space-y-8">
                {groupGuests.map((guest, index) => (
                  <Card key={guest.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="font-semibold">Guest {index + 1}</h3>
                        {guest.is_tbc && <Badge variant="secondary">TBC</Badge>}
                      </div>

                      <div>
                        <Label htmlFor={`name_${index}`}>Guest Name</Label>
                        <Input
                          id={`name_${index}`}
                          value={groupForms[index]?.guest_name || ""}
                          onChange={(e) => updateGroupForm(index, "guest_name", e.target.value)}
                          placeholder={guest.is_tbc ? "Enter guest name (optional)" : "Guest name"}
                        />
                      </div>

                      {groupForms[index]?.guest_name && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Side</Label>
                              <Select
                                value={groupForms[index]?.side || ""}
                                onValueChange={(value: "bride" | "groom") => updateGroupForm(index, "side", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select side" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bride">Bride</SelectItem>
                                  <SelectItem value="groom">Groom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>RSVP Status</Label>
                              <Select
                                value={groupForms[index]?.rsvp_status || "attending"}
                                onValueChange={(value: "attending" | "not_attending") =>
                                  updateGroupForm(index, "rsvp_status", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="attending">Attending</SelectItem>
                                  <SelectItem value="not_attending">Not Attending</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`child_${index}`}
                              checked={groupForms[index]?.is_child || false}
                              onCheckedChange={(checked) => updateGroupForm(index, "is_child", !!checked)}
                            />
                            <Label htmlFor={`child_${index}`}>This guest is a child</Label>
                          </div>

                          {groupForms[index]?.is_child && (
                            <div>
                              <Label>Age Category</Label>
                              <Select
                                value={groupForms[index]?.child_age_category || ""}
                                onValueChange={(value: "3_or_below" | "4_to_12" | "above_12") =>
                                  updateGroupForm(index, "child_age_category", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select age category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="3_or_below">3 or below</SelectItem>
                                  <SelectItem value="4_to_12">4 to 12</SelectItem>
                                  <SelectItem value="above_12">Above 12</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {groupForms[index]?.rsvp_status === "attending" && (
                            <>
                              <div>
                                <Label>Events Attending</Label>
                                <div className="space-y-2 mt-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`wedding_${index}`}
                                      checked={groupForms[index]?.events.includes("wedding") || false}
                                      onCheckedChange={(checked) => {
                                        const currentEvents = groupForms[index]?.events || []
                                        if (checked) {
                                          updateGroupForm(index, "events", [...currentEvents, "wedding"])
                                        } else {
                                          updateGroupForm(
                                            index,
                                            "events",
                                            currentEvents.filter((e) => e !== "wedding"),
                                          )
                                        }
                                      }}
                                    />
                                    <Label htmlFor={`wedding_${index}`}>Wedding Ceremony</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`reception_${index}`}
                                      checked={groupForms[index]?.events.includes("reception") || false}
                                      onCheckedChange={(checked) => {
                                        const currentEvents = groupForms[index]?.events || []
                                        if (checked) {
                                          updateGroupForm(index, "events", [...currentEvents, "reception"])
                                        } else {
                                          updateGroupForm(
                                            index,
                                            "events",
                                            currentEvents.filter((e) => e !== "reception"),
                                          )
                                        }
                                      }}
                                    />
                                    <Label htmlFor={`reception_${index}`}>Reception</Label>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor={`dietary_${index}`}>Dietary Requirements</Label>
                                <Textarea
                                  id={`dietary_${index}`}
                                  value={groupForms[index]?.dietary_requirements || ""}
                                  onChange={(e) => updateGroupForm(index, "dietary_requirements", e.target.value)}
                                  placeholder="Any dietary restrictions or allergies"
                                />
                              </div>
                            </>
                          )}

                          <div>
                            <Label htmlFor={`questions_${index}`}>Questions for the Couple</Label>
                            <Textarea
                              id={`questions_${index}`}
                              value={groupForms[index]?.questions_for_couple || ""}
                              onChange={(e) => updateGroupForm(index, "questions_for_couple", e.target.value)}
                              placeholder="Any questions or special messages"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                ))}

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Group RSVP"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
