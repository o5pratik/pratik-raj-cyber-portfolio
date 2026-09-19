"use client";
import { motion } from "framer-motion";
const links = [["PROFILE", "profile"], ["SKILLS", "skills"], ["PROJECTS", "projects"], ["CREATOR", "creator"], ["CONTACT", "contact"]];
export default function Hud() {
  return <><header className="hud"><a className="brand" href="#top">P<span>R</span><small>PORTFOLIO // 01</small></a><nav>{links.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav><a className="online" href="https://www.instagram.com/o5_pratik" target="_blank" rel="noreferrer"><b /> ONLINE</a></header>
  <motion.div className="scroll-cue" animate={{ y: [0, 8, 0], opacity: [.45, 1, .45] }} transition={{ repeat: Infinity, duration: 1.5 }}>SCROLL TO EXPLORE <span>↓</span></motion.div></>;
}
