import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  type EverythingPts,
  type PackupPts,
  clamp,
} from "@/data/cosmoArrowEditorModel";

function usePctDrag(
  boxRef: React.RefObject<HTMLDivElement | null>,
  dragKey: string | null,
  apply: (key: string, x: number, y: number) => void,
) {
  const move = useCallback(
    (ev: React.PointerEvent) => {
      const el = boxRef.current;
      if (!el || !dragKey) return;
      const r = el.getBoundingClientRect();
      const x = clamp(((ev.clientX - r.left) / r.width) * 100, 0, 100);
      const y = clamp(((ev.clientY - r.top) / r.height) * 100, 0, 100);
      apply(dragKey, x, y);
    },
    [boxRef, dragKey, apply],
  );
  return move;
}

const LABELS_EVERYTHING: Record<keyof EverythingPts, string> = {
  m: "Start",
  c1: "Curve 1",
  c2: "Curve 2",
  ce: "Curve end",
  end: "Arrow tip",
};

export function CosmoEverythingArrowHandles({
  pts,
  setPts,
}: {
  pts: EverythingPts;
  setPts: React.Dispatch<React.SetStateAction<EverythingPts>>;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dragKey, setDragKey] = useState<keyof EverythingPts | null>(null);

  const apply = useCallback(
    (key: string, x: number, y: number) => {
      const k = key as keyof EverythingPts;
      setPts((prev) => ({ ...prev, [k]: { x, y } }));
    },
    [setPts],
  );

  const move = usePctDrag(boxRef, dragKey, apply);

  const keys = (["m", "c1", "c2", "ce", "end"] as const).map((k) => ({
    key: k,
    pt: pts[k],
    label: LABELS_EVERYTHING[k],
  }));

  return (
    <div
      ref={boxRef}
      className="pointer-events-none absolute inset-0 z-[15]"
      onPointerLeave={() => setDragKey(null)}
      onPointerUp={() => setDragKey(null)}
      onPointerCancel={() => setDragKey(null)}
      onPointerMove={move}
    >
      {keys.map(({ key, pt, label }) => (
        <button
          key={key}
          type="button"
          aria-label={`Move ${label}`}
          title={label}
          className={cn(
            "pointer-events-auto absolute z-[16] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-md cursor-grab touch-none active:cursor-grabbing",
          )}
          style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragKey(key);
          }}
        />
      ))}
    </div>
  );
}

export function CosmoPackupArrowHandles({
  pts,
  setPts,
}: {
  pts: PackupPts;
  setPts: React.Dispatch<React.SetStateAction<PackupPts>>;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dragKey, setDragKey] = useState<keyof PackupPts | null>(null);

  const apply = useCallback(
    (key: string, x: number, y: number) => {
      const k = key as keyof PackupPts;
      setPts((prev) => ({ ...prev, [k]: { x, y } }));
    },
    [setPts],
  );

  const move = usePctDrag(boxRef, dragKey, apply);

  const keys = (["m", "q", "end"] as const).map((k) => ({
    key: k,
    pt: pts[k],
    label: k === "m" ? "Start" : k === "q" ? "Curve" : "Arrow tip",
  }));

  return (
    <div
      ref={boxRef}
      className="pointer-events-none absolute inset-0 z-[15]"
      onPointerLeave={() => setDragKey(null)}
      onPointerUp={() => setDragKey(null)}
      onPointerCancel={() => setDragKey(null)}
      onPointerMove={move}
    >
      {keys.map(({ key, pt, label }) => (
        <button
          key={key}
          type="button"
          aria-label={`Move ${label}`}
          title={label}
          className={cn(
            "pointer-events-auto absolute z-[16] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-md cursor-grab touch-none active:cursor-grabbing",
          )}
          style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragKey(key);
          }}
        />
      ))}
    </div>
  );
}
