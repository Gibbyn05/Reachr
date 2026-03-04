"use client";
import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Notification } from "@/lib/mock-data";
import {
  Bell,
  Phone,
  Calendar,
  Clock,
  Check,
  RotateCcw,
  X,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const typeIcons: Record<Notification["type"], typeof Bell> = {
  "follow-up": Phone,
  reminder: Clock,
  meeting: Calendar,
};

const typeColors: Record<Notification["type"], string> = {
  "follow-up": "bg-orange-50 text-orange-600",
  reminder: "bg-blue-50 text-blue-600",
  meeting: "bg-purple-50 text-purple-600",
};

const typeLabels: Record<Notification["type"], string> = {
  "follow-up": "Oppfølging",
  reminder: "Påminnelse",
  meeting: "Møte",
};

export default function VarslerPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "done">("active");

  const activeNotifications = notifications.filter((n) => !n.done);
  const doneNotifications = notifications.filter((n) => n.done);

  const markAsDone = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, done: true } : n))
    );
  };

  const markAsUndone = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, done: false } : n))
    );
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const snooze = (id: string) => {
    // In a real app, this would reschedule
    alert("Utsatt til i morgen");
  };

  const displayed = activeTab === "active" ? activeNotifications : doneNotifications;

  return (
    <div>
      <TopBar
        title="Varsler"
        subtitle={`${activeNotifications.length} aktive oppfølginger`}
      />

      <div className="p-8 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Venter på svar",
              count: activeNotifications.filter((n) => n.type === "follow-up").length,
              icon: Phone,
              color: "bg-orange-50",
              iconColor: "text-orange-600",
            },
            {
              label: "Påminnelser",
              count: activeNotifications.filter((n) => n.type === "reminder").length,
              icon: Clock,
              color: "bg-blue-50",
              iconColor: "text-blue-600",
            },
            {
              label: "Kommende møter",
              count: activeNotifications.filter((n) => n.type === "meeting").length,
              icon: Calendar,
              color: "bg-purple-50",
              iconColor: "text-purple-600",
            },
          ].map(({ label, count, icon: Icon, color, iconColor }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
            >
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#0F1729]">{count}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "active"
                ? "bg-white shadow-sm text-slate-900"
                : "text-gray-500 hover:text-slate-700"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Aktive ({activeNotifications.length})
          </button>
          <button
            onClick={() => setActiveTab("done")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "done"
                ? "bg-white shadow-sm text-slate-900"
                : "text-gray-500 hover:text-slate-700"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Fullførte ({doneNotifications.length})
          </button>
        </div>

        {/* Notifications list */}
        <div className="space-y-3">
          {displayed.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
              <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                {activeTab === "active" ? "Ingen aktive varsler" : "Ingen fullførte varsler"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === "active"
                  ? "Du er oppdatert! Kom tilbake når du har leads å følge opp."
                  : "Fullførte varsler vil vises her."}
              </p>
            </div>
          ) : (
            displayed.map((notif) => {
              const Icon = typeIcons[notif.type];
              return (
                <div
                  key={notif.id}
                  className={`bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 transition-all ${
                    notif.done ? "opacity-60" : "hover:shadow-md"
                  }`}
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                >
                  {/* Type icon */}
                  <div className={`w-10 h-10 ${typeColors[notif.type]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[notif.type]}`}>
                        {typeLabels[notif.type]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(notif.date).toLocaleDateString("nb-NO", {
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mb-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" />
                      {notif.company}
                    </p>
                  </div>

                  {/* Actions */}
                  {!notif.done ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => snooze(notif.id)}
                        className="text-gray-600"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Utsett
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => markAsDone(notif.id)}
                      >
                        <Check className="w-3.5 h-3.5" />
                        Ferdig
                      </Button>
                      <button
                        onClick={() => dismiss(notif.id)}
                        className="p-1.5 text-gray-300 hover:text-gray-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Fullført
                      </div>
                      <button
                        onClick={() => markAsUndone(notif.id)}
                        className="text-xs text-gray-400 hover:text-gray-600 underline"
                      >
                        Angre
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add reminder section */}
        {activeTab === "active" && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">Automatiske varsler</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Reachr sender automatisk varsler basert på aktivitet i CRM-en din.
                  Varsler genereres når det går mer enn 3 dager uten kontakt med et lead.
                </p>
                <Button variant="secondary" size="sm">
                  <Bell className="w-3.5 h-3.5" />
                  Konfigurer varslingsregler
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
