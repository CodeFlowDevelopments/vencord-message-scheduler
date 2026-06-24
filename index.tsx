/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addChatBarButton, ChatBarButton, ChatBarButtonFactory, removeChatBarButton } from "@api/ChatButtons";
import { definePluginSettings } from "@api/Settings";
import { sendMessage } from "@utils/discord";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Forms, Modal, openModal, SelectedChannelStore, Toasts, useState } from "@webpack/common";
import { RenderModalProps } from "@vencord/discord-types";

const GuildChannelStore = findByPropsLazy("getChannels", "getSortedChannelIds");
const GuildStore = findByPropsLazy("getGuild", "getGuilds");
const SelectedGuildStore = findByPropsLazy("getGuildId", "getLastSelectedGuildId");

interface ScheduledMessage {
    id: string;
    channelId: string;
    content: string;
    sendAt: number;
    repeat: boolean;
    repeatMs: number;
    repeatCount: number;
    repeatDone: number;
    isRandom: boolean;
    randomPool: string[];
    notified?: boolean;
}

// globalThis عشان ما يتكرر عند reload
(globalThis as any).__msgScheduled ??= [];
(globalThis as any).__msgInterval ??= null;
(globalThis as any).__msgSaved ??= [];
const scheduled: ScheduledMessage[] = (globalThis as any).__msgScheduled;
const savedMessages: string[] = (globalThis as any).__msgSaved;

function startInterval() {
    if ((globalThis as any).__msgInterval) {
        clearInterval((globalThis as any).__msgInterval);
        (globalThis as any).__msgInterval = null;
    }
    (globalThis as any).__msgInterval = setInterval(() => {
        const now = Date.now();
        for (let i = scheduled.length - 1; i >= 0; i--) {
            const msg = scheduled[i];
            if (!msg.notified && msg.sendAt - now <= 60_000 && msg.sendAt - now > 0) {
                msg.notified = true;
                Toasts.show({ message: `Sending "${msg.content.slice(0, 30)}..." in 1 minute`, type: Toasts.Type.MESSAGE, id: Toasts.genId() });
            }
            if (now >= msg.sendAt) {
                try {
                    const content = msg.isRandom && msg.randomPool.length > 0
                        ? msg.randomPool[Math.floor(Math.random() * msg.randomPool.length)]
                        : msg.content;
                    sendMessage(msg.channelId, { content });
                    Toasts.show({ message: "Message sent!", type: Toasts.Type.SUCCESS, id: Toasts.genId() });
                } catch (e) { console.error("[MessageScheduler]", e); }

                if (msg.repeat && (msg.repeatCount === 0 || msg.repeatDone + 1 < msg.repeatCount)) {
                    msg.sendAt = Date.now() + msg.repeatMs;
                    msg.notified = false;
                    msg.repeatDone++;
                } else {
                    scheduled.splice(i, 1);
                }
            }
        }
    }, 3000);
}

function stopInterval() {
    if ((globalThis as any).__msgInterval) {
        clearInterval((globalThis as any).__msgInterval);
        (globalThis as any).__msgInterval = null;
    }
}

const settings = definePluginSettings({
    language: {
        type: OptionType.SELECT,
        description: "Plugin language",
        options: [
            { label: "English", value: "en", default: true },
            { label: "العربية", value: "ar" },
        ],
    },
});

const PRESETS = (ar: boolean) => [
    { label: ar ? "5ث"    : "5s",     ms: 5_000 },
    { label: ar ? "30ث"   : "30s",    ms: 30_000 },
    { label: ar ? "5د"    : "5m",     ms: 5 * 60_000 },
    { label: ar ? "10د"   : "10m",    ms: 10 * 60_000 },
    { label: ar ? "30د"   : "30m",    ms: 30 * 60_000 },
    { label: ar ? "1س"    : "1h",     ms: 60 * 60_000 },
    { label: ar ? "2س"    : "2h",     ms: 2 * 60 * 60_000 },
    { label: ar ? "1ي"    : "1d",     ms: 24 * 60 * 60_000 },
    { label: ar ? "1أ"    : "1w",     ms: 7 * 24 * 60 * 60_000 },
    { label: ar ? "1ش"    : "1mo",    ms: 30 * 24 * 60 * 60_000 },
    { label: ar ? "تاريخ" : "Date",   ms: -2 },
    { label: ar ? "مخصص"  : "Custom", ms: -1 },
];

const UNITS = (ar: boolean) => [
    { label: ar ? "ثواني" : "Seconds", value: "seconds" as const },
    { label: ar ? "دقائق" : "Minutes", value: "minutes" as const },
    { label: ar ? "ساعات" : "Hours",   value: "hours"   as const },
    { label: ar ? "أيام"  : "Days",    value: "days"    as const },
    { label: ar ? "شهور"  : "Months",  value: "months"  as const },
];

function ConfirmModal(props: RenderModalProps & { message: string; onConfirm: () => void; }) {
    const { onClose, onConfirm, message } = props;
    const ar = settings.store.language === "ar";
    return (
        <Modal {...props} title={ar ? "تأكيد" : "Confirm"}
            actions={[
                { text: ar ? "إلغاء" : "Cancel", variant: "secondary", onClick: onClose },
                { text: ar ? "نعم، احذف" : "Yes, remove", variant: "destructive", onClick: () => { onConfirm(); onClose(); } },
            ]}>
            <div style={{ padding: "8px 0", fontSize: "14px", color: "var(--text-normal)" }}>{message}</div>
        </Modal>
    );
}

function EditModal(props: RenderModalProps & { msg: ScheduledMessage; onSave: (content: string) => void; }) {
    const { onClose, onSave, msg } = props;
    const ar = settings.store.language === "ar";
    const [val, setVal] = useState(msg.content);
    return (
        <Modal {...props} title={ar ? "تعديل الرسالة" : "Edit Message"}
            actions={[
                { text: ar ? "إلغاء" : "Cancel", variant: "secondary", onClick: onClose },
                { text: ar ? "حفظ" : "Save", variant: "primary", onClick: () => { onSave(val); onClose(); } },
            ]}>
            <div style={{ padding: "8px 0" }}>
                <textarea value={val} onChange={e => setVal(e.currentTarget.value)} rows={4}
                    style={{ width: "100%", background: "var(--background-tertiary)", color: "var(--text-normal)", border: "1px solid var(--background-modifier-accent)", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" }} />
            </div>
        </Modal>
    );
}

function SchedulerModal(props: RenderModalProps & { channelId: string; }) {
    const { channelId, onClose } = props;
    const ar = settings.store.language === "ar";

    const [tab, setTab]                 = useState<"schedule"|"saved"|"queue">("schedule");
    const [message, setMessage]         = useState("");
    const [preset, setPreset]           = useState(PRESETS(ar)[2].ms);
    const [custom, setCustom]           = useState("");
    const [unit, setUnit]               = useState<"seconds"|"minutes"|"hours"|"days"|"months">("minutes");
    const [dateVal, setDateVal]         = useState("");
    const [repeat, setRepeat]           = useState(false);
    const [repeatCount, setRepeatCount] = useState("0");
    const [isRandom, setIsRandom]       = useState(false);
    const [randomPool, setRandomPool]   = useState<string[]>([]);
    const [randomInput, setRandomInput] = useState("");
    const [targetChannel, setTargetChannel] = useState(channelId);
    const [search, setSearch]           = useState("");
    const [pending, setPending]         = useState<ScheduledMessage[]>([...scheduled]);
    const [saved, setSaved]             = useState<string[]>([...savedMessages]);

    // قنوات السيرفر الحالي
    let channels: { id: string; name: string; }[] = [];
    try {
        const guildId = SelectedGuildStore.getGuildId();
        if (guildId) {
            const all = GuildChannelStore.getChannels(guildId);
            channels = (all?.SELECTABLE || []).map((c: any) => ({ id: c.channel.id, name: c.channel.name }));
        }
    } catch {}

    function getDelay(): number | null {
        if (preset === -2) {
            if (!dateVal) return null;
            const ms = new Date(dateVal).getTime() - Date.now();
            return ms > 0 ? ms : null;
        }
        if (preset !== -1) return preset;
        const n = parseFloat(custom);
        if (isNaN(n) || n <= 0) return null;
        const mult: Record<string, number> = { seconds: 1_000, minutes: 60_000, hours: 3_600_000, days: 86_400_000, months: 30 * 86_400_000 };
        return n * mult[unit];
    }

    function schedule() {
        const content = isRandom ? (randomPool[0] || "") : message.trim();
        if (!content && !isRandom) {
            Toasts.show({ message: ar ? "اكتب الرسالة أولاً" : "Write a message first", type: Toasts.Type.FAILURE, id: Toasts.genId() });
            return;
        }
        if (isRandom && randomPool.length < 2) {
            Toasts.show({ message: ar ? "أضف رسالتين على الأقل للعشوائية" : "Add at least 2 messages for random", type: Toasts.Type.FAILURE, id: Toasts.genId() });
            return;
        }
        const delay = getDelay();
        if (!delay) {
            Toasts.show({ message: ar ? "حدد وقت صحيح" : "Enter a valid time", type: Toasts.Type.FAILURE, id: Toasts.genId() });
            return;
        }
        const msg: ScheduledMessage = {
            id: Math.random().toString(36).slice(2),
            channelId: targetChannel,
            content: isRandom ? randomPool[0] : message.trim(),
            sendAt: preset === -2 ? new Date(dateVal).getTime() : Date.now() + delay,
            repeat, repeatMs: delay,
            repeatCount: parseInt(repeatCount) || 0,
            repeatDone: 0,
            isRandom,
            randomPool: [...randomPool],
        };
        scheduled.push(msg);
        setPending([...scheduled]);
        setMessage("");
        setRandomPool([]);
        Toasts.show({ message: ar ? "تم الجدولة!" : "Scheduled!", type: Toasts.Type.SUCCESS, id: Toasts.genId() });
    }

    function saveMessage() {
        if (!message.trim()) return;
        savedMessages.push(message.trim());
        setSaved([...savedMessages]);
        Toasts.show({ message: ar ? "تم الحفظ" : "Saved!", type: Toasts.Type.SUCCESS, id: Toasts.genId() });
    }

    function cancelScheduled(id: string) {
        const msg = scheduled.find(m => m.id === id);
        if (!msg) return;
        openModal(p => (
            <ConfirmModal {...p}
                message={ar ? `إلغاء "${msg.content.slice(0, 40)}"؟` : `Remove "${msg.content.slice(0, 40)}"?`}
                onConfirm={() => { const i = scheduled.findIndex(m => m.id === id); if (i !== -1) scheduled.splice(i, 1); setPending([...scheduled]); }}
            />
        ));
    }

    function editScheduled(id: string) {
        const msg = scheduled.find(m => m.id === id);
        if (!msg) return;
        openModal(p => (
            <EditModal {...p} msg={msg}
                onSave={val => { msg.content = val; setPending([...scheduled]); }}
            />
        ));
    }

    function deleteSaved(i: number) {
        openModal(p => (
            <ConfirmModal {...p}
                message={ar ? "حذف هذه الرسالة؟" : "Delete this saved message?"}
                onConfirm={() => { savedMessages.splice(i, 1); setSaved([...savedMessages]); }}
            />
        ));
    }

    function exportData() {
        const data = JSON.stringify({ scheduled, saved: savedMessages }, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "message-scheduler-backup.json"; a.click();
        URL.revokeObjectURL(url);
    }

    function importData() {
        const input = document.createElement("input");
        input.type = "file"; input.accept = ".json";
        input.onchange = e => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                try {
                    const data = JSON.parse(ev.target?.result as string);
                    if (data.scheduled) { scheduled.push(...data.scheduled); setPending([...scheduled]); }
                    if (data.saved) { savedMessages.push(...data.saved); setSaved([...savedMessages]); }
                    Toasts.show({ message: ar ? "تم الاستيراد!" : "Imported!", type: Toasts.Type.SUCCESS, id: Toasts.genId() });
                } catch { Toasts.show({ message: "Invalid file", type: Toasts.Type.FAILURE, id: Toasts.genId() }); }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    const presets = PRESETS(ar);
    const filteredPending = pending.filter(m => m.content.toLowerCase().includes(search.toLowerCase()));

    const S = {
        label:   { fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: "8px" },
        input:   { background: "var(--background-tertiary)", color: "var(--text-normal)", border: "1px solid var(--background-modifier-accent)", borderRadius: "8px", padding: "8px 12px", fontSize: "14px", outline: "none" } as const,
        chip:    (on: boolean) => ({ padding: "4px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: on ? 600 : 400, background: on ? "var(--brand-500)" : "var(--background-tertiary)", color: on ? "#fff" : "var(--text-muted)", transition: "all .12s ease" }),
        tab:     (on: boolean) => ({ flex: 1, padding: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: on ? 600 : 400, background: on ? "var(--brand-500)" : "var(--background-tertiary)", color: on ? "#fff" : "var(--text-muted)", transition: "all .12s ease" }),
        card:    { background: "var(--background-secondary)", borderRadius: "10px", padding: "12px 14px", border: "1px solid var(--background-modifier-accent)" } as const,
        pCard:   { background: "var(--background-secondary)", borderRadius: "10px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", border: "1px solid var(--background-modifier-accent)" } as const,
        btn:     (danger?: boolean, primary?: boolean) => ({ border: "none", borderRadius: "6px", padding: "5px 12px", fontSize: "12px", fontWeight: 600, cursor: "pointer", flexShrink: 0 as const, background: danger ? "var(--button-danger-background)" : primary ? "var(--brand-500)" : "var(--background-tertiary)", color: danger || primary ? "#fff" : "var(--text-muted)", transition: "opacity .12s ease" }),
        mainBtn: { background: "var(--brand-500)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", width: "100%", transition: "opacity .15s ease" } as const,
    };

    return (
        <Modal {...props}
            title={ar ? "جدولة رسالة" : "Schedule Message"}
            actions={[{ text: ar ? "إغلاق" : "Close", variant: "secondary", onClick: onClose }]}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "4px 0" }}>

                {/* Tabs */}
                <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", gap: "2px" }}>
                    <button style={{ ...S.tab(tab === "schedule"), borderRadius: "8px 0 0 8px" }} onClick={() => setTab("schedule")}>{ar ? "جدولة" : "Schedule"}</button>
                    <button style={{ ...S.tab(tab === "saved") }} onClick={() => setTab("saved")}>{ar ? `المحفوظة (${saved.length})` : `Saved (${saved.length})`}</button>
                    <button style={{ ...S.tab(tab === "queue"), borderRadius: "0 8px 8px 0" }} onClick={() => setTab("queue")}>{ar ? `المنتظرة (${pending.length})` : `Queue (${pending.length})`}</button>
                </div>

                {/* ── TAB: Schedule ── */}
                {tab === "schedule" && <>

                    {/* الرسالة */}
                    {!isRandom && <div>
                        <div style={S.label}>{ar ? "الرسالة" : "Message"}</div>
                        <textarea value={message} onChange={e => setMessage(e.currentTarget.value)}
                            placeholder={ar ? "اكتب رسالتك هنا..." : "Type your message here..."}
                            rows={3} style={{ ...S.input, width: "100%", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
                        <button onClick={saveMessage} style={{ ...S.btn(), marginTop: "6px" }}>{ar ? "حفظ الرسالة" : "Save message"}</button>
                    </div>}

                    {/* رسائل عشوائية */}
                    <div style={S.card}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: isRandom ? "10px" : "0" }}>
                            <input type="checkbox" id="random" checked={isRandom} onChange={e => setIsRandom(e.currentTarget.checked)}
                                style={{ width: "15px", height: "15px", cursor: "pointer", accentColor: "var(--brand-500)" }} />
                            <label htmlFor="random" style={{ fontSize: "14px", color: "var(--text-normal)", cursor: "pointer", userSelect: "none" }}>
                                {ar ? "رسائل عشوائية" : "Random Messages"}
                            </label>
                        </div>
                        {isRandom && <>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                <input value={randomInput} onChange={e => setRandomInput(e.currentTarget.value)}
                                    placeholder={ar ? "أضف رسالة..." : "Add message..."} style={{ ...S.input, flex: 1 }} />
                                <button onClick={() => { if (randomInput.trim()) { setRandomPool([...randomPool, randomInput.trim()]); setRandomInput(""); } }} style={S.btn(false, true)}>
                                    {ar ? "إضافة" : "Add"}
                                </button>
                            </div>
                            {randomPool.map((r, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", background: "var(--background-tertiary)", borderRadius: "6px", marginBottom: "4px" }}>
                                    <span style={{ fontSize: "13px", color: "var(--text-normal)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{r}</span>
                                    <button onClick={() => setRandomPool(randomPool.filter((_, j) => j !== i))} style={S.btn(true)}>{ar ? "حذف" : "Remove"}</button>
                                </div>
                            ))}
                        </>}
                    </div>

                    {/* القناة */}
                    {channels.length > 0 && <div>
                        <div style={S.label}>{ar ? "القناة" : "Channel"}</div>
                        <select value={targetChannel} onChange={e => setTargetChannel(e.currentTarget.value)} style={{ ...S.input, width: "100%", cursor: "pointer" }}>
                            {channels.map(c => <option key={c.id} value={c.id}>#{c.name}</option>)}
                        </select>
                    </div>}

                    {/* الوقت */}
                    <div>
                        <div style={S.label}>{ar ? "الوقت" : "When to send"}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {presets.map(p => <button key={p.ms} onClick={() => setPreset(p.ms)} style={S.chip(preset === p.ms)}>{p.label}</button>)}
                        </div>
                        {preset === -1 && (
                            <div style={{ display: "flex", gap: "8px", marginTop: "10px", alignItems: "center" }}>
                                <input type="number" value={custom} onChange={e => setCustom(e.currentTarget.value)}
                                    placeholder={ar ? "الكمية" : "Amount"} min="1" style={{ ...S.input, width: "90px" }} />
                                <select value={unit} onChange={e => setUnit(e.currentTarget.value as any)} style={{ ...S.input, cursor: "pointer" }}>
                                    {UNITS(ar).map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                                </select>
                            </div>
                        )}
                        {preset === -2 && (
                            <input type="datetime-local" value={dateVal} onChange={e => setDateVal(e.currentTarget.value)}
                                style={{ ...S.input, width: "100%", marginTop: "10px", boxSizing: "border-box" }} />
                        )}
                    </div>

                    {/* التكرار */}
                    <div style={S.card}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: repeat ? "10px" : "0" }}>
                            <input type="checkbox" id="repeat" checked={repeat} onChange={e => setRepeat(e.currentTarget.checked)}
                                style={{ width: "15px", height: "15px", cursor: "pointer", accentColor: "var(--brand-500)" }} />
                            <label htmlFor="repeat" style={{ fontSize: "14px", color: "var(--text-normal)", cursor: "pointer", userSelect: "none" }}>
                                {ar ? "تكرار الرسالة" : "Repeat Message"}
                            </label>
                        </div>
                        {repeat && (
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{ar ? "عدد المرات (0 = للأبد)" : "Times (0 = forever)"}</span>
                                <input type="number" value={repeatCount} onChange={e => setRepeatCount(e.currentTarget.value)}
                                    min="0" style={{ ...S.input, width: "70px" }} />
                            </div>
                        )}
                    </div>

                    <button onClick={schedule} style={S.mainBtn}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                        {ar ? "جدولة الرسالة" : "Schedule Message"}
                    </button>

                    {/* Import/Export */}
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={exportData} style={{ ...S.btn(), flex: 1, padding: "8px" }}>{ar ? "تصدير البيانات" : "Export Data"}</button>
                        <button onClick={importData} style={{ ...S.btn(), flex: 1, padding: "8px" }}>{ar ? "استيراد بيانات" : "Import Data"}</button>
                    </div>
                </>}

                {/* ── TAB: Saved ── */}
                {tab === "saved" && (
                    saved.length === 0
                        ? <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "14px", padding: "20px 0" }}>{ar ? "ما في رسائل محفوظة بعد" : "No saved messages yet"}</div>
                        : <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {saved.map((s, i) => (
                                <div key={i} style={S.pCard}>
                                    <div style={{ flex: 1, fontSize: "13px", color: "var(--text-normal)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s}</div>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <button onClick={() => { setMessage(s); setTab("schedule"); }} style={S.btn(false, true)}>{ar ? "استخدام" : "Use"}</button>
                                        <button onClick={() => deleteSaved(i)} style={S.btn(true)}>{ar ? "حذف" : "Delete"}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                )}

                {/* ── TAB: Queue ── */}
                {tab === "queue" && <>
                    <input value={search} onChange={e => setSearch(e.currentTarget.value)}
                        placeholder={ar ? "ابحث في الرسائل..." : "Search messages..."}
                        style={{ ...S.input, width: "100%", boxSizing: "border-box" }} />
                    {filteredPending.length === 0
                        ? <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "14px", padding: "20px 0" }}>{ar ? "ما في رسائل منتظرة" : "No pending messages"}</div>
                        : <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
                            {filteredPending.map(msg => (
                                <div key={msg.id} style={S.pCard}>
                                    <div style={{ flex: 1, overflow: "hidden" }}>
                                        <div style={{ fontSize: "13px", color: "var(--text-normal)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "4px" }}>
                                            {msg.isRandom ? `[Random] ${msg.randomPool.join(" / ")}` : msg.content}
                                        </div>
                                        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{new Date(msg.sendAt).toLocaleString(ar ? "ar-SA" : "en-US")}</span>
                                            {msg.repeat && <span style={{ fontSize: "11px", background: "var(--brand-500)", color: "#fff", borderRadius: "4px", padding: "1px 6px" }}>
                                                {msg.repeatCount === 0 ? (ar ? "للأبد" : "forever") : `${msg.repeatDone}/${msg.repeatCount}x`}
                                            </span>}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <button onClick={() => editScheduled(msg.id)} style={S.btn()}>{ar ? "تعديل" : "Edit"}</button>
                                        <button onClick={() => cancelScheduled(msg.id)} style={S.btn(true)}>{ar ? "إلغاء" : "Cancel"}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </>}

            </div>
        </Modal>
    );
}

const SchedulerIcon: ChatBarButtonFactory = ({ isMainChat }) => {
    if (!isMainChat) return null;
    const channelId = SelectedChannelStore.getChannelId();
    return (
        <ChatBarButton
            tooltip={settings.store.language === "ar" ? "جدولة رسالة" : "Schedule Message"}
            onClick={() => channelId && openModal(props => <SchedulerModal {...props} channelId={channelId} />)}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
        </ChatBarButton>
    );
};

export default definePlugin({
    name: "MessageScheduler",
    description: "Schedule messages with repeat, random, queue, saved messages, import/export",
    authors: [{ name: "hmood", id: 267110098252464131n }],
    dependencies: ["ChatInputButtonAPI"],
    settings,

    start() {
        startInterval();
        addChatBarButton("MessageScheduler", SchedulerIcon);
    },

    stop() {
        stopInterval();
        scheduled.length = 0;
        removeChatBarButton("MessageScheduler");
    },
});
