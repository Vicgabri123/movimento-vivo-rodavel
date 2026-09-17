import { type Dispatch, type ReactNode, type SetStateAction, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Dumbbell,
  FileHeart,
  HeartPulse,
  Home as HomeIcon,
  Info,
  ListChecks,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Minus,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  ThumbsUp,
  UserRound,
  UsersRound,
  Volume2,
  X,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

type Mode = 'participant' | 'instructor';
type Attendance = 'confirmed' | 'cancelled' | 'pending';

type ClassItem = {
  id: string;
  day: string;
  date: string;
  time: string;
  title: string;
  instructor: string;
  room: string;
  kind: string;
  color: string;
  spots: string;
  duration: string;
  description: string;
};

type Preferences = {
  largeType: boolean;
  contrast: boolean;
  readAloud: boolean;
  reminders: boolean;
};

const classes: ClassItem[] = [
  {
    id: 'mobility-1',
    day: 'Hoje',
    date: '14 de maio',
    time: '09:30',
    title: 'Mobilidade & equilíbrio',
    instructor: 'com Ana Luiza',
    room: 'Sala Ipê',
    kind: 'Mobilidade',
    color: 'coral',
    spots: '2 vagas',
    duration: '45 min',
    description: 'Movimentos lentos para acordar articulações, melhorar a confiança ao caminhar e começar o dia no seu ritmo.',
  },
  {
    id: 'strength-2',
    day: 'Quinta',
    date: '16 de maio',
    time: '10:00',
    title: 'Força gentil',
    instructor: 'com Rafael Nunes',
    room: 'Sala Mangue',
    kind: 'Força',
    color: 'teal',
    spots: '6 vagas',
    duration: '50 min',
    description: 'Uma aula de força com elásticos e o peso do corpo. Cada exercício tem uma alternativa confortável.',
  },
  {
    id: 'dance-3',
    day: 'Sábado',
    date: '18 de maio',
    time: '11:00',
    title: 'Dança em roda',
    instructor: 'com Bia Campos',
    room: 'Pátio das Palmeiras',
    kind: 'Dança',
    color: 'gold',
    spots: '8 vagas',
    duration: '60 min',
    description: 'Ritmos brasileiros, passos fáceis e muita companhia. Venha como estiver; a roda acompanha você.',
  },
];

const navItems = [
  { href: '/', label: 'Meu início', icon: HomeIcon },
  { href: '/agenda', label: 'Minha agenda', icon: CalendarDays },
  { href: '/ficha', label: 'Minha ficha', icon: FileHeart },
  { href: '/comunidade', label: 'Comunidade', icon: MessageCircle },
];

const formatInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

function LogoMark() {
  return (
    <div className="flex items-center gap-3" data-testid="brand-movlinda">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-sm">
        <img
          src={`${import.meta.env.BASE_URL}Movlinda.png`}
          alt="MOVLINDA"
          className="h-10 w-10 rounded-[14px] object-cover"
        />
        <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[hsl(var(--sidebar))] bg-[hsl(var(--accent))]" />
      </div>
      <div className="leading-none">
        <div className="font-serif text-lg font-bold tracking-[0.02em] text-[hsl(var(--sidebar-foreground))]">MOVLINDA</div>
      </div>
    </div>
  );
}

function Avatar({ name = 'Lúcia Martins', small = false }: { name?: string; small?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-[hsl(var(--secondary))] font-semibold text-[hsl(var(--foreground))] ${small ? 'h-8 w-8 text-[11px]' : 'h-11 w-11 text-sm'}`}
      title={name}
      data-testid={`avatar-${name.toLowerCase().replaceAll(' ', '-')}`}
    >
      {formatInitials(name)}
    </div>
  );
}

function Sidebar({ mobileOpen, closeMobile }: { mobileOpen: boolean; closeMobile: () => void }) {
  const [location, setLocation] = useLocation();
  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[268px] flex-col bg-[hsl(var(--sidebar))] px-5 py-6 text-[hsl(var(--sidebar-foreground))] transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <Link href="/" onClick={closeMobile} data-testid="link-brand-home"><LogoMark /></Link>
          <button className="rounded-lg p-2 text-[hsl(var(--sidebar-foreground))] md:hidden" onClick={closeMobile} aria-label="Fechar menu" data-testid="button-close-menu"><X size={20} /></button>
        </div>
        <div className="mt-10">
          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--sidebar-primary))]">Seu espaço</div>
          <nav className="space-y-1" aria-label="Navegação principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location === item.href;
              return (
                <Link
                  href={item.href}
                  onClick={closeMobile}
                  key={item.href}
                  className={`sidebar-link flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${active ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]' : 'text-[hsl(var(--sidebar-foreground)/.68)] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]'}`}
                  data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
                >
                  <Icon size={19} strokeWidth={active ? 2.4 : 2} />
                  <span>{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[hsl(var(--sidebar-primary))]" />}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto">
          <div className="rounded-2xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/.5)] p-4">
            <div className="flex items-center gap-2 text-[hsl(var(--sidebar-primary))]"><HeartPulse size={17} /><span className="text-xs font-bold">Tudo bem ir devagar</span></div>
            <p className="mt-2 text-xs leading-5 text-[hsl(var(--sidebar-foreground)/.67)]">Seu corpo não precisa correr para estar em movimento.</p>
          </div>
          <Link href="/configuracoes" onClick={closeMobile} className="sidebar-link mt-5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[hsl(var(--sidebar-foreground)/.68)] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]" data-testid="link-nav-configuracoes">
            <Settings size={19} /><span>Configurações</span>
          </Link>
          <div className="mt-5 flex items-center gap-3 border-t border-[hsl(var(--sidebar-border))] pt-5">
            <Avatar small />
            <div className="min-w-0"><p className="truncate text-sm font-semibold">Lúcia Martins</p><p className="text-xs text-[hsl(var(--sidebar-foreground)/.55)]">participante</p></div>
            <button className="ml-auto rounded-md p-1.5 text-[hsl(var(--sidebar-foreground)/.55)] hover:bg-[hsl(var(--sidebar-accent))]" onClick={() => setLocation('/')} aria-label="Sair" data-testid="button-logout"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-[hsl(var(--foreground)/.28)] md:hidden" onClick={closeMobile} aria-label="Fechar menu" data-testid="button-menu-overlay" />}
    </>
  );
}

function Topbar({ mode, setMode, openMenu }: { mode: Mode; setMode: (mode: Mode) => void; openMenu: () => void }) {
  const [, setLocation] = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const instructor = mode === 'instructor';
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-border/70 bg-[hsl(var(--background)/.88)] px-5 backdrop-blur-md md:px-10">
      <div className="flex items-center gap-3">
        <button className="rounded-xl border border-border bg-card p-2.5 md:hidden" onClick={openMenu} aria-label="Abrir menu" data-testid="button-open-menu"><Menu size={20} /></button>
        <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex"><span>Terça-feira</span><span className="h-1 w-1 rounded-full bg-[hsl(var(--accent))]" /><span>14 de maio de 2024</span></div>
        <div className="text-sm font-semibold md:hidden">14 de maio</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="group flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground shadow-sm hover:border-[hsl(var(--primary)/.45)]"
          onClick={() => { const next = instructor ? 'participant' : 'instructor'; setMode(next); setLocation(next === 'instructor' ? '/instrutor' : '/'); }}
          aria-pressed={instructor}
          data-testid="button-switch-view"
        >
          <span className={`flex h-5 w-5 items-center justify-center rounded-full ${instructor ? 'bg-[hsl(var(--accent))]' : 'bg-[hsl(var(--secondary))]'}`}>{instructor ? <UsersRound size={12} /> : <UserRound size={12} />}</span>
          <span className="hidden sm:inline">{instructor ? 'Visão participante' : 'Visão instrutor'}</span>
          <ArrowRight size={14} className="text-muted-foreground" />
        </button>
        <div className="relative">
          <button className="relative rounded-full border border-border bg-card p-2.5 text-muted-foreground shadow-sm hover:text-foreground" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-expanded={notificationsOpen} aria-label="Notificações" data-testid="button-notifications"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" /></button>
          {notificationsOpen && <div className="absolute right-0 top-12 z-30 w-64 rounded-2xl border border-border bg-card p-4 text-xs shadow-lg rise" data-testid="panel-notifications"><div className="flex items-center gap-2 font-bold"><CheckCircle2 size={15} className="text-[hsl(var(--primary))]" /> Tudo em dia</div><p className="mt-2 leading-5 text-muted-foreground">Nenhum aviso novo. Seu próximo encontro é hoje às 09:30.</p></div>}
        </div>
        <Avatar small />
      </div>
    </header>
  );
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--primary))]" data-testid={`text-eyebrow-${eyebrow.toLowerCase().replaceAll(' ', '-')}`}>{eyebrow}</div><h1 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.04] tracking-[-0.045em] text-foreground" data-testid={`heading-${title.toLowerCase().replaceAll(' ', '-')}`}>{title}</h1>{description && <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>}</div>
      {action}
    </div>
  );
}

function SectionLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between"><h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{children}</h2>{action}</div>;
}

function StatusPill({ status }: { status: Attendance }) {
  if (status === 'confirmed') return <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--primary)/.12)] px-2.5 py-1 text-[11px] font-bold text-[hsl(var(--primary))]" data-testid="status-attendance-confirmed"><CheckCircle2 size={13} /> Presença confirmada</span>;
  if (status === 'cancelled') return <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--muted))] px-2.5 py-1 text-[11px] font-bold text-muted-foreground" data-testid="status-attendance-cancelled"><X size={13} /> Cancelada</span>;
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--secondary))] px-2.5 py-1 text-[11px] font-bold text-foreground" data-testid="status-attendance-pending"><Clock3 size={13} /> A confirmar</span>;
}

function ClassCard({ item, attendance, onAttendance, expanded, onExpand, downloaded, onDownload }: { item: ClassItem; attendance: Attendance; onAttendance: (status: Attendance) => void; expanded: boolean; onExpand: () => void; downloaded: boolean; onDownload: () => void }) {
  return (
    <article className="interactive overflow-hidden rounded-2xl border border-border bg-card shadow-sm" data-testid={`card-class-${item.id}`}>
      <div className="flex items-stretch">
        <div
          className="w-2 shrink-0"
          style={{ backgroundColor: `hsl(var(--${item.color === 'coral' ? 'accent' : item.color === 'gold' ? 'secondary' : 'primary'}))` }}
        />
        <div className="min-w-0 flex-1 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="min-w-[52px] rounded-xl bg-[hsl(var(--muted))] px-2 py-2 text-center"><div className="text-[10px] font-bold uppercase text-muted-foreground">{item.day}</div><div className="mt-0.5 font-serif text-xl leading-none">{item.date.split(' ')[0]}</div></div>
              <div><h3 className="text-lg font-bold leading-tight tracking-[-0.02em]" data-testid={`text-class-title-${item.id}`}>{item.title}</h3><p className="mt-1 text-sm text-muted-foreground">{item.time} · {item.duration} · {item.instructor}</p></div>
            </div>
            <StatusPill status={attendance} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Dumbbell size={14} /> {item.kind}</span><span className="inline-flex items-center gap-1.5"><Info size={14} /> {item.room}</span><span className="text-[hsl(var(--primary))]">{item.spots}</span></div>
          {expanded && <div className="mt-5 border-t border-border pt-4 text-sm leading-6 text-muted-foreground rise" data-testid={`details-class-${item.id}`}><p>{item.description}</p><div className="mt-4 flex flex-wrap gap-2"><button className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold ${downloaded ? 'border-[hsl(var(--primary)/.35)] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))]' : 'border-border bg-card hover:bg-muted'}`} onClick={onDownload} data-testid={`button-material-${item.id}`}><BookOpen size={14} /> {downloaded ? 'Material salvo' : 'Ver material da aula'}</button><button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold hover:bg-muted" onClick={onExpand} data-testid={`button-hide-details-${item.id}`}><ChevronDown size={14} className="rotate-180" /> Recolher</button></div></div>}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {attendance !== 'confirmed' && <button className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--primary-foreground))] shadow-sm hover:brightness-95" onClick={() => onAttendance('confirmed')} data-testid={`button-confirm-${item.id}`}><Check size={15} /> Confirmar presença</button>}
            {attendance === 'confirmed' && <button className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--primary)/.3)] bg-[hsl(var(--primary)/.08)] px-4 py-2.5 text-xs font-bold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.14)]" onClick={() => onAttendance('cancelled')} data-testid={`button-cancel-${item.id}`}><X size={15} /> Cancelar presença</button>}
            {!expanded && <button className="inline-flex items-center gap-1 rounded-xl px-3 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground" onClick={onExpand} data-testid={`button-details-${item.id}`}>Detalhes <ChevronDown size={15} /></button>}
          </div>
        </div>
      </div>
    </article>
  );
}

function HomePage({ attendance, setAttendance, reminders, setReminders }: { attendance: Record<string, Attendance>; setAttendance: Dispatch<SetStateAction<Record<string, Attendance>>>; reminders: boolean; setReminders: (value: boolean) => void }) {
  const [expanded, setExpanded] = useState<string | null>('mobility-1');
  const [downloads, setDownloads] = useState<Record<string, boolean>>({});
  const [reminderOptions, setReminderOptions] = useState(false);
  const confirmedCount = Object.values(attendance).filter((status) => status === 'confirmed').length;
  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 md:px-10 md:py-12">
      <div className="rise flex flex-col justify-between gap-6 rounded-[28px] border border-[hsl(var(--primary)/.18)] bg-[hsl(var(--primary)/.1)] p-6 sm:p-8 md:flex-row md:items-center">
        <div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--card)/.7)] px-3 py-1.5 text-[11px] font-bold text-[hsl(var(--primary))]"><Sun size={14} /> Bom dia, Lúcia</div><h1 className="max-w-xl font-serif text-[clamp(2.1rem,5vw,3.8rem)] leading-[.98] tracking-[-.05em]">Um passo de cada vez,<br /><span className="text-[hsl(var(--primary))]">e você já começou.</span></h1><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">Sua semana está pronta. Escolha o que faz sentido para hoje e venha do seu jeito.</p></div>
        <div className="relative flex h-32 w-full max-w-[260px] items-end justify-end overflow-hidden rounded-2xl bg-[hsl(var(--secondary))] p-4 md:h-40"><div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border-[18px] border-[hsl(var(--accent)/.6)]" /><div className="absolute bottom-[-48px] left-[-20px] h-36 w-36 rounded-full bg-[hsl(var(--primary)/.7)]" /><div className="relative z-10 flex items-center gap-2 rounded-xl bg-[hsl(var(--card)/.84)] px-3 py-2 text-xs font-bold shadow-sm"><HeartPulse size={15} className="text-[hsl(var(--primary))]" /> Seu ritmo conta</div></div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_.75fr]">
        <section className="rise rise-delay-1"><SectionLabel action={<Link href="/agenda" className="inline-flex items-center gap-1 text-xs font-bold text-[hsl(var(--primary))]" data-testid="link-see-agenda">Ver agenda <ArrowRight size={14} /></Link>}>Próximos encontros</SectionLabel><div className="space-y-4">{classes.map((item) => <ClassCard key={item.id} item={item} attendance={attendance[item.id]} onAttendance={(status) => setAttendance((current) => ({ ...current, [item.id]: status }))} expanded={expanded === item.id} onExpand={() => setExpanded(expanded === item.id ? null : item.id)} downloaded={Boolean(downloads[item.id])} onDownload={() => setDownloads((current) => ({ ...current, [item.id]: !current[item.id] }))} />)}</div></section>
        <aside className="space-y-5">
          <section className="rise rise-delay-2 rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><SectionLabel>Seu cuidado</SectionLabel><HeartPulse size={18} className="text-[hsl(var(--accent))]" /></div><div className="mt-1 flex items-end justify-between"><div><div className="font-serif text-4xl tracking-[-.05em]" data-testid="text-weekly-attendance">{confirmedCount}<span className="text-xl text-muted-foreground">/3</span></div><p className="mt-1 text-xs text-muted-foreground">encontros confirmados</p></div><div className="text-right"><div className="text-sm font-bold text-[hsl(var(--primary))]">Bom ritmo</div><p className="mt-1 text-xs text-muted-foreground">esta semana</p></div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-[hsl(var(--muted))]"><div className="h-full rounded-full bg-[hsl(var(--primary))] transition-all duration-500" style={{ width: `${Math.max(12, confirmedCount / 3 * 100)}%` }} /></div><Link href="/ficha" className="mt-5 flex items-center justify-between rounded-xl bg-[hsl(var(--muted)/.65)] p-3 text-xs font-bold hover:bg-muted" data-testid="link-health-summary"><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-[hsl(var(--primary))]" /> Tudo está atualizado</span><ArrowRight size={14} /></Link></section>
          <section className="rise rise-delay-3 rounded-2xl border border-border bg-card p-5 shadow-sm"><SectionLabel action={<button className="rounded-lg p-1 text-muted-foreground hover:bg-muted" onClick={() => setReminderOptions(!reminderOptions)} aria-expanded={reminderOptions} aria-label="Mais opções de lembretes" data-testid="button-reminder-options"><MoreHorizontal size={17} /></button>}>Lembrete gentil</SectionLabel><div className="flex gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--secondary))]"><Bell size={17} className="text-[hsl(var(--foreground))]" /></div><div><p className="text-sm font-bold">Preparar a bolsa</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Lembrar 1 hora antes da próxima aula.</p></div></div>{reminderOptions && <div className="mt-4 rounded-xl bg-[hsl(var(--muted)/.65)] p-3 text-xs leading-5 text-muted-foreground rise" data-testid="panel-reminder-options">Você recebe lembretes no aplicativo. Para alterar o horário, procure a equipe na recepção.</div>}<button className={`mt-4 flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-bold ${reminders ? 'border-[hsl(var(--primary)/.28)] bg-[hsl(var(--primary)/.07)] text-[hsl(var(--primary))]' : 'border-border text-muted-foreground'}`} onClick={() => setReminders(!reminders)} aria-pressed={reminders} data-testid="button-toggle-reminders"><span>{reminders ? 'Lembretes ativados' : 'Ativar lembretes'}</span><span className={`h-5 w-9 rounded-full p-0.5 ${reminders ? 'bg-[hsl(var(--primary))]' : 'bg-muted'}`}><span className={`block h-4 w-4 rounded-full bg-card transition-transform ${reminders ? 'translate-x-4' : ''}`} /></span></button></section>
          <section className="rounded-2xl bg-[hsl(var(--sidebar))] p-5 text-[hsl(var(--sidebar-foreground))] shadow-sm"><div className="flex items-center gap-2 text-[hsl(var(--sidebar-primary))]"><Sparkles size={16} /><span className="text-xs font-bold uppercase tracking-[.12em]">Para levar hoje</span></div><p className="mt-4 font-serif text-xl leading-tight">“Movimento bom é o que cabe na sua vida.”</p><p className="mt-3 text-xs text-[hsl(var(--sidebar-foreground)/.6)]">— equipe MOVLINDA</p></section>
                  <section className="rounded-2xl bg-[hsl(var(--sidebar))] p-5 text-[hsl(var(--sidebar-foreground))] shadow-sm"><div className="flex items-center gap-2 text-[hsl(var(--sidebar-primary))]"><Sparkles size={16} /><span className="text-xs font-bold uppercase tracking-[.12em]">Para levar hoje</span></div><p className="mt-4 font-serif text-xl leading-tight">“Movimento bom é o que cabe na sua vida.”</p><p className="mt-3 text-xs text-[hsl(var(--sidebar-foreground)/.6)]">— equipe MOVLINDA</p></section>
        </aside>
      </div>
    </main>
  );
}

function AgendaPage({ attendance, setAttendance }: { attendance: Record<string, Attendance>; setAttendance: Dispatch<SetStateAction<Record<string, Attendance>>> }) {
  const [selected, setSelected] = useState('14 de maio');
  const [open, setOpen] = useState<string | null>('mobility-1');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const dates = ['13', '14', '15', '16', '17', '18', '19'];
  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 md:px-10 md:py-12">
      <PageHeading eyebrow="A semana com você" title="Minha agenda" description="Escolha um encontro, veja os detalhes e reserve seu lugar com tranquilidade." action={<div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1 shadow-sm"><button className="rounded-lg p-2 hover:bg-muted" onClick={() => setSelected('07 de maio')} aria-label="Semana anterior" data-testid="button-previous-week"><ChevronLeft size={17} /></button><span className="px-2 text-xs font-bold">Maio 2024</span><button className="rounded-lg p-2 hover:bg-muted" onClick={() => setSelected('21 de maio')} aria-label="Próxima semana" data-testid="button-next-week"><ChevronRight size={17} /></button></div>} />
      <div className="mb-8 grid grid-cols-7 gap-1 rounded-2xl border border-border bg-card p-2 shadow-sm sm:gap-2 sm:p-3">{dates.map((date, index) => { const label = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]; const active = date === '14'; return <button key={date} className={`rounded-xl px-1 py-3 text-center transition-colors sm:py-4 ${active ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'hover:bg-muted'}`} onClick={() => setSelected(`${date} de maio`)} aria-pressed={active} data-testid={`button-date-${date}`}><div className="text-[10px] font-bold uppercase opacity-70">{label}</div><div className="mt-1 font-serif text-xl">{date}</div>{date === '14' && <div className={`mx-auto mt-2 h-1 w-1 rounded-full ${active ? 'bg-[hsl(var(--primary-foreground))]' : 'bg-[hsl(var(--accent))]'}`} />}</button>; })}</div>
      <div className="mb-6 flex items-center justify-between"><div><h2 className="font-serif text-2xl tracking-[-.035em]">{selected}</h2><p className="mt-1 text-xs text-muted-foreground">{filterAvailable ? 'Aulas com vagas' : '3 encontros disponíveis'}</p></div><button className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold shadow-sm hover:bg-muted ${filterAvailable ? 'border-[hsl(var(--primary)/.35)] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))]' : 'border-border bg-card'}`} onClick={() => setFilterAvailable(!filterAvailable)} aria-pressed={filterAvailable} data-testid="button-agenda-filter"><ListChecks size={15} /> {filterAvailable ? 'Com vagas' : 'Todos os tipos'}</button></div>
      <div className="grid gap-4 lg:grid-cols-3">{classes.filter((item) => !filterAvailable || item.spots !== '0 vagas').map((item, index) => <article key={item.id} className={`rounded-2xl border bg-card p-5 shadow-sm ${open === item.id ? 'border-[hsl(var(--primary)/.45)]' : 'border-border'}`} data-testid={`agenda-card-${item.id}`}><div className="flex items-start justify-between"><div><div className={`mb-3 inline-flex rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em] ${index === 0 ? 'bg-[hsl(var(--accent)/.18)] text-[hsl(var(--destructive))]' : index === 1 ? 'bg-[hsl(var(--primary)/.12)] text-[hsl(var(--primary))]' : 'bg-[hsl(var(--secondary))] text-foreground'}`}>{item.kind}</div><p className="text-2xl font-bold tracking-[-.04em]">{item.time}</p><h3 className="mt-2 text-base font-bold">{item.title}</h3></div><button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" onClick={() => setOpen(open === item.id ? null : item.id)} aria-expanded={open === item.id} aria-label={`Expandir ${item.title}`} data-testid={`button-expand-agenda-${item.id}`}><ChevronDown size={18} className={`transition-transform ${open === item.id ? 'rotate-180' : ''}`} /></button></div><div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground"><p className="flex items-center gap-2"><Clock3 size={14} /> {item.duration} · {item.room}</p><p className="mt-2 flex items-center gap-2"><UserRound size={14} /> {item.instructor}</p></div>{open === item.id && <div className="mt-4 rounded-xl bg-[hsl(var(--muted)/.6)] p-3 text-xs leading-5 text-muted-foreground rise"><p>{item.description}</p><button className="mt-3 inline-flex items-center gap-1.5 font-bold text-[hsl(var(--primary))]" onClick={() => setAttendance((current) => ({ ...current, [item.id]: current[item.id] === 'confirmed' ? 'cancelled' : 'confirmed' }))} data-testid={`button-agenda-attendance-${item.id}`}>{attendance[item.id] === 'confirmed' ? <><CheckCircle2 size={14} /> Presença confirmada</> : <>Reservar meu lugar <ArrowRight size={14} /></>}</button></div>}</article>)}</div>
    </main>
  );
}

function FichaPage() {
  const [conditions, setConditions] = useState({ knee: true, pressure: true, diabetes: false, balance: true });
  const [saved, setSaved] = useState(false);
  const toggle = (key: keyof typeof conditions) => { setConditions((current) => ({ ...current, [key]: !current[key] })); setSaved(false); };
  const conditionLabels = { knee: 'Sensibilidade no joelho direito', pressure: 'Pressão arterial controlada', diabetes: 'Diabetes tipo 2', balance: 'Atenção ao equilíbrio' };
  return (
    <main className="mx-auto max-w-[980px] px-5 py-8 md:px-10 md:py-12">
      <PageHeading eyebrow="Conhecer para cuidar" title="Minha ficha" description="Estas informações ajudam a equipe a preparar aulas mais seguras e confortáveis para você." action={<button className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-3 text-xs font-bold text-[hsl(var(--primary-foreground))] shadow-sm hover:brightness-95" onClick={() => setSaved(true)} data-testid="button-save-health-profile"><Check size={15} /> {saved ? 'Ficha atualizada' : 'Salvar alterações'}</button>} />
      <div className="grid gap-5 md:grid-cols-[.9fr_1.1fr]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm"><div className="flex items-center gap-4"><Avatar name="Lúcia Martins" /><div><h2 className="text-lg font-bold">Lúcia Martins</h2><p className="mt-1 text-xs text-muted-foreground">Participante desde março de 2023</p></div></div><div className="mt-7 space-y-4 border-t border-border pt-5"><div><p className="text-[10px] font-bold uppercase tracking-[.13em] text-muted-foreground">Data de nascimento</p><p className="mt-1 text-sm font-semibold">12 de agosto de 1952</p></div><div><p className="text-[10px] font-bold uppercase tracking-[.13em] text-muted-foreground">Contato de emergência</p><p className="mt-1 text-sm font-semibold">Marina Martins <span className="font-normal text-muted-foreground">· filha</span></p><p className="mt-1 text-xs text-muted-foreground">(11) 98871-2046</p></div></div><div className="mt-7 rounded-xl bg-[hsl(var(--secondary)/.65)] p-4"><div className="flex items-center gap-2 text-xs font-bold"><ShieldCheck size={15} className="text-[hsl(var(--primary))]" /> Dados protegidos</div><p className="mt-2 text-xs leading-5 text-muted-foreground">Somente a equipe MOVLINDA acessa o que você compartilha aqui.</p></div></section>
                  <section className="rounded-2xl border border-border bg-card p-6 shadow-sm"><div className="flex items-center gap-4"><Avatar name="Lúcia Martins" /><div><h2 className="text-lg font-bold">Lúcia Martins</h2><p className="mt-1 text-xs text-muted-foreground">Participante desde março de 2023</p></div></div><div className="mt-7 space-y-4 border-t border-border pt-5"><div><p className="text-[10px] font-bold uppercase tracking-[.13em] text-muted-foreground">Data de nascimento</p><p className="mt-1 text-sm font-semibold">12 de agosto de 1952</p></div><div><p className="text-[10px] font-bold uppercase tracking-[.13em] text-muted-foreground">Contato de emergência</p><p className="mt-1 text-sm font-semibold">Marina Martins <span className="font-normal text-muted-foreground">· filha</span></p><p className="mt-1 text-xs text-muted-foreground">(11) 98871-2046</p></div></div><div className="mt-7 rounded-xl bg-[hsl(var(--secondary)/.65)] p-4"><div className="flex items-center gap-2 text-xs font-bold"><ShieldCheck size={15} className="text-[hsl(var(--primary))]" /> Dados protegidos</div><p className="mt-2 text-xs leading-5 text-muted-foreground">Somente a equipe MOVLINDA acessa o que você compartilha aqui.</p></div></section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="text-lg font-bold">Atenções importantes</h2><p className="mt-1 text-sm text-muted-foreground">Marque o que a equipe deve lembrar.</p></div><FileHeart size={20} className="text-[hsl(var(--accent))]" /></div><div className="mt-6 space-y-2">{(Object.keys(conditionLabels) as Array<keyof typeof conditions>).map((key) => <button key={key} className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${conditions[key] ? 'border-[hsl(var(--primary)/.35)] bg-[hsl(var(--primary)/.06)]' : 'border-border hover:bg-muted'}`} onClick={() => toggle(key)} aria-pressed={conditions[key]} data-testid={`button-condition-${key}`}><span className="flex items-center gap-3"><span className={`flex h-5 w-5 items-center justify-center rounded-md border ${conditions[key] ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border-border'}`}>{conditions[key] && <Check size={14} />}</span><span className="text-sm font-semibold">{conditionLabels[key]}</span></span>{conditions[key] && <span className="text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">Ativo</span>}</button>)}</div><div className="mt-5 flex items-start gap-2 rounded-xl border border-[hsl(var(--accent)/.35)] bg-[hsl(var(--accent)/.08)] p-3 text-xs leading-5 text-muted-foreground"><CircleHelp size={15} className="mt-0.5 shrink-0 text-[hsl(var(--destructive))]" /><span>Se algo mudar, avise a equipe antes da próxima aula. Você pode falar com a instrutora na chegada.</span></div></section>
      </div>
      <section className="mt-5 rounded-2xl border border-border bg-card p-6 shadow-sm"><SectionLabel action={<span className="rounded-full bg-[hsl(var(--primary)/.1)] px-2.5 py-1 text-[10px] font-bold text-[hsl(var(--primary))]">Última atualização: hoje</span>}>Como você tem se sentido</SectionLabel><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-[hsl(var(--muted)/.7)] p-4"><div className="flex items-center gap-2 text-[hsl(var(--primary))]"><Activity size={17} /><span className="text-xs font-bold">Disposição</span></div><p className="mt-3 font-serif text-2xl">Boa</p><p className="mt-1 text-xs text-muted-foreground">pronta para se mover</p></div><div className="rounded-xl bg-[hsl(var(--muted)/.7)] p-4"><div className="flex items-center gap-2 text-[hsl(var(--accent))]"><Target size={17} /><span className="text-xs font-bold">Objetivo</span></div><p className="mt-3 font-serif text-2xl">Equilíbrio</p><p className="mt-1 text-xs text-muted-foreground">mais confiança ao andar</p></div><div className="rounded-xl bg-[hsl(var(--muted)/.7)] p-4"><div className="flex items-center gap-2 text-[hsl(var(--primary))]"><ThumbsUp size={17} /><span className="text-xs font-bold">Último encontro</span></div><p className="mt-3 font-serif text-2xl">Muito bom</p><p className="mt-1 text-xs text-muted-foreground">mobilidade, 10 de maio</p></div></div></section>
    </main>
  );
}

type Message = { id: number; name: string; text: string; time: string; initials: string; tone: string; likes: number; liked: boolean };
const starterMessages: Message[] = [
  { id: 1, name: 'Cida Andrade', text: 'A aula de ontem fez um bem danado para as costas. Até amanhã, pessoal!', time: 'há 28 min', initials: 'CA', tone: 'coral', likes: 8, liked: false },
  { id: 2, name: 'Paulo Sérgio', text: 'Alguém mais vai para a Dança em roda no sábado? Posso chegar um pouco antes para tomar um café.', time: 'há 1 h', initials: 'PS', tone: 'gold', likes: 5, liked: false },
  { id: 3, name: 'Ana Luiza', text: 'Vocês estão indo muito bem. Lembrem: a pausa também faz parte do treino.', time: 'ontem', initials: 'AL', tone: 'teal', likes: 12, liked: false },
];

function ComunidadePage() {
  const [messages, setMessages] = useState(starterMessages);
  const [draft, setDraft] = useState('');
  const [posted, setPosted] = useState(false);
  const submit = () => { if (!draft.trim()) return; setMessages((current) => [{ id: Date.now(), name: 'Lúcia Martins', text: draft.trim(), time: 'agora', initials: 'LM', tone: 'teal', likes: 0, liked: false }, ...current]); setDraft(''); setPosted(true); setTimeout(() => setPosted(false), 2200); };
  const like = (id: number) => setMessages((current) => current.map((message) => message.id === id ? { ...message, liked: !message.liked, likes: message.likes + (message.liked ? -1 : 1) } : message));
  return (
    <main className="mx-auto max-w-[980px] px-5 py-8 md:px-10 md:py-12">
      <PageHeading eyebrow="Perto, mesmo de longe" title="Nossa comunidade" description="Um cantinho para trocar coragem, pequenas vitórias e companhia." action={<div className="flex -space-x-2"><Avatar name="Cida Andrade" small /><Avatar name="Paulo Sérgio" small /><Avatar name="Ana Luiza" small /></div>} />
      <div className="grid gap-8 md:grid-cols-[1.35fr_.65fr]">
        <div>
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex gap-3"><Avatar small /><div className="min-w-0 flex-1"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Compartilhe uma pequena vitória ou deixe um recado..." rows={3} className="w-full resize-none border-0 bg-transparent text-sm leading-6 outline-none placeholder:text-muted-foreground" data-testid="input-community-message" /><div className="flex items-center justify-between border-t border-border pt-3"><span className="text-[11px] text-muted-foreground">Escreva no seu ritmo.</span><button className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--primary-foreground))] disabled:cursor-not-allowed disabled:opacity-45" disabled={!draft.trim()} onClick={submit} data-testid="button-post-message"><Plus size={15} /> Publicar</button></div></div></div>{posted && <div className="mt-3 flex items-center gap-2 rounded-xl bg-[hsl(var(--primary)/.1)] p-3 text-xs font-bold text-[hsl(var(--primary))] rise" data-testid="status-message-posted"><CheckCircle2 size={15} /> Seu recado chegou à comunidade.</div>}</section>
          <div className="mt-5 space-y-3">{messages.map((message) => <article key={message.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm" data-testid={`message-card-${message.id}`}><div className="flex gap-3"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${message.tone === 'coral' ? 'bg-[hsl(var(--accent)/.3)]' : message.tone === 'gold' ? 'bg-[hsl(var(--secondary))]' : 'bg-[hsl(var(--primary)/.16)]'}`}>{message.initials}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-sm font-bold">{message.name}</h3><span className="text-[11px] text-muted-foreground">{message.time}</span></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{message.text}</p><button className={`mt-3 inline-flex items-center gap-1.5 text-xs font-bold ${message.liked ? 'text-[hsl(var(--accent))]' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => like(message.id)} aria-pressed={message.liked} data-testid={`button-like-message-${message.id}`}><ThumbsUp size={14} fill={message.liked ? 'currentColor' : 'none'} /> {message.likes} {message.likes === 1 ? 'apoio' : 'apoios'}</button></div></div></article>)}</div>
        </div>
        <aside className="space-y-4"><section className="rounded-2xl bg-[hsl(var(--sidebar))] p-5 text-[hsl(var(--sidebar-foreground))]"><div className="flex items-center gap-2 text-[hsl(var(--sidebar-primary))]"><UsersRound size={17} /><span className="text-xs font-bold uppercase tracking-[.13em]">Hoje por aqui</span></div><div className="mt-5 flex items-end gap-2"><span className="font-serif text-4xl">18</span><span className="pb-1 text-xs text-[hsl(var(--sidebar-foreground)/.62)]">pessoas em movimento</span></div><div className="mt-4 flex -space-x-2"><Avatar name="Marina Martins" small /><Avatar name="Rui Lima" small /><Avatar name="Bia Campos" small /><div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[hsl(var(--sidebar))] bg-[hsl(var(--sidebar-accent))] text-[10px] font-bold">+15</div></div></section><section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><SectionLabel>Combinado da casa</SectionLabel><ul className="space-y-4 text-sm"><li className="flex gap-3"><CheckCircle2 size={17} className="shrink-0 text-[hsl(var(--primary))]" /><span className="leading-5 text-muted-foreground">Acolher cada corpo e cada ritmo.</span></li><li className="flex gap-3"><CheckCircle2 size={17} className="shrink-0 text-[hsl(var(--primary))]" /><span className="leading-5 text-muted-foreground">Celebrar a presença, não a performance.</span></li><li className="flex gap-3"><CheckCircle2 size={17} className="shrink-0 text-[hsl(var(--primary))]" /><span className="leading-5 text-muted-foreground">Pedir ajuda quando precisar.</span></li></ul></section></aside>
      </div>
    </main>
  );
}

function InstructorPage() {
  const [present, setPresent] = useState<Record<string, boolean>>({ 'Cida Andrade': true, 'Paulo Sérgio': true, 'Marina Martins': false, 'Rui Lima': true, 'Nair Oliveira': false });
  const [note, setNote] = useState('');
  const [historyVisible, setHistoryVisible] = useState(false);
  const [planEditing, setPlanEditing] = useState(false);
  const [addedExercises, setAddedExercises] = useState<string[]>([]);
  const exerciseOptions = ['Caminhada lateral', 'Elevação de braços', 'Alongamento de panturrilha', 'Transferência de peso', 'Respiração coordenada'];
  const students = Object.keys(present);
  const presentCount = Object.values(present).filter(Boolean).length;
  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 md:px-10 md:py-12">
      <PageHeading eyebrow="Visão do instrutor" title="Bom dia, Rafael" description="Aqui está o pulso da sua próxima aula. Pequenos ajustes fazem uma grande diferença." action={<div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-bold shadow-sm"><span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" /> Aula em 42 min</div>} />
      <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-[hsl(var(--primary))] p-5 text-[hsl(var(--primary-foreground))]"><div className="flex items-center justify-between text-xs font-bold opacity-75">Presença hoje <ClipboardCheck size={17} /></div><div className="mt-5 font-serif text-4xl">{presentCount}<span className="text-xl opacity-60">/5</span></div><p className="mt-1 text-xs opacity-75">confirmados para Mobilidade</p></div><div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-bold text-muted-foreground">Alunos ativos <UsersRound size={17} className="text-[hsl(var(--accent))]" /></div><div className="mt-5 font-serif text-4xl">42</div><p className="mt-1 text-xs text-muted-foreground">+4 neste mês</p></div><div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between text-xs font-bold text-muted-foreground">Satisfação média <ThumbsUp size={17} className="text-[hsl(var(--primary))]" /></div><div className="mt-5 font-serif text-4xl">4,8<span className="text-xl text-muted-foreground">/5</span></div><p className="mt-1 text-xs text-muted-foreground">últimas 18 respostas</p></div></div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
         <section><SectionLabel action={<button className="inline-flex items-center gap-1 text-xs font-bold text-[hsl(var(--primary))]" onClick={() => setHistoryVisible(!historyVisible)} aria-expanded={historyVisible} data-testid="button-view-all-attendance">{historyVisible ? 'Ocultar histórico' : 'Ver histórico'} <ArrowRight size={14} /></button>}>Próxima aula · 09:30</SectionLabel>{historyVisible && <div className="mb-3 rounded-xl bg-[hsl(var(--secondary)/.55)] px-4 py-3 text-xs leading-5 text-muted-foreground rise" data-testid="panel-attendance-history"><span className="font-bold text-foreground">Últimos encontros:</span> 12 presenças em 14 aulas. A constância está crescendo.</div>}<div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--accent)/.18)]"><Dumbbell size={20} className="text-[hsl(var(--destructive))]" /></div><div><h2 className="font-bold">Mobilidade & equilíbrio</h2><p className="mt-1 text-xs text-muted-foreground">Sala Ipê · 14 de maio</p></div></div><span className="rounded-full bg-[hsl(var(--secondary))] px-2.5 py-1 text-[10px] font-bold">{presentCount} confirmados</span></div><div className="divide-y divide-border">{students.map((student) => <div className="flex items-center justify-between gap-3 px-5 py-4" key={student}><div className="flex items-center gap-3"><Avatar name={student} small /><div><p className="text-sm font-bold">{student}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{student === 'Marina Martins' ? 'atenção ao equilíbrio' : 'sem observações novas'}</p></div></div><button className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${present[student] ? 'bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]' : 'bg-muted text-muted-foreground'}`} onClick={() => setPresent((current) => ({ ...current, [student]: !current[student] }))} aria-pressed={present[student]} data-testid={`button-attendance-${student.toLowerCase().replaceAll(' ', '-')}`}>{present[student] ? <><Check size={14} /> Presente</> : <><Minus size={14} /> Marcar</>}</button></div>)}</div></div></section>
         <aside className="space-y-5"><section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><SectionLabel action={<button className="rounded-lg p-1 text-muted-foreground hover:bg-muted" onClick={() => setPlanEditing(!planEditing)} aria-pressed={planEditing} aria-label="Editar plano" data-testid="button-edit-plan"><MoreHorizontal size={17} /></button>}>Plano de hoje</SectionLabel><div className="space-y-3"><div className="flex items-center gap-3 rounded-xl bg-[hsl(var(--muted)/.65)] p-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary)/.14)] text-[hsl(var(--primary))]"><Play size={14} /></div><div><p className="text-xs font-bold">Aquecimento sentado</p><p className="mt-0.5 text-[11px] text-muted-foreground">8 min · respiração</p></div></div><div className="flex items-center gap-3 rounded-xl bg-[hsl(var(--muted)/.65)] p-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--accent)/.2)] text-[hsl(var(--destructive))]"><Activity size={14} /></div><div><p className="text-xs font-bold">Circuito de equilíbrio</p><p className="mt-0.5 text-[11px] text-muted-foreground">20 min · com apoio</p></div></div><div className="flex items-center gap-3 rounded-xl bg-[hsl(var(--muted)/.65)] p-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--secondary))] text-foreground"><Pause size={14} /></div><div><p className="text-xs font-bold">Volta à calma</p><p className="mt-0.5 text-[11px] text-muted-foreground">10 min · alongamento</p></div></div></div>{planEditing && <p className="mt-3 rounded-xl bg-[hsl(var(--primary)/.08)] p-3 text-xs font-bold text-[hsl(var(--primary))]" data-testid="status-plan-editing">Plano pronto para ajustes antes da aula.</p>}<button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-bold hover:bg-muted" onClick={() => setPlanEditing(!planEditing)} data-testid="button-add-exercise"><Plus size={14} /> {planEditing ? 'Concluir ajustes' : 'Adicionar exercício'}</button></section><section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><SectionLabel>Nota rápida da equipe</SectionLabel><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Anote algo para lembrar antes da aula..." rows={3} className="w-full resize-none rounded-xl border border-border bg-[hsl(var(--muted)/.5)] p-3 text-xs outline-none placeholder:text-muted-foreground focus:border-[hsl(var(--primary))]" data-testid="input-instructor-note" /><div className="mt-3 flex items-center justify-between"><span className="text-[11px] text-muted-foreground">{note ? 'Rascunho salvo localmente' : 'Visível apenas para a equipe'}</span><button className="text-xs font-bold text-[hsl(var(--primary))]" onClick={() => setNote('')} disabled={!note} data-testid="button-clear-instructor-note">Limpar</button></div></section></aside>
      </div>
      {planEditing && <section className="mt-8 rounded-2xl border border-[hsl(var(--primary)/.25)] bg-card p-5 shadow-sm rise" data-testid="panel-exercise-options">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold">Adicionar exercício</h2>
            <p className="mt-1 text-xs text-muted-foreground">Escolha uma atividade para incluir no plano de hoje.</p>
          </div>
          <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" onClick={() => setPlanEditing(false)} aria-label="Fechar opções de exercício" data-testid="button-close-exercise-options"><X size={16} /></button>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {exerciseOptions.map((exercise) => {
            const added = addedExercises.includes(exercise);
            return <button key={exercise} className={`flex items-center justify-between rounded-xl border px-3 py-3 text-left text-xs font-bold transition-colors ${added ? 'border-[hsl(var(--primary)/.35)] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))]' : 'border-border hover:bg-muted'}`} onClick={() => setAddedExercises((current) => added ? current.filter((item) => item !== exercise) : [...current, exercise])} aria-pressed={added} data-testid={`button-exercise-option-${exercise.toLowerCase().replaceAll(' ', '-')}`}>
              <span>{exercise}</span>{added ? <Check size={15} /> : <Plus size={15} />}
            </button>;
          })}
        </div>
        {addedExercises.length > 0 && <div className="mt-5 border-t border-border pt-4" data-testid="list-added-exercises">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">Adicionados ao plano</div>
          <div className="space-y-2">{addedExercises.map((exercise) => <div key={exercise} className="flex items-center justify-between rounded-xl bg-[hsl(var(--muted)/.65)] px-3 py-2.5 text-xs font-semibold"><span>{exercise}</span><button className="rounded-md p-1 text-muted-foreground hover:bg-card" onClick={() => setAddedExercises((current) => current.filter((item) => item !== exercise))} aria-label={`Remover ${exercise}`} data-testid={`button-remove-exercise-${exercise.toLowerCase().replaceAll(' ', '-')}`}><X size={14} /></button></div>)}</div>
        </div>}
      </section>}
    </main>
  );
}

function Toggle({ label, description, value, onChange, icon: Icon, testId }: { label: string; description: string; value: boolean; onChange: () => void; icon: typeof Volume2; testId: string }) {
  return <button className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-colors hover:border-[hsl(var(--primary)/.35)]" onClick={onChange} aria-pressed={value} data-testid={testId}><span className="flex items-start gap-4"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${value ? 'bg-[hsl(var(--primary)/.12)] text-[hsl(var(--primary))]' : 'bg-muted text-muted-foreground'}`}><Icon size={19} /></span><span><span className="block text-sm font-bold">{label}</span><span className="mt-1 block max-w-md text-xs leading-5 text-muted-foreground">{description}</span></span></span><span className={`flex h-6 w-11 shrink-0 rounded-full p-1 transition-colors ${value ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted-foreground)/.35)]'}`}><span className={`h-4 w-4 rounded-full bg-card transition-transform ${value ? 'translate-x-5' : ''}`} /></span></button>;
}

function SettingsPage({ preferences, setPreferences }: { preferences: Preferences; setPreferences: Dispatch<SetStateAction<Preferences>> }) {
  const update = (key: keyof Preferences) => setPreferences((current) => ({ ...current, [key]: !current[key] }));
  const [spoken, setSpoken] = useState(false);
  const [channel, setChannel] = useState<'app' | 'email'>('app');
  return (
    <main className="mx-auto max-w-[900px] px-5 py-8 md:px-10 md:py-12">
      <PageHeading eyebrow="Do seu jeito" title="Configurações" description="Ajuste a MOVLINDA para que ela acompanhe você com mais conforto." />
      <section><SectionLabel>Acessibilidade</SectionLabel><div className="space-y-3"><Toggle label="Texto maior" description="Aumenta o tamanho de textos e informações importantes em todo o aplicativo." value={preferences.largeType} onChange={() => update('largeType')} icon={Search} testId="button-toggle-large-type" /><Toggle label="Mais contraste" description="Deixa bordas, textos e estados mais marcados para facilitar a leitura." value={preferences.contrast} onChange={() => update('contrast')} icon={Sun} testId="button-toggle-contrast" /><Toggle label="Ler em voz alta" description="Mostra uma ação de leitura nos conteúdos principais para você ouvir quando preferir." value={preferences.readAloud} onChange={() => update('readAloud')} icon={Volume2} testId="button-toggle-read-aloud" /></div></section>
      <section className="mt-8"><SectionLabel>Como você prefere receber</SectionLabel><div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="text-sm font-bold">Lembretes de aula</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Receba um aviso 1 hora antes dos encontros confirmados.</p></div><button className={`flex h-6 w-11 shrink-0 rounded-full p-1 ${preferences.reminders ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted-foreground)/.35)]'}`} onClick={() => update('reminders')} aria-pressed={preferences.reminders} data-testid="button-settings-reminders"><span className={`h-4 w-4 rounded-full bg-card transition-transform ${preferences.reminders ? 'translate-x-5' : ''}`} /></button></div><div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4"><button className={`rounded-xl px-3 py-2 text-xs font-bold ${channel === 'app' ? 'bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]' : 'bg-muted text-muted-foreground'}`} onClick={() => setChannel('app')} aria-pressed={channel === 'app'} data-testid="button-reminder-channel-app"><Bell size={14} className="mr-1.5 inline" /> No aplicativo</button><button className={`rounded-xl px-3 py-2 text-xs font-bold ${channel === 'email' ? 'bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]' : 'bg-muted text-muted-foreground'}`} onClick={() => setChannel('email')} aria-pressed={channel === 'email'} data-testid="button-reminder-channel-email"><Mail size={14} className="mr-1.5 inline" /> E-mail</button></div></div></section>
      <section className="mt-8 rounded-2xl bg-[hsl(var(--sidebar))] p-6 text-[hsl(var(--sidebar-foreground))]"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-[hsl(var(--sidebar-primary))]"><Volume2 size={18} /><span className="text-xs font-bold uppercase tracking-[.14em]">Experimente agora</span></div><h2 className="mt-3 font-serif text-2xl">Ouça como fica</h2><p className="mt-2 max-w-md text-xs leading-5 text-[hsl(var(--sidebar-foreground)/.64)]">Toque para ouvir uma amostra de como os textos da MOVLINDA podem ser lidos.</p></div><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--sidebar-primary))] px-4 py-3 text-xs font-bold text-[hsl(var(--sidebar-primary-foreground))]" onClick={() => setSpoken(!spoken)} data-testid="button-play-read-aloud">{spoken ? <><Pause size={15} /> Pausar leitura</> : <><Play size={15} /> Ouvir amostra</>}</button></div>{spoken && <div className="mt-5 rounded-xl bg-[hsl(var(--sidebar-accent))] p-4 text-sm leading-6 rise" data-testid="status-read-aloud">“Bom dia, Lúcia. Sua próxima aula é Mobilidade e equilíbrio, hoje às nove e meia. Estamos esperando por você.”</div>}</section>
      <div className="mt-6 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" /><span>Suas preferências ficam salvas neste dispositivo. Você pode alterá-las quando quiser.</span></div>
    </main>
  );
}

function NotFoundPage() {
  return <main className="flex min-h-[70dvh] items-center justify-center px-5 text-center"><div><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--secondary))]"><CircleHelp size={25} /></div><h1 className="mt-5 font-serif text-3xl">Este caminho não existe</h1><p className="mt-2 text-sm text-muted-foreground">Mas o seu próximo movimento está por aqui.</p><Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-3 text-xs font-bold text-[hsl(var(--primary-foreground))]" data-testid="link-not-found-home">Voltar ao início <ArrowRight size={15} /></Link></div></main>;
}

function AppContent() {
  const [mode, setMode] = useState<Mode>('participant');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, Attendance>>({ 'mobility-1': 'pending', 'strength-2': 'pending', 'dance-3': 'pending' });
  const [preferences, setPreferences] = useState<Preferences>({ largeType: false, contrast: false, readAloud: false, reminders: true });
  const [location] = useLocation();
  const isInstructor = location === '/instrutor' || mode === 'instructor' && location === '/instrutor';
  const shellClass = useMemo(() => `page-shell grain ${preferences.largeType ? 'large-type' : ''} ${preferences.contrast ? 'high-contrast' : ''}`, [preferences.largeType, preferences.contrast]);
  return <div className={shellClass}><Sidebar mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} /><div className="min-h-[100dvh] md:pl-[268px]"><Topbar mode={isInstructor ? 'instructor' : mode} setMode={setMode} openMenu={() => setMobileOpen(true)} /><Switch><Route path="/"><HomePage attendance={attendance} setAttendance={setAttendance} reminders={preferences.reminders} setReminders={(value) => setPreferences((current) => ({ ...current, reminders: value }))} /></Route><Route path="/agenda"><AgendaPage attendance={attendance} setAttendance={setAttendance} /></Route><Route path="/ficha" component={FichaPage} /><Route path="/comunidade" component={ComunidadePage} /><Route path="/instrutor" component={InstructorPage} /><Route path="/configuracoes"><SettingsPage preferences={preferences} setPreferences={setPreferences} /></Route><Route component={NotFoundPage} /></Switch></div></div>;
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><AppContent /></WouterRouter>;
}

export default App;