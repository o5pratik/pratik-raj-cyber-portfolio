"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Hud from "@/components/Hud";
import { Section } from "@/components/Section";
import { achievements, projects, skills, timeline } from "@/data/portfolio";

const CyberScene = dynamic(() => import("@/components/CyberScene"), { ssr: false });

const fade = { initial: { opacity: 0, y: 26 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .2 }, transition: { duration: .7 } };
export default function Home() {
  const [started, setStarted] = useState(false); const [activeSkill, setActiveSkill] = useState("Select a node to inspect capability data."); const [showEmail, setShowEmail] = useState(false);
  const assetBase = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? "";
  const bootLine = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll(); const skyShift = useTransform(scrollY, [0, 900], [0, 180]);
  useEffect(() => { if (bootLine.current) gsap.fromTo(bootLine.current, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 1.35, ease: "power3.out" }); }, []);
  return <main id="top" className={started ? "started" : ""}>
    <motion.div className="grid-floor" style={{ y: skyShift }} /><div ref={bootLine} className="boot-line" />
    <Hud />
    <section className="hero">
      <CyberScene /><div className="hero-rain" aria-hidden="true" /><img className="hero-character" src={`${assetBase}/images/cyber-engineer.png`} alt="" aria-hidden="true" />
      <div className="hero-eyebrow">// PLAYER ONE IDENTIFIED <b>◉</b></div>
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9 }}>PRATIK<span>RAJ</span></motion.h1>
      <motion.div className="hero-roles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55 }}>ENGINEERING STUDENT <i /> SOFTWARE DEVELOPER <i /> CONTENT CREATOR</motion.div>
      <p>Step into my neon city: a digital world where code, curiosity, and ambition become real experiences.</p>
      <button className="start" onClick={() => { setStarted(true); document.querySelector("#profile")?.scrollIntoView({ behavior: "smooth" }); }}>START EXPERIENCE <span>→</span></button>
      <div className="hero-signal"><span>NEON CITY // 2099</span><b>01</b><i>ENGINEER ONLINE</i></div>
      <div className="hero-meta"><span>SECTOR // INDIA</span><span>BUILD 2026.08</span><span>STATUS // OPEN TO QUESTS</span></div>
    </section>
    <div className="content">
      <Section id="profile" kicker="01 / PLAYER PROFILE" title="COMMAND CENTER">
        <motion.div className="profile-grid" {...fade}><div className="avatar"><div className="avatar-face">PR</div><span>AVATAR LOADING</span><em>◈</em></div><div className="profile-copy"><div className="role-tag">LEVEL 02 // ENGINEER</div><h3>Pratik Raj<span>Engineering student and software developer.</span></h3><p>I turn complex ideas into practical digital products through software engineering and app development.</p><div className="xp"><div><span>EXPERIENCE POINTS</span><b>680 / 1000 XP</b></div><i><em /></i><small>NEXT CLASS UNLOCK: PRODUCT ENGINEER</small></div></div><div className="stat-stack">{[["CLASS", "SOFTWARE DEVELOPER"], ["FOCUS", "APP DEVELOPMENT"], ["HOBBY", "CONTENT CREATION"]].map(([a,b]) => <div key={a}><small>{a}</small><strong>{b}</strong></div>)}</div></motion.div>
        <motion.div className="ambassador-panel" {...fade} transition={{ delay: .15 }}><div><span>// CAMPUS ALLIANCES</span><h3>CAMPUS AMBASSADOR</h3><p>Building connections between ambitious students and the technology community.</p></div><div className="ambassador-orgs"><article><b>KREO</b><span>CAMPUS AMBASSADOR</span><strong>2025</strong></article><article><b>SOLULAB</b><span>CAMPUS AMBASSADOR</span><strong>2026</strong></article></div></motion.div>
      </Section>
      <Section id="skills" kicker="02 / ABILITY MAP" title="SKILL TREE">
        <div className="skill-layout"><motion.div className="skill-map" {...fade}>{skills.map((branch, i) => <div className="skill-branch" key={branch.group}><div className="branch-label"><b>{branch.icon}</b>{branch.group}</div><div className="nodes">{branch.nodes.map(([name, desc]) => <button key={name} onMouseEnter={() => setActiveSkill(desc)} onFocus={() => setActiveSkill(desc)} onClick={() => setActiveSkill(desc)}>{name}</button>)}</div></div>)}</motion.div><aside className="inspector"><span>NODE INSPECTOR</span><div className="reticle">⌾</div><p>{activeSkill}</p><small>HOVER TO SCAN</small></aside></div>
      </Section>
      <Section id="projects" kicker="03 / BUILDING INDEX" title="PROJECT DISTRICT">
        <div className="projects">{projects.map((project, i) => <motion.article className={`project ${project.color}`} key={project.name} {...fade} transition={{ delay: i * .12 }}><div className="building"><span>PROJECT<br />{project.code}</span><i /><i /><i /></div><div className="project-body"><small>DEPLOYED CONCEPT // {project.code}</small><h3>{project.name}</h3><p>{project.desc}</p>{project.contribution && <p className="contribution">{project.contribution}</p>}<div className="chips">{project.tech.map(t => <span key={t}>{t}</span>)}</div><div className="project-links"><a href={project.github ?? "#contact"} target={project.github ? "_blank" : undefined} rel={project.github ? "noreferrer" : undefined}>GITHUB ↗</a><a href={project.demo ?? "#contact"} target={project.demo ? "_blank" : undefined} rel={project.demo ? "noreferrer" : undefined}>DEMO ↗</a></div></div></motion.article>)}</div>
      </Section>
      <Section id="creator" kicker="04 / CREATOR ARENA" title="SIGNAL & INFLUENCE">
        <motion.div className="creator-grid" {...fade}><div className="social-card"><div className="social-top"><span>◉ INSTAGRAM</span><b>CREATOR SPACE</b></div><div className="metric"><strong>YOUR</strong><span>CONTENT<br />UNIVERSE</span></div><p>Content creation is my creative hobby—a separate space to share interests, ideas, and moments beyond my engineering work.</p><a href="https://www.instagram.com/o5_pratik" target="_blank" rel="noreferrer">OPEN CHANNEL ↗</a></div><div className="dashboard">{[["REACH", "∞", "EXPANDING"], ["VIEWS", "01M+", "POTENTIAL"], ["POSTS", "ACTIVE", "CREATING"]].map(([a,b,c], i) => <div className="dash-card" key={a}><small>{a}</small><strong>{b}</strong><span>{c} <i /></span></div>)}<div className="categories"><small>CONTENT CATEGORIES</small><p>LIFESTYLE <i /> CREATIVITY <i /> ENTERTAINMENT <i /> PERSONAL JOURNEY</p></div></div></motion.div>
      </Section>
      <Section id="achievements" kicker="05 / VAULT UNLOCKED" title="ACHIEVEMENT HALL">
        <div className="trophies">{achievements.map((name, i) => <motion.div className="trophy" key={name} {...fade} transition={{ delay: i * .1 }}><div className="trophy-icon">{["◈", "⌘", "✦", "◉", "⬡"][i]}</div><span>ACHIEVEMENT {String(i + 1).padStart(2, "0")}</span><h3>{name}</h3><small>UNLOCKED <b>●</b></small></motion.div>)}</div>
      </Section>
      <Section id="timeline" kicker="06 / MISSION HISTORY" title="THE PATH FORWARD">
        <div className="timeline">{timeline.map(([year, title, desc], i) => <motion.div className="time" key={title} {...fade} transition={{ delay: i * .12 }}><div className="time-dot"><i /></div><div className="time-year">{year}</div><h3>{title}</h3><p>{desc}</p></motion.div>)}</div>
      </Section>
      <section id="contact" className="portal"><div className="portal-ring" /><div className="portal-copy"><span>// FINAL TRANSMISSION</span><h2>READY FOR THE<br />NEXT <em>QUEST?</em></h2><p>Let’s build a future-facing project that deserves to be remembered.</p><div className="portal-actions"><button className="primary" onClick={() => setShowEmail(value => !value)} aria-expanded={showEmail}>CONTACT ME ↗</button><a href="https://github.com/o5pratik" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="https://www.instagram.com/o5_pratik" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href="https://www.linkedin.com/in/pratik-raj-1330b8376" target="_blank" rel="noreferrer">LINKEDIN ↗</a></div>{showEmail && <div className="contact-reveal" role="status"><span>EMAIL CHANNEL OPEN</span><a href="mailto:prarik23raj@gmail.com">prarik23raj@gmail.com</a></div>}</div></section>
      <footer>PRATIK RAJ // DIGITAL UNIVERSE <span>© 2026</span></footer>
    </div>
  </main>;
}
