"use client";
import { motion,useReducedMotion } from "framer-motion";
import { Activity,BatteryCharging,CarFront,Cpu,Network,Wifi } from "lucide-react";
import styles from "./automotive-mobility.module.css";
const nodes=[[Activity,"ADAS","PERCEPTION",styles.d1],[BatteryCharging,"ENERGY","BATTERY",styles.d2],[Cpu,"BODY","CONTROL",styles.d3],[Wifi,"CONNECT","V2X / CLOUD",styles.d4]] as const;
export function SDVCockpit(){const reduce=useReducedMotion();return <motion.div className={styles.sdv} initial={reduce?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.7}}>
  <div className={styles.sdvHead}><span>VEHICLE SOFTWARE STATE</span><b>ONLINE</b></div><div className={styles.sdvBody}><div className={styles.vehicle}><CarFront size={68}/><strong>SDV CORE</strong><small>VEHICLE ID / STATE / POLICY</small></div>
  {nodes.map(([Icon,label,detail,cls],i)=><motion.div key={label} className={`${styles.domain} ${cls}`} initial={reduce?false:{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{delay:reduce?0:.3+i*.1}}><Icon size={16}/><div><b>{label}</b><small>{detail}</small></div></motion.div>)}
  <div className={styles.net}><Network size={15}/> FLEET LINK</div></div><div className={styles.sdvFoot}><span>RELEASE 8.4.17</span><span>TELEMETRY STREAMING</span></div>
</motion.div>}
