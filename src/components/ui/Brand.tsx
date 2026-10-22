import { Zap } from "lucide-react";

export default function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand ${small ? "brand-small" : ""}`}>
      <Zap fill="currentColor" strokeWidth={0} aria-hidden="true" />
      <span>
        VOLT<span className="brand-period">®</span>
      </span>
    </span>
  );
}
