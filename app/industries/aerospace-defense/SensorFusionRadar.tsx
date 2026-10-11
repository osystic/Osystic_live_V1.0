"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Crosshair, Eye, RadioTower, Satellite } from "lucide-react";
import styles from "./aerospace-defense.module.css";
const tracks=[["TRK-17","EO / IR","0.91",styles.t1],["TRK-23","RF","0.78",styles.t2],["TRK-08","TELEMETRY","0.96",styles.t3]] as const;
export function SensorFusionRadar(){const reduce=useReducedMotion();return <motion.div className={styles.radar} initial={reduce?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.7}}>
  <div className={styles.radarHead}><span>MULTI-SENSOR FUSION</span><b>LIVE STATE</b></div>
  <div className={styles.scope}><i className={styles.r1}/><i className={styles.r2}/><i className={styles.r3}/><motion.span className={styles.sweep} animate={reduce?undefined:{rotate:360}} transition={{duration:5,repeat:Infinity,ease:"linear"}}/><div className={styles.fusion}><Crosshair size={27}/><strong>FUSED STATE</strong><small>CORRELATE / RESOLVE</small></div>
  {tracks.map(([id,label,conf,cls],i)=><motion.div key={id} className={`${styles.track} ${cls}`} initial={reduce?false:{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{delay:reduce?0:.3+i*.15}}><i/><div><b>{id}</b><span>{label}</span></div><small>{conf}</small></motion.div>)}
  <div className={styles.sensorA}><Satellite size={14}/> SPACE</div><div className={styles.sensorB}><RadioTower size={14}/> RF</div><div className={styles.sensorC}><Eye size={14}/> EO / IR</div>
  </div><div className={styles.radarFoot}><span>CORRELATION ACTIVE</span><span>3 SOURCES / 1 STATE</span></div>
</motion.div>}
