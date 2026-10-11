"use client";
import { motion, useReducedMotion } from "framer-motion";
import { BatteryCharging, Cpu, Factory, Gauge, RadioTower, Wind, Zap } from "lucide-react";
import styles from "./energy-utilities.module.css";

const nodes = [
  [Wind,"GENERATION","VARIABLE SUPPLY",styles.n1],
  [Zap,"SUBSTATION","GRID STATE",styles.n2],
  [Cpu,"EDGE","LOCAL INFERENCE",styles.n3],
  [BatteryCharging,"STORAGE","DISPATCH",styles.n4],
  [RadioTower,"FIELD","TELEMETRY",styles.n5],
  [Factory,"ASSET","HEALTH SIGNAL",styles.n6],
] as const;

export function EnergyGridExperience() {
  const reduce = useReducedMotion();
  return <motion.div className={styles.gridConsole} initial={reduce?false:{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.7}}>
    <div className={styles.consoleHead}><span>GRID INTELLIGENCE / LIVE MODEL</span><b>OBSERVE</b></div>
    <div className={styles.gridCanvas}>
      <svg viewBox="0 0 760 520" preserveAspectRatio="none" aria-hidden="true">
        {["M105 130 C210 125 250 230 370 260","M650 125 C540 130 520 220 390 260","M110 405 C220 390 260 310 370 280","M650 405 C530 390 500 315 390 280","M380 260 L380 80","M380 280 L380 465"].map((d,i)=><motion.path key={d} d={d} initial={{pathLength:reduce?1:0}} animate={{pathLength:1}} transition={{duration:reduce?0:1,delay:i*.08}} />)}
      </svg>
      <motion.div className={styles.gridCore} animate={reduce?undefined:{boxShadow:["0 0 25px rgba(69,239,197,.1)","0 0 70px rgba(69,239,197,.3)","0 0 25px rgba(69,239,197,.1)"]}} transition={{duration:3,repeat:Infinity}}>
        <Gauge size={28}/><strong>GRID MODEL</strong><small>STATE / FORECAST / RISK</small>
      </motion.div>
      {nodes.map(([Icon,label,detail,cls],i)=><motion.div key={label} className={`${styles.gridNode} ${cls}`} initial={reduce?false:{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{delay:reduce?0:.25+i*.08}}>
        <Icon size={16}/><div><b>{label}</b><small>{detail}</small></div>
      </motion.div>)}
    </div>
    <div className={styles.consoleFoot}><span>TELEMETRY AVAILABLE</span><span>CONTROL BOUNDARY PRESERVED</span></div>
  </motion.div>;
}
