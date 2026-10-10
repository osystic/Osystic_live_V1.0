import Link from "next/link";
import { ArrowRight, Globe2, MapPin, Waypoints } from "lucide-react";
import { siteConfig } from "../../config/site";

export function HomeDeliveryNetworkExperience(){
  return <section className="fh-delivery-network" aria-labelledby="fh-delivery-title">
    <div className="container-shell fh-delivery-grid">
      <div className="fh-delivery-copy">
        <span className="future-step">09 / GLOBAL DELIVERY</span>
        <span className="eyebrow">OPERATING NETWORK</span>
        <h2 id="fh-delivery-title">Distributed delivery. <span>Verified operating presence.</span></h2>
        <p>OSYSTIC operates from its United States business presence and delivers engineering engagements for clients across markets. Delivery is organized around project ownership, technical review, and clear communication.</p>
        <Link href="/about#global-operations" className="future-inline-link">View operating model <ArrowRight size={15}/></Link>
      </div>
      <div className="fh-delivery-map" aria-label="OSYSTIC operating network">
        <div className="fh-map-grid" aria-hidden="true"/>
        <div className="fh-map-core"><Waypoints size={25}/><b>OSYSTIC</b><small>DELIVERY NETWORK</small></div>
        <div className="fh-map-node node-us"><MapPin size={16}/><div><b>UNITED STATES</b><span>{siteConfig.address.line2}</span></div></div>
        <div className="fh-map-node node-global"><MapPin size={16}/><div><b>GLOBAL DELIVERY</b><span>CLIENT SYSTEMS / REMOTE COLLABORATION</span></div></div>
        <span className="fh-map-route route-a"/><span className="fh-map-route route-b"/>
        <div className="fh-map-status"><Globe2 size={16}/><span>PROJECT OWNERSHIP</span><b>CONNECTED</b></div>
      </div>
    </div>
    <div className="future-handoff"><span>09</span><i/><span>10</span><b>START A PROJECT</b></div>
  </section>
}
