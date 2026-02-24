import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────
type Section = "chats" | "groups" | "contacts" | "notifications" | "settings" | "profile" | "search";

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread?: number;
  online?: boolean;
  isGroup?: boolean;
  members?: number;
  encrypted?: boolean;
}

interface Message {
  id: number;
  text: string;
  time: string;
  out: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockChats: Chat[] = [
  { id: 1, name: "Алексей Петров", avatar: "АП", lastMsg: "Окей, договорились на завтра!", time: "14:32", unread: 2, online: true, encrypted: true },
  { id: 2, name: "Мария Соколова", avatar: "МС", lastMsg: "Посмотри документы которые я прислала", time: "13:10", online: false, encrypted: true },
  { id: 3, name: "Дмитрий Иванов", avatar: "ДИ", lastMsg: "Когда встречаемся?", time: "12:05", unread: 5, online: true, encrypted: true },
  { id: 4, name: "Ольга Нова", avatar: "ОН", lastMsg: "Спасибо за помощь 🙏", time: "11:44", online: false, encrypted: true },
  { id: 5, name: "Сергей Кузнецов", avatar: "СК", lastMsg: "Всё готово, можно запускать", time: "09:18", online: true, encrypted: true },
];

const mockGroups: Chat[] = [
  { id: 101, name: "Команда разработки", avatar: "КР", lastMsg: "Коля: Билд задеплоен ✅", time: "15:01", unread: 12, isGroup: true, members: 8, encrypted: true },
  { id: 102, name: "Маркетинг 2026", avatar: "МА", lastMsg: "Вика: Новый баннер готов", time: "14:22", isGroup: true, members: 5, encrypted: true },
  { id: 103, name: "Семейный чат 🏠", avatar: "СЧ", lastMsg: "Мама: Ужин в 19:00", time: "13:55", unread: 3, isGroup: true, members: 6, encrypted: true },
  { id: 104, name: "Инвесторы", avatar: "ИН", lastMsg: "Дима: Смотрите питч-дек", time: "10:30", isGroup: true, members: 4, encrypted: true },
];

const mockContacts = [
  { id: 1, name: "Алексей Петров", avatar: "АП", online: true, phone: "+7 999 123-45-67" },
  { id: 2, name: "Дмитрий Иванов", avatar: "ДИ", online: true, phone: "+7 916 234-56-78" },
  { id: 3, name: "Мария Соколова", avatar: "МС", online: false, phone: "+7 926 345-67-89" },
  { id: 4, name: "Ольга Нова", avatar: "ОН", online: false, phone: "+7 903 456-78-90" },
  { id: 5, name: "Сергей Кузнецов", avatar: "СК", online: true, phone: "+7 985 567-89-01" },
  { id: 6, name: "Виктория Лебедева", avatar: "ВЛ", online: false, phone: "+7 967 678-90-12" },
];

const mockNotifications = [
  { id: 1, icon: "MessageCircle", text: "Алексей написал вам сообщение", time: "14:32", color: "text-violet-400" },
  { id: 2, icon: "Users", text: "Вас добавили в группу «Инвесторы»", time: "12:10", color: "text-blue-400" },
  { id: 3, icon: "Shield", text: "Ключи шифрования обновлены", time: "10:05", color: "text-emerald-400" },
  { id: 4, icon: "UserPlus", text: "Сергей Кузнецов добавил вас в контакты", time: "Вчера", color: "text-amber-400" },
  { id: 5, icon: "Bell", text: "Новое упоминание в «Команда разработки»", time: "Вчера", color: "text-violet-400" },
];

const getMessages = (_id: number): Message[] => [
  { id: 1, text: "Привет! Как дела?", time: "12:01", out: false },
  { id: 2, text: "Всё отлично, спасибо! Работаю над проектом.", time: "12:03", out: true },
  { id: 3, text: "Как продвигается?", time: "12:04", out: false },
  { id: 4, text: "Хорошо! Почти закончил основную часть. Осталось немного довести до ума.", time: "12:06", out: true },
  { id: 5, text: "Здорово! Когда можно будет посмотреть?", time: "12:08", out: false },
  { id: 6, text: "Думаю к завтрашнему утру будет готово 👍", time: "12:10", out: true },
  { id: 7, text: "Отлично, буду ждать!", time: "12:11", out: false },
];

const navItems: { section: Section; icon: string; label: string; badge?: number }[] = [
  { section: "chats", icon: "MessageCircle", label: "Чаты", badge: 7 },
  { section: "groups", icon: "Users", label: "Группы", badge: 15 },
  { section: "contacts", icon: "Contact", label: "Контакты" },
  { section: "search", icon: "Search", label: "Поиск" },
  { section: "notifications", icon: "Bell", label: "Уведомления", badge: 5 },
  { section: "settings", icon: "Settings", label: "Настройки" },
  { section: "profile", icon: "UserCircle", label: "Профиль" },
];

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-indigo-500 to-blue-600",
];
const getColor = (id: number) => avatarColors[id % avatarColors.length];

// ─── Sub-components ───────────────────────────────────────────────────────────

function EncryptBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-medium">
      <Icon name="Lock" size={10} />
      E2E
    </span>
  );
}

function ChatList({ items, onSelect, selected }: { items: Chat[]; onSelect: (c: Chat) => void; selected: Chat | null }) {
  return (
    <div className="flex flex-col gap-0.5 p-2">
      {items.map((chat, i) => (
        <button
          key={chat.id}
          onClick={() => onSelect(chat)}
          style={{ animationDelay: `${i * 40}ms` }}
          className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 animate-fade-in
            ${selected?.id === chat.id
              ? "bg-gradient-to-r from-violet-600/30 to-blue-600/20 border border-violet-500/30"
              : "hover:bg-white/5 border border-transparent"
            }`}
        >
          <div className="relative flex-shrink-0">
            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getColor(chat.id)} flex items-center justify-center text-white text-sm font-bold`}>
              {chat.avatar}
            </div>
            {chat.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[hsl(var(--sidebar-background))] animate-pulse-dot" />
            )}
            {chat.isGroup && (
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-violet-500 rounded-full border-2 border-[hsl(var(--sidebar-background))] flex items-center justify-center">
                <Icon name="Users" size={8} className="text-white" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-foreground truncate">{chat.name}</span>
              <span className="text-[11px] text-muted-foreground ml-2 flex-shrink-0">{chat.time}</span>
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs text-muted-foreground truncate pr-1">{chat.lastMsg}</span>
              {chat.unread ? (
                <span className="flex-shrink-0 min-w-[20px] h-5 rounded-full gradient-primary text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {chat.unread > 9 ? "9+" : chat.unread}
                </span>
              ) : null}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function ChatWindow({ chat, onBack }: { chat: Chat; onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>(getMessages(chat.id));
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: input.trim(),
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      out: true,
    }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border" style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}>
        <button onClick={onBack} className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <Icon name="ArrowLeft" size={18} />
        </button>
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getColor(chat.id)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {chat.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{chat.name}</span>
            <EncryptBadge />
          </div>
          <span className="text-xs text-muted-foreground">
            {chat.isGroup ? `${chat.members} участников` : chat.online ? "в сети" : "был(а) недавно"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="Phone" size={16} />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="Video" size={16} />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="MoreVertical" size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center py-2">
        <span className="flex items-center gap-1.5 text-[11px] text-emerald-400/80 bg-emerald-400/10 px-3 py-1 rounded-full">
          <Icon name="ShieldCheck" size={11} />
          Сквозное шифрование включено
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            style={{ animationDelay: `${i * 30}ms` }}
            className={`flex animate-msg-in ${msg.out ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl ${msg.out
              ? "text-white rounded-br-sm"
              : "bg-card border border-border text-foreground rounded-bl-sm"
            }`}
              style={msg.out ? { background: "linear-gradient(135deg, #7c3aed, #4f46e5)" } : {}}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.out ? "justify-end" : "justify-start"}`}>
                <Icon name="Lock" size={9} className={msg.out ? "text-white/60" : "text-emerald-400/70"} />
                <span className={`text-[10px] ${msg.out ? "text-white/60" : "text-muted-foreground"}`}>{msg.time}</span>
                {msg.out && <Icon name="CheckCheck" size={12} className="text-white/60" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-3 py-2">
          <button className="text-muted-foreground hover:text-violet-400 transition-colors">
            <Icon name="Paperclip" size={18} />
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Написать сообщение..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="text-muted-foreground hover:text-violet-400 transition-colors">
            <Icon name="Smile" size={18} />
          </button>
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-full text-white flex items-center justify-center transition-all hover:scale-105 disabled:opacity-40 disabled:scale-100"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 0 16px rgba(124,58,237,0.4)" }}
          >
            <Icon name="Send" size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const toggle = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-lg">Создать группу</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Название группы</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Введите название..."
              className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Участники ({selected.length} выбрано)</label>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
              {mockContacts.map(c => (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${selected.includes(c.id) ? "bg-violet-500/20 border border-violet-500/40" : "hover:bg-white/5 border border-transparent"}`}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getColor(c.id)} flex items-center justify-center text-white text-xs font-bold`}>
                    {c.avatar}
                  </div>
                  <span className="text-sm font-medium flex-1 text-left">{c.name}</span>
                  {selected.includes(c.id) && <Icon name="Check" size={16} className="text-violet-400" />}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 px-3 py-2 rounded-xl">
            <Icon name="ShieldCheck" size={13} />
            <span>Группа будет создана со сквозным шифрованием E2E</span>
          </div>
        </div>
        <div className="p-5 pt-0 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-white/5 transition-colors">
            Отмена
          </button>
          <button
            disabled={!name.trim() || selected.length === 0}
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 0 16px rgba(124,58,237,0.3)" }}
          >
            Создать группу
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8 animate-fade-in">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-2"
        style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}>
        <Icon name={icon} size={36} className="text-white" />
      </div>
      <h2 className="text-xl font-bold">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground max-w-xs">{subtitle}</p>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const Index = () => {
  const [section, setSection] = useState<Section>("chats");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);

  const allChats = [...mockChats, ...mockGroups];
  const searchResults = searchQ
    ? allChats.filter(c =>
        c.name.toLowerCase().includes(searchQ.toLowerCase()) ||
        c.lastMsg.toLowerCase().includes(searchQ.toLowerCase())
      )
    : [];

  const renderPanel = () => {
    switch (section) {
      case "chats":
        return (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-4 border-b border-border">
              <h1 className="text-xl font-bold mb-3">Чаты</h1>
              <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
                <Icon name="Search" size={15} className="text-muted-foreground" />
                <input placeholder="Поиск..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatList items={mockChats} onSelect={setSelectedChat} selected={selectedChat} />
            </div>
          </div>
        );

      case "groups":
        return (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h1 className="text-xl font-bold">Группы</h1>
              <button
                onClick={() => setShowCreateGroup(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 0 12px rgba(124,58,237,0.3)" }}
              >
                <Icon name="Plus" size={13} className="text-white" />
                Создать
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatList items={mockGroups} onSelect={setSelectedChat} selected={selectedChat} />
            </div>
          </div>
        );

      case "contacts":
        return (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-4 border-b border-border">
              <h1 className="text-xl font-bold mb-3">Контакты</h1>
              <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
                <Icon name="Search" size={15} className="text-muted-foreground" />
                <input placeholder="Найти контакт..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
              {mockContacts.map((c, i) => (
                <div key={c.id} style={{ animationDelay: `${i * 50}ms` }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors animate-fade-in cursor-pointer group border border-transparent hover:border-violet-500/20">
                  <div className="relative">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getColor(c.id)} flex items-center justify-center text-white text-sm font-bold`}>
                      {c.avatar}
                    </div>
                    {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background animate-pulse-dot" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-violet-400 transition-colors">
                      <Icon name="MessageCircle" size={15} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-violet-400 transition-colors">
                      <Icon name="Phone" size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "search":
        return (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-4 border-b border-border">
              <h1 className="text-xl font-bold mb-3">Поиск</h1>
              <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
                <Icon name="Search" size={15} className="text-muted-foreground" />
                <input
                  autoFocus
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Поиск по чатам и сообщениям..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {searchQ && (
                  <button onClick={() => setSearchQ("")} className="text-muted-foreground hover:text-foreground">
                    <Icon name="X" size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {searchQ ? (
                searchResults.length > 0 ? (
                  <>
                    <p className="px-4 pt-3 pb-1 text-xs text-muted-foreground">Найдено: {searchResults.length}</p>
                    <ChatList items={searchResults} onSelect={setSelectedChat} selected={selectedChat} />
                  </>
                ) : (
                  <EmptyState icon="SearchX" title="Ничего не найдено" subtitle={`По запросу «${searchQ}» нет результатов`} />
                )
              ) : (
                <EmptyState icon="Search" title="Введите запрос" subtitle="Ищите по именам, сообщениям и группам" />
              )}
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h1 className="text-xl font-bold">Уведомления</h1>
              <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Прочитать все</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {mockNotifications.map((n, i) => (
                <div key={n.id} style={{ animationDelay: `${i * 60}ms` }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border hover:border-violet-500/30 transition-all cursor-pointer animate-fade-in">
                  <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Icon name={n.icon} size={16} className={n.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">{n.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-4 border-b border-border">
              <h1 className="text-xl font-bold">Настройки</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {[
                { icon: "ShieldCheck", label: "Конфиденциальность", desc: "Шифрование, пароль, блокировки", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                { icon: "Bell", label: "Уведомления", desc: "Звуки, вибрация, режим «не беспокоить»", color: "text-amber-400", bg: "bg-amber-400/10" },
                { icon: "Palette", label: "Внешний вид", desc: "Тема, шрифты, размер текста", color: "text-violet-400", bg: "bg-violet-400/10" },
                { icon: "Key", label: "Ключи шифрования", desc: "Управление E2E ключами", color: "text-blue-400", bg: "bg-blue-400/10" },
                { icon: "Smartphone", label: "Устройства", desc: "Активные сессии и сеансы", color: "text-rose-400", bg: "bg-rose-400/10" },
                { icon: "HelpCircle", label: "Помощь", desc: "FAQ, поддержка, обратная связь", color: "text-muted-foreground", bg: "bg-muted" },
              ].map((item, i) => (
                <button key={item.label} style={{ animationDelay: `${i * 50}ms` }}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border hover:border-violet-500/30 text-left transition-all group animate-fade-in">
                  <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={item.icon} size={18} className={item.color} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Icon name="ChevronRight" size={15} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              ))}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-4 border-b border-border">
              <h1 className="text-xl font-bold">Профиль</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-white text-3xl font-bold"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 0 30px rgba(124,58,237,0.5)" }}>
                    ВИ
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-background flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
                    <Icon name="Camera" size={12} className="text-white" />
                  </button>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">Вы</h2>
                  <p className="text-sm text-muted-foreground">@username</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full">
                  <Icon name="Shield" size={12} />
                  <span>Аккаунт защищён E2E шифрованием</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 999 000-00-00" },
                  { icon: "User", label: "Имя пользователя", value: "@username" },
                  { icon: "Info", label: "О себе", value: "Привет! Я использую NexChat" },
                ].map(field => (
                  <div key={field.label} className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border">
                    <Icon name={field.icon} size={16} className="text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{field.label}</p>
                      <p className="text-sm font-medium">{field.value}</p>
                    </div>
                    <button className="text-muted-foreground hover:text-violet-400 transition-colors">
                      <Icon name="Edit2" size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {[
                  { value: "12", label: "Чатов", color: "text-violet-400" },
                  { value: "4", label: "Групп", color: "text-blue-400" },
                  { value: "6", label: "Контактов", color: "text-emerald-400" },
                ].map(stat => (
                  <div key={stat.label} className="flex-1 p-3.5 rounded-xl bg-card border border-border text-center">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className="flex flex-col h-full border-r border-border z-10 flex-shrink-0 transition-all duration-200"
        style={{
          width: navExpanded ? "200px" : "64px",
          background: "hsl(var(--sidebar-background))"
        }}
      >
        <div className="flex items-center gap-2.5 px-3 py-4 border-b border-border overflow-hidden">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 0 16px rgba(124,58,237,0.4)" }}>
            <Icon name="Zap" size={18} className="text-white" />
          </div>
          {navExpanded && <span className="font-bold text-base whitespace-nowrap">NexChat</span>}
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-2 overflow-hidden">
          {navItems.map(item => {
            const active = section === item.section;
            return (
              <button
                key={item.section}
                onClick={() => { setSection(item.section); setSelectedChat(null); }}
                className={`relative flex items-center gap-2.5 rounded-xl transition-all duration-200
                  ${navExpanded ? "px-3 py-2.5" : "p-2.5 justify-center"}
                  ${active ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}
                `}
                style={active ? {
                  background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                  boxShadow: "0 0 16px rgba(124,58,237,0.35)"
                } : {}}
              >
                <Icon name={item.icon} size={18} className="flex-shrink-0" />
                {navExpanded && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                {item.badge && !navExpanded && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-violet-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
                {item.badge && navExpanded && (
                  <span className="ml-auto min-w-[20px] h-5 rounded-full bg-violet-500/30 text-violet-300 text-[10px] font-bold flex items-center justify-center px-1">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => setNavExpanded(p => !p)}
          className="m-2 p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all flex items-center justify-center"
        >
          <Icon name={navExpanded ? "PanelLeftClose" : "PanelLeftOpen"} size={18} />
        </button>
      </aside>

      {/* List Panel */}
      <div
        className={`h-full border-r border-border flex-shrink-0 flex flex-col overflow-hidden ${selectedChat ? "hidden md:flex" : "flex"}`}
        style={{ width: "300px" }}
      >
        {renderPanel()}
      </div>

      {/* Main area */}
      <main className={`flex-1 h-full flex flex-col overflow-hidden ${selectedChat ? "flex" : "hidden md:flex"}`}>
        {selectedChat ? (
          <ChatWindow chat={selectedChat} onBack={() => setSelectedChat(null)} />
        ) : (
          <EmptyState
            icon="MessageCircle"
            title="Выберите чат"
            subtitle="Нажмите на любой чат слева. Все сообщения защищены сквозным шифрованием."
          />
        )}
      </main>

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
    </div>
  );
};

export default Index;
