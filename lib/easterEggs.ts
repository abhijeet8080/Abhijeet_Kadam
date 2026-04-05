/**
 * Easter egg terminal commands (see notepad/changes.txt).
 * Matching is case-insensitive after trim.
 */

export const EASTER_EGG_EVENT = "portfolio-terminal-easter-egg" as const

/** SessionStorage key — must match `components/vscode/terminal.tsx` consumer */
export const PENDING_TERMINAL_CMD_KEY = "portfolio-pending-terminal-cmd"

export type EasterEggPaletteItem = {
  id: string
  name: string
  section: string
}

/** Commands surfaced in the command palette → same `match` sent to the terminal */
export const EASTER_EGG_PALETTE: EasterEggPaletteItem[] = [
  { id: "ee-vim", name: "vim portfolio", section: "Easter eggs" },
  { id: "ee-ping", name: "ping google.com", section: "Easter eggs" },
  { id: "ee-ls", name: "ls -la", section: "Easter eggs" },
  { id: "ee-readme", name: "cat README.md", section: "Easter eggs" },
  { id: "ee-ssh", name: "ssh root@production", section: "Easter eggs" },
  { id: "ee-docker", name: "docker ps", section: "Easter eggs" },
  { id: "ee-kubectl", name: "kubectl get pods", section: "Easter eggs" },
  { id: "ee-htop", name: "htop", section: "Easter eggs" },

  { id: "ee-whoami", name: "whoami --verbose", section: "Easter eggs · story" },
  { id: "ee-history", name: "history", section: "Easter eggs · story" },
  { id: "ee-motd", name: "cat /etc/motd", section: "Easter eggs · story" },
  { id: "ee-man", name: "man abhijeet", section: "Easter eggs · story" },
  { id: "ee-fortune", name: "fortune", section: "Easter eggs · story" },
  { id: "ee-uptime", name: "uptime", section: "Easter eggs · story" },

  { id: "ee-grep", name: 'grep -r "bugs" ./portfolio', section: "Easter eggs · meta" },
  { id: "ee-git-blame", name: "git blame", section: "Easter eggs · meta" },
  { id: "ee-npm-audit", name: "npm audit", section: "Easter eggs · meta" },
  { id: "ee-curl", name: "curl -I abhijeet.dev", section: "Easter eggs · meta" },
  { id: "ee-eslint", name: "eslint .", section: "Easter eggs · meta" },
  { id: "ee-echo-stack", name: "echo $STACK", section: "Easter eggs · meta" },

  { id: "ee-spotify", name: "open -a spotify", section: "Easter eggs · extra" },
  { id: "ee-crontab", name: "crontab -l", section: "Easter eggs · extra" },
  { id: "ee-alias", name: "alias", section: "Easter eggs · extra" },
]

/** Map palette id → exact command string (must match normalizeCommand) */
export const EASTER_EGG_ID_TO_COMMAND: Record<string, string> = Object.fromEntries(
  [
    ["ee-vim", "vim portfolio"],
    ["ee-ping", "ping google.com"],
    ["ee-ls", "ls -la"],
    ["ee-readme", "cat README.md"],
    ["ee-ssh", "ssh root@production"],
    ["ee-docker", "docker ps"],
    ["ee-kubectl", "kubectl get pods"],
    ["ee-htop", "htop"],
    ["ee-whoami", "whoami --verbose"],
    ["ee-history", "history"],
    ["ee-motd", "cat /etc/motd"],
    ["ee-man", "man abhijeet"],
    ["ee-fortune", "fortune"],
    ["ee-uptime", "uptime"],
    ['ee-grep', 'grep -r "bugs" ./portfolio'],
    ["ee-git-blame", "git blame"],
    ["ee-npm-audit", "npm audit"],
    ["ee-curl", "curl -I abhijeet.dev"],
    ["ee-eslint", "eslint ."],
    ["ee-echo-stack", "echo $STACK"],
    ["ee-spotify", "open -a spotify"],
    ["ee-crontab", "crontab -l"],
    ["ee-alias", "alias"],
  ]
)

/** Normalize user input so easter eggs match (palette, terminal, pasted prompts). */
export function normalizeCommand(input: string): string {
  let s = input
    .trim()
    .normalize("NFKC")
    /* BOM / ZWSP / word joiner — common when pasting from docs */
    .replace(/[\uFEFF\u200B-\u200D\u2060]/g, "")
  /* Strip shell prompts: ASCII $ # > or fullwidth ＄ (U+FF04) — repeat for "$ $ cmd" */
  while (/^[\s\u00A0]*[\$＄#>]/.test(s)) {
    s = s.replace(/^[\s\u00A0]*[\$＄#>]\s*/, "")
  }
  s = s.replace(/\s+/g, " ")
  /* Curly / typographic quotes → ASCII (grep easter egg) */
  s = s.replace(/[\u201c\u201d\u201e\u201f\u00ab\u00bb]/g, '"')
  s = s.replace(/[\u2018\u2019\u201a\u201b]/g, "'")
  return s.trim()
}

/**
 * Match user input to an easter egg id. Compares against canonical strings at runtime
 * (avoids stale precomputed tables) with the same normalization on both sides.
 */
export function matchEasterEggId(input: string): string | null {
  const n = normalizeCommand(input).toLowerCase()
  if (!n) return null
  for (const [id, canonical] of Object.entries(EASTER_EGG_ID_TO_COMMAND)) {
    const c = normalizeCommand(canonical).toLowerCase()
    if (c && c === n) return id
  }
  return null
}

export const FORTUNE_QUOTES = [
  '"Premature optimization is the root of all evil." — Donald Knuth',
  '"Debugging is twice as hard as writing the code in the first place." — Brian Kernighan',
  '"The best error message is the one that never shows up." — Thomas Fuchs',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Any fool can write code that a computer can understand." — Martin Fowler',
  '"Simplicity is the soul of efficiency." — Austin Freeman',
  '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
  '"Make it work, make it right, make it fast." — Kent Beck',
  '"The only way to learn a new programming language is by writing programs in it." — Dennis Ritchie',
  '"Talk is cheap. Show me the code." — Linus Torvalds',
  '"Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday\'s code." — Christopher Thompson',
  '"Programs must be written for people to read, and only incidentally for machines to execute." — Harold Abelson',
  '"Good code is its own best documentation." — Steve McConnell',
  '"Fix the cause, not the symptom." — Steve Maguire',
  '"Learning to program has no more to do with designing interactive software than learning to touch type has to write poetry." — Ted Nelson',
]

export function randomFortune(): string {
  return FORTUNE_QUOTES[Math.floor(Math.random() * FORTUNE_QUOTES.length)] ?? FORTUNE_QUOTES[0]
}

/** Static multi-line output; vim / spotify handled in the terminal component */
export function getEasterEggStaticLines(id: string, now: Date = new Date()): string[] | null {
  switch (id) {
    case "ee-ping":
      return [
        "PING google.com (142.250.80.46) 56(84) bytes of data.",
        "64 bytes from nuq04s38-in-f14.1e100.net (142.250.80.46): icmp_seq=1 ttl=118 time=32.1 ms",
        "64 bytes from nuq04s38-in-f14.1e100.net (142.250.80.46): icmp_seq=2 ttl=118 time=28.4 ms",
        "64 bytes from nuq04s38-in-f14.1e100.net (142.250.80.46): icmp_seq=3 ttl=118 time=41.2 ms",
        "64 bytes from nuq04s38-in-f14.1e100.net (142.250.80.46): icmp_seq=4 ttl=118 time=29.0 ms",
        "",
        "--- google.com ping statistics ---",
        "4 packets transmitted, 4 received, 0% packet loss, time 3003ms",
      ]
    case "ee-ls":
      return [
        "total 32",
        "drwxr-xr-x  abhijeet  staff   4096  Mar 30 10:22 .",
        "drwxr-xr-x  abhijeet  staff   4096  Mar 28 09:01 ..",
        "-rw-r--r--  abhijeet  staff   1842  Mar 29 14:33 README.md",
        "drwxr-xr-x  abhijeet  staff   4096  Mar 30 11:02 bugbot/",
        "drwxr-xr-x  abhijeet  staff   4096  Mar 27 16:18 voice-agent/",
        "-rw-r--r--  abhijeet  staff    512  Mar 30 09:45 next.config.ts",
      ]
    case "ee-readme":
      return [
        "# portfolio3",
        "",
        "![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vercel](https://img.shields.io/badge/deploy-Vercel-black)",
        "",
        "Personal site styled like VS Code: explorer, tabs, terminal, command palette.",
        "",
        "## Install",
        "",
        "```bash",
        "npm install",
        "npm run dev",
        "```",
        "",
        "If you're reading this in a terminal, you've gone too far. Or just far enough.",
      ]
    case "ee-ssh":
      return [
        "The authenticity of host 'production (203.0.113.42)' can't be established.",
        "ED25519 key fingerprint is SHA256:oHg9SJZERpO3ZqNr0vC7EQl8eBrYqTx4AJ6xYk8pX.",
        "Are you sure you want to continue connecting (yes/no)? yes",
        "Warning: Permanently added 'production' (ED25519) to the list of known hosts.",
        "root@production's password:",
        "",
        "Connection established.",
        "",
        "  CPU: 2%    Load: 0.12 0.08 0.05",
        "  RAM: 340MB / 2GB    Disk: 42% used",
        "",
        "Just checking in. All systems operational.",
        "",
        "Connection to production closed.",
      ]
    case "ee-docker":
      return [
        "CONTAINER ID   IMAGE                    STATUS        PORTS",
        "a1b2c3d4e5f6   portfolio/bugbot-worker  Up 14 days    0.0.0.0:8787->8787/tcp",
        "b2c3d4e5f6a7   portfolio/voice-agent    Up 14 days    0.0.0.0:3001->3001/tcp",
        "c3d4e5f6a7b8   redis:7-alpine           Up 14 days    6379/tcp",
        "d4e5f6a7b8c9   postgres:16              Up 14 days    5432/tcp",
      ]
    case "ee-kubectl":
      return [
        "NAME                           READY   STATUS    RESTARTS   AGE",
        "bugbot-worker-7d9f8c6b5-xk2zp   1/1     Running   0          14d",
        "voice-agent-5c4b8d7f6-wzq9v     1/1     Running   0          14d",
        "redis-0                         1/1     Running   0          14d",
        "postgres-0                      1/1     Running   0          14d",
      ]
    case "ee-htop":
      return [
        "  CPU[|||||||||||||||||||||||||| 2.1%]   Tasks: 42, 128 thr, 0 kthr; 1 running",
        "  Mem[||||||||||||||||||||||||||340M/2G] Load average: 0.12 0.08 0.05",
        "  Swp[|                           0K/0K] Uptime: 14 days, 03:22:01",
        "",
        "  PID USER      PRI  NI  VIRT   RES   CPU% MEM%   TIME+  COMMAND",
        " 1337 abhijeet   20   0  2.1G  180M  0.1  8.5  12:04.12 typescript --watch portfolio",
        " 2042 abhijeet   20   0  890M   92M  0.0  4.2   0:42.33 node",
        " 3100 redis      20   0  128M   24M  0.0  1.1   4:12.88 redis-server",
      ]
    case "ee-whoami":
      return [
        "NAME:     Abhijeet Kadam",
        "ROLE:     Full Stack AI Engineer",
        "CURRENTLY: Building voice agents, PR automation, and Azure-backed systems @ AEOS Labs",
        "PREV_PROJECTS: Real-time telephony, RFQ AI, Graph + Prisma, distributed workers",
        "LOCATION:  Earth · remote-friendly",
        "STATUS:    open to interesting problems",
      ]
    case "ee-history":
      return [
        "  501  cd voice-agent && npm run dev",
        "  502  git push origin feat/barge-in",
        "  503  psql -d industrial_motion -c \"SELECT COUNT(*) FROM rfqs;\"",
        "  504  redis-cli MONITOR | head",
        "  505  kubectl logs -f deployment/bugbot-worker --tail=50",
        "  506  az webapp log tail --name api-prod",
        "  507  curl -s localhost:8787/health | jq .",
      ]
    case "ee-motd": {
      const banner = [
        "  ___  __  ____  __ __  _____  __",
        " / _ )/ / / / /_/ // /_/ __/ |/ /",
        "/ _  / /_/ /_  _//_  __/ _//    /",
        "/____/\\____/ /_/  /_/ /___/_/|_|",
      ].join("\n")
      return [
        banner,
        "",
        `Welcome, Abhijeet — ${now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
        "",
        '"Ship small, measure, iterate."',
        "",
        "All systems nominal. Have a productive session.",
      ]
    }
    case "ee-man":
      return [
        "ABHIJEET(1)                     User Commands                     ABHIJEET(1)",
        "",
        "NAME",
        "       abhijeet — Full Stack AI engineer, builder of voice and automation systems",
        "",
        "SYNOPSIS",
        "       abhijeet [--hire] [--coffee]",
        "",
        "DESCRIPTION",
        "       Designs and ships production AI: autonomous review agents, voice pipelines,",
        "       and backends on Azure. Comfortable from TypeScript to infra.",
        "",
        "OPTIONS",
        "       --hire    Signals availability for the right team or project.",
        "       --coffee  Increases throughput. No semver guarantee.",
        "",
        "BUGS",
        "       None known. Submit issues via kadamabhijeet021@gmail.com",
        "",
        "SEE ALSO",
        "       /projects/bugbot, /projects/voice-agent, contact(1)",
      ]
    case "ee-fortune":
      return [randomFortune()]
    case "ee-uptime":
      return [' up 23 years, 4 months, actively learning — load: inspiration 0.12, curiosity 0.99']
    case "ee-grep":
      return [
        "No results found.",
        '(we don\'t talk about the ones we fixed)',
      ]
    case "ee-git-blame":
      return ["All lines point to: Abhijeet Kadam <kadamabhijeet021@gmail.com>"]
    case "ee-npm-audit":
      return [
        "found 0 vulnerabilities",
        "(unlike your current portfolio)",
      ]
    case "ee-curl":
      return [
        "HTTP/2 200",
        "date: " + now.toUTCString(),
        "content-type: engineer/typescript",
        "x-powered-by: caffeine",
        "x-hire-me: true",
        "cache-control: no-cache",
      ]
    case "ee-eslint":
      return [
        "✓ 0 errors, 0 warnings",
        "(this is a lie but a necessary one)",
      ]
    case "ee-echo-stack":
      return ["TypeScript:Node.js:Hono:BullMQ:Redis:Prisma:Gemini:Azure"]
    case "ee-crontab":
      return [
        "# m h dom mon dow command",
        "0 9 * * *  drink --coffee",
        "*/30 * * * *  check --github-notifications",
        "0 0 * * 0  plan --week",
      ]
    case "ee-alias":
      return [
        "alias gp='git push'",
        "alias nrd='npm run dev'",
        "alias please='sudo'",
        "alias myip='echo 127.0.0.1  # nice try'",
      ]
    default:
      return null
  }
}
