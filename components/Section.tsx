import { ReactNode } from "react";
export function Section({ id, kicker, title, children, className = "" }: { id: string; kicker: string; title: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`section ${className}`}><div className="section-title"><span>{kicker}</span><h2>{title}</h2><i /></div>{children}</section>;
}
