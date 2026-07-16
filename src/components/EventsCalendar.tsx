"use client";

import { useMemo, useState, useEffect } from "react";

/**
 * Events list (paginated, "load more") + a month calendar below it.
 * Single-day events render as small colored chips on their date; multi-day
 * events render as a connected bar spanning their range with the title
 * inside it (bounded per week-row, earlier-starting ranges paint above
 * later ones). Clicking a calendar date filters the list to that day.
 */

export interface EventItem {
  id: string;
  /** single-day events set this */
  date?: string; // 'YYYY-MM-DD'
  /** multi-day events set these two instead of `date` */
  dateStart?: string;
  dateEnd?: string;
  time: string;
  title: string;
  location: string;
  description: string;
  price?: string;
  href: string;
}

const MONTHS = [
  "Siječanj",
  "Veljača",
  "Ožujak",
  "Travanj",
  "Svibanj",
  "Lipanj",
  "Srpanj",
  "Kolovoz",
  "Rujan",
  "Listopad",
  "Studeni",
  "Prosinac",
];
const WEEKDAYS = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];
const PAGE_SIZE = 3;

const pad = (n: number) => String(n).padStart(2, "0");

/** every 'YYYY-MM-DD' date an event covers (single day or a range) */
function datesOf(ev: EventItem): string[] {
  if (!ev.dateStart) return [ev.date as string];
  const out: string[] = [];
  const d = new Date(ev.dateStart + "T00:00:00");
  const end = new Date(ev.dateEnd + "T00:00:00");
  while (d <= end) {
    out.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
    d.setDate(d.getDate() + 1);
  }
  return out;
}

const startDateOf = (ev: EventItem) => ev.dateStart || (ev.date as string);

export interface EventsCalendarProps {
  events: EventItem[];
  initialYear?: number;
  initialMonth?: number; // 0-indexed
}

export default function EventsCalendar({
  events,
  initialYear,
  initialMonth,
}: EventsCalendarProps) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(initialYear ?? now.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialMonth ?? now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 760);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const eventsByDate = useMemo(() => {
    const map: Record<string, EventItem[]> = {};
    events.forEach((ev) => {
      datesOf(ev).forEach((d) => {
        (map[d] = map[d] || []).push(ev);
      });
    });
    return map;
  }, [events]);

  const changeMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  };

  const selectDate = (dateStr: string) => {
    setSelectedDate((cur) => (cur === dateStr ? null : dateStr));
    setVisibleCount(PAGE_SIZE);
  };

  const clearFilter = () => {
    setSelectedDate(null);
    setVisibleCount(PAGE_SIZE);
  };

  const scrollToCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("calendarSection");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 20;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // ---- list ----
  let filtered = events
    .slice()
    .sort((a, b) => startDateOf(a).localeCompare(startDateOf(b)));
  if (selectedDate)
    filtered = filtered.filter((ev) => datesOf(ev).includes(selectedDate));
  const visibleEvents = filtered.slice(0, visibleCount).map((ev) => {
    const startStr = startDateOf(ev);
    const [, m, d] = startStr.split("-").map(Number);
    const isMultiDay = !!ev.dateStart;
    let durationLabel = "";
    let endDay = "";
    let endMonthLabel = "";
    if (isMultiDay) {
      const days = datesOf(ev).length;
      durationLabel = `${days} dana`;
      const [, em, ed] = (ev.dateEnd as string).split("-").map(Number);
      endDay = pad(ed);
      endMonthLabel = MONTHS[em - 1].slice(0, 3);
    }
    return {
      ...ev,
      day: pad(d),
      monthLabel: MONTHS[m - 1].slice(0, 3),
      isMultiDay,
      durationLabel,
      endDay,
      endMonthLabel,
    };
  });
  const hasMore = filtered.length > visibleCount;
  const listTitle = selectedDate
    ? `Događanja — ${selectedDate.split("-").reverse().join(".")}.`
    : "Nadolazeća događanja";

  // ---- calendar ----
  const first = new Date(viewYear, viewMonth, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  // earlier-starting ranges must always paint (and label) above later-starting ones
  const rangeIdsByStart = events
    .filter((ev) => !!ev.dateStart)
    .slice()
    .sort((a, b) => (a.dateStart as string).localeCompare(b.dateStart as string))
    .map((ev) => ev.id);
  const zForRange = (id: string) => 50 - rangeIdsByStart.indexOf(id);

  const dayCells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1;
    const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
    const dateStr = inMonth
      ? `${viewYear}-${pad(viewMonth + 1)}-${pad(dayNum)}`
      : null;
    const matches = inMonth && dateStr ? eventsByDate[dateStr] || [] : [];
    const isSelected = inMonth && dateStr === selectedDate;
    const colIndex = i % 7;

    const rangeEvs = matches.filter((ev) => !!ev.dateStart);
    const singleEvs = matches.filter((ev) => !ev.dateStart);

    const ranges = rangeEvs.map((ev, idx) => {
      const days = datesOf(ev);
      const dayIdx = dateStr ? days.indexOf(dateStr) : -1;
      const isStart = dayIdx === 0;
      const isEnd = dayIdx === days.length - 1;
      const isRowStart = isStart || colIndex === 0;
      const accent = idx % 2 === 0 ? "var(--accent-clay)" : "var(--nav-bg)";
      const bottom = 8 + idx * 22;
      const daysLeftInRange = days.length - dayIdx;
      const daysLeftInRow = 7 - colIndex;
      const span = Math.max(1, Math.min(daysLeftInRange, daysLeftInRow));
      return {
        ev,
        isStart,
        isEnd,
        isRowStart,
        accent,
        bottom,
        span,
        z: zForRange(ev.id),
      };
    });

    const tooltip = matches.map((ev) => ev.title).join(", ");
    const topZ = ranges.length > 0 ? Math.max(...ranges.map((r) => r.z)) : 1;
    const chips = singleEvs.slice(0, 2).map((ev, idx) => ({
      ev,
      accent: idx % 2 === 0 ? "var(--accent-clay)" : "var(--nav-bg)",
    }));

    dayCells.push({
      dayNum,
      inMonth,
      dateStr,
      ranges,
      chips,
      tooltip,
      topZ,
      isSelected,
    });
  }

  const cardCols = isMobile ? "46px 1fr" : "64px 1fr auto";

  return (
    <div
      style={{
        fontFamily: "'Jost', system-ui, sans-serif",
        color: "var(--nav-dark-text)",
        background: "var(--nav-overlay-text)",
      }}
    >
      {/* ===================== EVENT LIST ===================== */}
      <section style={{ padding: "clamp(40px,5vw,64px) 0 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: 14,
            marginBottom: 26,
          }}
        >
          <h2
            style={{
              fontFamily: "'Marcellus', serif",
              fontWeight: 400,
              fontSize: "clamp(22px,2.6vw,30px)",
              margin: 0,
            }}
          >
            {listTitle}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {selectedDate && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  clearFilter();
                }}
                style={{
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--accent-clay)",
                }}
              >
                Prikaži sve ×
              </a>
            )}
            <a
              href="#"
              onClick={scrollToCalendar}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--nav-dark-text)",
                border: "1px solid #D5D2C4",
                padding: "10px 18px",
                borderRadius: 100,
              }}
            >
              Pogledaj kalendar ↓
            </a>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {visibleEvents.map((ev) => (
            <div
              key={ev.id}
              style={{
                display: "grid",
                gridTemplateColumns: cardCols,
                gap: "clamp(14px,2.4vw,28px)",
                alignItems: "center",
                padding: "clamp(20px,2.6vw,28px)",
                borderRadius: 14,
                border: "1px solid #D5D2C4",
                background: "#F3F1E9",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Marcellus', serif",
                    fontSize: 30,
                    lineHeight: 1,
                  }}
                >
                  {ev.day}
                </div>
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--nav-bg)",
                    marginTop: 6,
                  }}
                >
                  {ev.monthLabel}
                </div>
                {ev.isMultiDay && (
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      letterSpacing: "0.06em",
                      color: "#6B6458",
                      marginTop: 4,
                      whiteSpace: "nowrap",
                    }}
                  >
                    → {ev.endDay}
                    {ev.endMonthLabel !== ev.monthLabel
                      ? ` ${ev.endMonthLabel}`.toUpperCase()
                      : ""}
                  </div>
                )}
              </div>
              <div>
                <a
                  href={ev.href}
                  style={{
                    fontFamily: "'Marcellus', serif",
                    fontSize: "clamp(19px,2vw,23px)",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  {ev.title}
                </a>
                <div
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.6,
                    color: "#55605B",
                    marginTop: 6,
                    maxWidth: "52ch",
                  }}
                >
                  {ev.description}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 10,
                    marginTop: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.06em",
                      color: "#3B443F",
                      background: "#E7E3D4",
                      padding: "5px 12px",
                      borderRadius: 100,
                    }}
                  >
                    {ev.time}
                  </span>
                  {ev.location && (
                    <span
                      style={{
                        fontSize: 12,
                        letterSpacing: "0.06em",
                        color: "#3B443F",
                        background: "#E7E3D4",
                        padding: "5px 12px",
                        borderRadius: 100,
                      }}
                    >
                      {ev.location}
                    </span>
                  )}
                  {ev.isMultiDay && (
                    <span
                      style={{
                        fontSize: 12,
                        letterSpacing: "0.06em",
                        color: "var(--nav-dark-text)",
                        background: "var(--nav-highlight)",
                        padding: "5px 12px",
                        borderRadius: 100,
                      }}
                    >
                      {ev.durationLabel}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 12,
                }}
              >
                {ev.price && (
                  <span
                    style={{
                      fontFamily: "'Marcellus', serif",
                      fontSize: 20,
                      color: "var(--accent-clay)",
                    }}
                  >
                    {ev.price}
                  </span>
                )}
                <a
                  href={ev.href}
                  style={{
                    fontWeight: 500,
                    fontSize: 12,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    background: "var(--nav-highlight)",
                    color: "var(--nav-dark-text)",
                    padding: "12px 22px",
                    borderRadius: 100,
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                  }}
                >
                  Prijavi se
                </a>
              </div>
            </div>
          ))}

          {visibleEvents.length === 0 && (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                borderRadius: 14,
                border: "1px dashed #D5D2C4",
                color: "#6B6458",
                fontSize: 15,
              }}
            >
              Nema događanja na ovaj datum.
            </div>
          )}

          {hasMore && (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              style={{
                alignSelf: "center",
                marginTop: 10,
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--nav-dark-text)",
                background: "none",
                border: "1px solid #D5D2C4",
                padding: "13px 28px",
                borderRadius: 100,
                cursor: "pointer",
              }}
            >
              Učitaj više
            </button>
          )}
        </div>
      </section>

      {/* ===================== CALENDAR ===================== */}
      <section
        id="calendarSection"
        style={{
          padding: "clamp(60px,7vw,96px) 0 clamp(70px,8vw,110px)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <h2
            style={{
              fontFamily: "'Marcellus', serif",
              fontWeight: 400,
              fontSize: "clamp(24px,3vw,34px)",
              margin: 0,
            }}
          >
            {MONTHS[viewMonth]} {viewYear}
          </h2>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => changeMonth(-1)}
              aria-label="prethodni mjesec"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid #D5D2C4",
                background: "none",
                color: "var(--nav-dark-text)",
                fontSize: 17,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ←
            </button>
            <button
              onClick={() => changeMonth(1)}
              aria-label="sljedeći mjesec"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid #D5D2C4",
                background: "none",
                color: "var(--nav-dark-text)",
                fontSize: 17,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              →
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
            background: "#D5D2C4",
            border: "1px solid #D5D2C4",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              style={{
                background: "#E7E3D4",
                padding: "12px 0",
                textAlign: "center",
                fontWeight: 500,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#6B6458",
              }}
            >
              {wd}
            </div>
          ))}

          {dayCells.map((cell, i) => (
            <div
              key={i}
              onClick={() => cell.inMonth && cell.dateStr && selectDate(cell.dateStr)}
              title={cell.tooltip}
              style={{
                minHeight: isMobile ? 58 : 112,
                background: cell.isSelected ? "var(--nav-highlight)" : "#F8F6EF",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 5,
                padding: "8px 6px",
                cursor: cell.inMonth ? "pointer" : "default",
                opacity: cell.inMonth ? 1 : 0.35,
                transition: "background .2s ease",
                zIndex: cell.topZ,
              }}
            >
              {cell.ranges.map((r, ri) => (
                <span key={ri}>
                  <span
                    style={{
                      position: "absolute",
                      left: r.isStart ? 4 : 0,
                      right: r.isEnd ? 4 : 0,
                      bottom: r.bottom,
                      height: 18,
                      background: r.accent,
                      borderRadius: `${r.isStart ? 9 : 0}px ${r.isEnd ? 9 : 0}px ${r.isEnd ? 9 : 0}px ${r.isStart ? 9 : 0}px`,
                      display: "flex",
                      alignItems: "center",
                      zIndex: 3,
                    }}
                  />
                  {r.isRowStart && (
                    <span
                      style={{
                        position: "absolute",
                        left: 12,
                        bottom: r.bottom + 2,
                        width: `calc(${r.span} * 100% - 20px)`,
                        height: 14,
                        lineHeight: "14px",
                        fontSize: 9.5,
                        fontWeight: 500,
                        letterSpacing: "0.02em",
                        color: "#FFFFFF",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        pointerEvents: "none",
                        zIndex: 4,
                      }}
                    >
                      {r.ev.title}
                    </span>
                  )}
                </span>
              ))}

              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    (cell.ranges.length > 0 || cell.chips.length > 0) &&
                    !cell.isSelected
                      ? "#FFFFFF"
                      : "transparent",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    color: cell.isSelected
                      ? "var(--nav-dark-text)"
                      : "var(--nav-dark-text)",
                  }}
                >
                  {cell.inMonth ? cell.dayNum : ""}
                </span>
              </span>

              {cell.chips.length > 0 && (
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  {cell.chips.map((c, ci) => (
                    <span
                      key={ci}
                      style={{
                        maxWidth: "100%",
                        padding: "2px 8px",
                        borderRadius: 100,
                        background: c.accent,
                        color: "#FFFFFF",
                        fontSize: 9,
                        fontWeight: 500,
                        letterSpacing: "0.01em",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {c.ev.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
