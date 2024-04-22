type Trigger = { type: "insteadOf" | "for", callback: (inserted?: any, deleted?: any) => Promise<void> };
export default Trigger;