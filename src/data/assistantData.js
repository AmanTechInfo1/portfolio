import { profile } from './profile';
import { skills, services } from './skills';
import { experience, education } from './experience';
import { projects } from './projects';

/* ────────────────────────────────────────────────────────
   AI Portfolio Assistant — Knowledge Base

   Every answer is derived from the existing portfolio data
   files. Never invent information here: this module is the
   single source of truth the assistant searches against.

   Suggested questions are also surfaced in the chat UI.
──────────────────────────────────────────────────────── */

const projectNames = projects.map((p) => p.name.toLowerCase());

// Normalize a query: lowercase + strip punctuation.
const normalize = (q) => q.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

const includesAny = (q, keywords) => keywords.some((k) => q.includes(k));
const topics = [
  {
    id: 'greeting',
    match: (q) => /\b(hi|hello|hey|namaste|yo|sup)\b/.test(q) && q.split(' ').length <= 6,
    answer: () =>
      `Hey! 👋 I'm Aman's portfolio assistant. I can tell you about his projects, skills, experience, services, and contact details. What would you like to know?`,
  },
  {
    id: 'who',
    match: (q) => includesAny(q, ['about aman', 'who is aman', 'who are you', 'tell me about aman', 'tell me about yourself', 'aman']) || /\b(he|him|developer)\b/.test(q),
    answer: () =>
      `${profile.name} is a ${profile.title}. ${profile.summary} Based in ${profile.location}, he specialises in ${profile.tagline}. ${profile.shortBio}`,
  },
  {
    id: 'technologies',
    match: (q) => includesAny(q, ['technolog', 'tech stack', 'stack', 'tools', 'languages', 'framework', 'library', 'mern', 'skill s']),
    answer: () => {
      const all = skills.map((g) => `${g.category}: ${g.skills.join(', ')}`);
      return `Aman's core stack is the MERN stack (MongoDB, Express.js, React, Node.js). Here's the full breakdown:\n\n${all.join('\n')}`;
    },
  },
  {
    id: 'projects',
    match: (q) => includesAny(q, ['project', 'portfolio work', 'what has he built', 'what did he build', 'case stud']),
    answer: () =>
      `Aman has built ${projects.length} notable projects:\n\n${projects
        .map((p, i) => `${i + 1}. ${p.name} — ${p.shortDescription}`)
        .join('\n\n')}\n\nAsk me about a specific project if you'd like more detail!`,
  },
  {
    id: 'project-specific',
    match: (q) =>
      projectNames.some((name) => q.includes(name)) ||
      includesAny(q, ['smartlearn', 'instructor', 'driving school', 'luxe', 'wordpress site']),
    answer: () => {
      const found = projects.find(
        (p) =>
          p.name.toLowerCase().split(' ').every((w) => q.includes(w)) ||
          projectNames.some((name) => name.includes(p.name.toLowerCase()) && q.includes(name))
      );
      if (!found) {
        return `Here are the projects available to ask about: ${projects.map((p) => p.name).join(', ')}.`;
      }
      const lines = [
        `**${found.name}**`,
        found.description,
        `\n**Role:** ${found.role} — ${found.duration}`,
        `\n**Technologies:** ${found.technologies.join(', ')}`,
        `\n**Key features:**`,
        ...found.features.map((f) => `• ${f}`),
      ];
      if (found.liveUrl) lines.push(`\n**Live:** ${found.liveUrl}`);
      if (found.architecture) {
        lines.push(`\n**Architecture:**`);
        Object.entries(found.architecture).forEach(([k, v]) => lines.push(`• ${k}: ${v}`));
      }
      return lines.join('\n');
    },
  },
  {
    id: 'experience',
    match: (q) => includesAny(q, ['experience', 'work history', 'career', 'job', 'employment', 'where has he worked', 'companies']),
    answer: () =>
      `Aman's experience:\n\n${experience
        .map(
          (e) =>
            `**${e.role}** — ${e.company} (${e.period})\n${e.type} · ${e.location}\n${e.description}\nHighlights: ${e.highlights.join(', ')}`
        )
        .join('\n\n')}\n\nEducation:\n\n${education
        .map((ed) => `**${ed.degree}** — ${ed.institution} (${ed.period})${ed.cgpa ? `, CGPA: ${ed.cgpa}` : ''}`)
        .join('\n')}`,
  },
  {
    id: 'education',
    match: (q) => includesAny(q, ['education', 'degree', 'college', 'university', 'qualification', 'study', 'bca']),
    answer: () => `Aman completed a ${education[0].degree} at ${education[0].institution} (${education[0].period}) with a CGPA of ${education[0].cgpa}.`,
  },
  {
    id: 'services',
    match: (q) => includesAny(q, ['service', 'offer', 'hire', 'work with', 'can he do', 'freelance', 'what does he', 'capabilit']),
    answer: () =>
      `Aman offers these services:\n\n${services
        .map((s, i) => `${i + 1}. **${s.title}** — ${s.description}`)
        .join('\n\n')}\n\nFor any of these, reach out via the contact form.`,
  },
  {
    id: 'contact',
    match: (q) => includesAny(q, ['contact', 'email', 'reach', 'message', 'hire him', 'get in touch', 'connect', 'phone', 'location', 'india']),
    answer: () =>
      `You can reach ${profile.name} at **${profile.email}** or use the contact form on the site (there's a dedicated Contact page).${
        profile.location ? ` He's based in ${profile.location} and works remotely.` : ''
      }`,
  },
  {
    id: 'resume',
    match: (q) => includesAny(q, ['resume', 'cv', 'curriculum', 'download resume']),
    answer: () =>
      `Aman's resume is available for download via the "Download Resume" buttons on the home page and hero section.`,
  },
  {
    id: 'payments',
    match: (q) => includesAny(q, ['payment', 'klarna', 'stripe', 'paypal', 'revolut', 'gateway']),
    answer: () =>
      `Aman has integrated production payment gateways including **Klarna**, **Stripe**, **PayPal**, and **Revolut**, with webhook handling. He's built tiered subscription systems, instalment plans, and automated billing cycles.`,
  },
  {
    id: 'ai',
    match: (q) => includesAny(q, ['ai', 'chatbot', 'openai', 'gpt']),
    answer: () =>
      `Aman integrated **OpenAI GPT** into SmartLearner for an AI-powered assistive chatbot. He designed a conversation context manager with session-based history and response caching to optimise API usage.`,
  },
  {
    id: 'workflow',
    match: (q) => includesAny(q, ['workflow', 'process', 'method', 'approach', 'how does he work']),
    answer: () =>
      `Aman's delivery cycle: **Understand → Plan → Architect → Build → Integrate → Test → Deploy**. He collaborates directly with clients to refine requirements and iterate on features throughout.`,
  },
  {
    id: 'website',
    match: (q) => includesAny(q, ['website', 'this site', 'portfolio built', 'built with']),
    answer: () =>
      `This portfolio is built with **React + Tailwind CSS + Three.js** (React Three Fiber + Drei), animated with Framer Motion and GSAP, and routed with React Router. The 3D hero scene uses Three.js.`,
  },
];

const fallbackAnswer = () =>
  `I don't have that information yet — I can only answer from Aman's portfolio data. Try asking about his projects, skills, experience, services, resume, or contact details. You could start with: "Tell me about Aman", "What technologies does he use?", or "Show me his projects".`;
export const suggestedQuestions = [
  'Tell me about Aman',
  'What technologies does Aman use?',
  'Show me his projects',
  'Tell me about SmartLearner',
  'What services does he offer?',
  'How can I contact him?',
];

export function getInitialMessages() {
  const greeting = `Hi 👋 I'm Aman's AI portfolio assistant. Ask me anything about his projects, skills, experience, services, or how to contact him.`;
  return [
    { id: 1, from: 'assistant', text: greeting },
    ...suggestedQuestions.map((q, i) => ({ id: i + 2, from: 'user', text: q })),
  ];
}

/* Returns the assistant reply for a given user query.
   onDone is invoked with the resulting text. */
export function getAssistantReply(query, onDone) {
  const q = normalize(query);
  const topic = topics.find((t) => t.match(q));
  const answer = topic ? topic.answer() : fallbackAnswer();
  onDone(answer);
}