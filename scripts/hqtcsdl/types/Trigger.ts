type Trigger = (inserted?: any, deleted?: any) => Promise<void>;
export default Trigger;