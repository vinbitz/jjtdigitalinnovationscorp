import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckCircle2,
  CalendarCheck,
  Building2,
  User,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { company } from "@/lib/catalog";
import { schedulingUrl } from "@/lib/scheduling";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface BookingModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTopic?: string;
}

const meetingTypes = [
  {
    id: "campaign-walkthrough",
    title: "30-Min Corporate Campaign Walkthrough",
    desc: "Explore items, discuss budget targets, and curate a custom campaign package.",
    duration: "30 mins",
  },
  {
    id: "samples-branding",
    title: "Catalog & Material Samples Consultation",
    desc: "Review apparel fabric brands (Gildan, Uniqlo, etc.), print methods, and drinkware finishes.",
    duration: "30 mins",
  },
  {
    id: "event-production",
    title: "Event Production & Booth Staging",
    desc: "Discuss stage design, LED video walls, photo booths, and on-site technical crew.",
    duration: "45 mins",
  },
];

const timeSlots = [
  "09:30 AM",
  "11:00 AM",
  "01:30 PM",
  "03:00 PM",
  "04:30 PM",
];

// Generate next 5 business days
function getAvailableDates() {
  const dates: { value: string; label: string; day: string }[] = [];
  let d = new Date();
  while (dates.length < 5) {
    d.setDate(d.getDate() + 1);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const isoStr = d.toISOString().split("T")[0] ?? "";
      dates.push({
        value: isoStr,
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }
  }
  return dates;
}

export function BookingModal({ trigger, open, onOpenChange, defaultTopic }: BookingModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const showModal = isControlled ? open : internalOpen;
  const setModalOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const availableDates = getAvailableDates();
  const [selectedType, setSelectedType] = useState(defaultTopic || (meetingTypes[0]?.id ?? ""));
  const [selectedDate, setSelectedDate] = useState(availableDates[0]?.value ?? "");
  const [selectedTime, setSelectedTime] = useState(timeSlots[1]);
  const [name, setName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !clientCompany || !email) {
      toast.error("Please fill in your name, company and email.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setConfirmed(true);
      toast.success("Meeting invitation confirmed! Check your inbox.");
    }, 600);
  }

  function handleReset() {
    setConfirmed(false);
    setName("");
    setClientCompany("");
    setEmail("");
    setPhone("");
    setNotes("");
  }

  const activeMeeting = (meetingTypes.find((m) => m.id === selectedType) ?? meetingTypes[0])!;

  return (
    <Dialog
      open={showModal}
      onOpenChange={(v) => {
        setModalOpen(v);
        if (!v) handleReset();
      }}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-2xl p-0 overflow-hidden border-border/80 shadow-2xl">
        {schedulingUrl ? (
          <div className="p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="font-display text-xl font-bold">
                Schedule a Consultation with JJT
              </DialogTitle>
              <DialogDescription>
                Select an available slot on our official corporate calendar.
              </DialogDescription>
            </DialogHeader>
            <iframe
              src={schedulingUrl}
              title="Schedule a meeting with JJT Digital Innovative"
              className="h-[600px] w-full rounded-sm border border-border"
            />
          </div>
        ) : confirmed ? (
          <div className="p-8 text-center bg-gradient-to-b from-background to-secondary/30">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-5 shadow-sm ring-8 ring-emerald-50">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-2">
              Confirmed on Corporate Calendar
            </Badge>

            <h3 className="font-display text-2xl font-extrabold text-foreground">
              You&apos;re Booked!
            </h3>

            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              We have reserved your slot with the JJT Digital Innovative strategy team. A calendar invitation has been sent to <strong className="text-foreground">{email}</strong>.
            </p>

            <div className="mt-6 max-w-md mx-auto p-4 bg-card rounded-lg border border-border text-left space-y-2 text-sm shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Topic</span>
                <span className="font-bold text-foreground">{activeMeeting.title}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Date & Time</span>
                <span className="font-medium text-brand">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at {selectedTime} (PHT)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Platform</span>
                <span className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                  <Video className="h-3.5 w-3.5 text-brand" /> Google Meet / Zoom link included
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold"
                onClick={() => {
                  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    `JJT Digital Innovative - ${activeMeeting.title}`
                  )}&dates=${selectedDate.replace(/-/g, "")}T013000Z/${selectedDate.replace(/-/g, "")}T020000Z&details=${encodeURIComponent(
                    `Consultation with JJT Digital Innovative Inc. Contact: ${company.email}`
                  )}&location=${encodeURIComponent("Google Meet")}`;
                  window.open(googleCalUrl, "_blank");
                }}
              >
                <CalendarCheck className="mr-1.5 h-4 w-4 text-brand" /> Add to Google Calendar
              </Button>
              <Button
                className="bg-brand text-brand-foreground hover:bg-brand/90 text-xs font-semibold"
                onClick={() => setModalOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-navy p-6 text-navy-foreground border-b border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src="/jjt-logo.png"
                  alt="JJT Logo"
                  className="h-9 w-9 object-contain rounded-full bg-white p-0.5 shadow-sm"
                />
                <div>
                  <h2 className="font-display text-xl font-extrabold text-white leading-tight">
                    Schedule a Consultation
                  </h2>
                  <p className="text-xs text-white/70">
                    Skip the back-and-forth email quote. Talk directly with our team.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Step 1: Select Consultation Topic */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                  1. Choose Consultation Focus
                </Label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {meetingTypes.map((m) => {
                    const active = selectedType === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedType(m.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          active
                            ? "border-brand bg-brand/5 ring-2 ring-brand/30 shadow-xs"
                            : "border-border hover:border-brand/40 bg-card"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-xs bg-muted text-muted-foreground">
                            {m.duration}
                          </span>
                          {active && <CheckCircle2 className="h-4 w-4 text-brand" />}
                        </div>
                        <p className="font-display text-xs font-bold text-foreground leading-snug">
                          {m.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Date & Time Picker */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                  2. Pick Date & Preferred Time (PHT)
                </Label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Dates */}
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-1.5 font-medium">Available Days</span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {availableDates.map((d) => {
                        const active = selectedDate === d.value;
                        return (
                          <button
                            key={d.value}
                            type="button"
                            onClick={() => setSelectedDate(d.value)}
                            className={`p-2 rounded-md border text-center transition-all ${
                              active
                                ? "bg-navy text-white border-navy font-bold shadow-xs"
                                : "border-border hover:bg-secondary text-foreground"
                            }`}
                          >
                            <span className="block text-[10px] opacity-75 uppercase">{d.day}</span>
                            <span className="block text-xs font-bold">{d.label.split(" ")[1]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Times */}
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-1.5 font-medium">Time Slot</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {timeSlots.map((t) => {
                        const active = selectedTime === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setSelectedTime(t)}
                            className={`px-2 py-2 rounded-md border text-xs text-center transition-all ${
                              active
                                ? "bg-brand text-brand-foreground border-brand font-bold shadow-xs"
                                : "border-border hover:bg-secondary text-foreground"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Client Details */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                  3. Your Contact Details
                </Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Input
                      placeholder="Your Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Company Name *"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                      required
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Work Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Mobile / WhatsApp"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      placeholder="Any specific products, quantities or event dates in mind? (Optional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-secondary/40 px-6 py-4 border-t border-border flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Meeting confirmed instantly via <span className="font-semibold text-foreground">Google Meet</span>
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting}
                  className="bg-brand text-brand-foreground hover:bg-brand/90 font-bold text-xs"
                >
                  {submitting ? "Booking..." : "Confirm Consultation"}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
