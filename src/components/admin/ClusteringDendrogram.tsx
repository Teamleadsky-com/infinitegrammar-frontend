import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check } from "lucide-react";
import {
  linkageToTree,
  layoutDendrogram,
  assignClusterColors,
  collectNodes,
} from "@/lib/dendrogram";

interface ClusteringDendrogramProps {
  linkageMatrix: [number, number, number, number][];
  exerciseIds: string[];
  exerciseLabels: Record<string, { orderNumber: number | null; textPreview: string | null; createdAt?: string | null }>;
  onCopyId: (id: string) => void;
  copiedId: string | null;
}

const LEAF_LABEL_WIDTH = 220;
const PADDING_LEFT = 40;
const PADDING_TOP = 30;
const PADDING_BOTTOM = 10;
const LEAF_HEIGHT = 22;

export const ClusteringDendrogram = ({
  linkageMatrix,
  exerciseIds,
  exerciseLabels,
  onCopyId,
  copiedId,
}: ClusteringDendrogramProps) => {
  const [threshold, setThreshold] = useState([0.5]);

  const maxDistance = useMemo(() => {
    if (linkageMatrix.length === 0) return 1;
    return Math.max(...linkageMatrix.map((r) => r[2]));
  }, [linkageMatrix]);

  const { leaves, internals, colorMap, svgWidth, svgHeight, thresholdX, root } = useMemo(() => {
    const tree = linkageToTree(linkageMatrix, exerciseIds);
    const leafCount = tree.count;
    const h = Math.max(200, PADDING_TOP + PADDING_BOTTOM + leafCount * LEAF_HEIGHT);
    const w = Math.max(500, LEAF_LABEL_WIDTH + PADDING_LEFT + 300);

    layoutDendrogram(tree, {
      width: w,
      height: h,
      leafLabelWidth: LEAF_LABEL_WIDTH,
      paddingTop: PADDING_TOP,
      paddingBottom: PADDING_BOTTOM,
      paddingLeft: PADDING_LEFT,
    });

    const { leaves: l, internals: n } = collectNodes(tree);
    const colors = assignClusterColors(tree, threshold[0]);

    // Threshold line x position
    const usableWidth = w - LEAF_LABEL_WIDTH - PADDING_LEFT;
    const md = tree.distance || 1;
    const tx = PADDING_LEFT + (1 - threshold[0] / md) * usableWidth;

    return { leaves: l, internals: n, colorMap: colors, svgWidth: w, svgHeight: h, thresholdX: tx, root: tree };
  }, [linkageMatrix, exerciseIds, threshold]);

  const shortId = (id: string) => id.length > 8 ? `...${id.slice(-6)}` : id;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()}.${d.getMonth() + 1}.${String(d.getFullYear()).slice(2)}`;
  };

  const leafLabel = (id: string) => {
    const info = exerciseLabels[id];
    const order = info?.orderNumber;
    const idPart = shortId(id);
    const label = order != null ? `#${order} ${idPart}` : idPart;
    const date = info?.createdAt ? formatDate(info.createdAt) : null;
    return date ? `${label}  ${date}` : label;
  };

  // Distance axis ticks
  const axisTicks = useMemo(() => {
    const md = root.distance || 1;
    const usableWidth = svgWidth - LEAF_LABEL_WIDTH - PADDING_LEFT;
    const count = Math.min(6, Math.max(3, Math.ceil(md / 0.1)));
    const step = md / count;
    const ticks: Array<{ x: number; label: string }> = [];
    for (let i = 0; i <= count; i++) {
      const d = i * step;
      const x = PADDING_LEFT + (1 - d / md) * usableWidth;
      ticks.push({ x, label: d.toFixed(2) });
    }
    return ticks;
  }, [root, svgWidth]);

  if (exerciseIds.length < 3) return null;

  return (
    <Card className="p-6">
      <h4 className="font-semibold mb-1">Exercise Clustering</h4>
      <p className="text-xs text-muted-foreground mb-4">
        Hierarchical clustering by cosine distance. Exercises merged at lower distances are more similar.
        Adjust the threshold to identify clusters.
      </p>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Cluster threshold:</span>
        <Slider
          value={threshold}
          onValueChange={setThreshold}
          min={0}
          max={Math.ceil(maxDistance * 100) / 100}
          step={0.01}
          className="w-48"
        />
        <span className="text-xs tabular-nums w-10 text-right">{threshold[0].toFixed(2)}</span>
      </div>

      <div className="overflow-auto" style={{ maxHeight: 600 }}>
        <TooltipProvider delayDuration={100}>
          <svg width={svgWidth} height={svgHeight} className="select-none">
            {/* Distance axis */}
            <line
              x1={PADDING_LEFT} y1={14} x2={svgWidth - LEAF_LABEL_WIDTH} y2={14}
              stroke="#d1d5db" strokeWidth={1}
            />
            {axisTicks.map((t, i) => (
              <g key={i}>
                <line x1={t.x} y1={10} x2={t.x} y2={18} stroke="#9ca3af" strokeWidth={1} />
                <text x={t.x} y={8} textAnchor="middle" className="text-[10px] fill-muted-foreground">{t.label}</text>
              </g>
            ))}

            {/* Threshold line */}
            {threshold[0] < (root.distance || 1) && (
              <line
                x1={thresholdX} y1={PADDING_TOP - 10} x2={thresholdX} y2={svgHeight - PADDING_BOTTOM}
                stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6}
              />
            )}

            {/* Elbow connectors */}
            {internals.map((node) => {
              const color = colorMap.get(node.id) || '#9ca3af';
              const leftColor = colorMap.get(node.left!.id) || color;
              const rightColor = colorMap.get(node.right!.id) || color;

              return (
                <g key={node.id}>
                  {/* Vertical line at parent x */}
                  <line
                    x1={node.x} y1={node.left!.y} x2={node.x} y2={node.right!.y}
                    stroke={color} strokeWidth={1.5}
                  />
                  {/* Horizontal line to left child */}
                  <line
                    x1={node.left!.x} y1={node.left!.y} x2={node.x} y2={node.left!.y}
                    stroke={leftColor} strokeWidth={1.5}
                  />
                  {/* Horizontal line to right child */}
                  <line
                    x1={node.right!.x} y1={node.right!.y} x2={node.x} y2={node.right!.y}
                    stroke={rightColor} strokeWidth={1.5}
                  />

                  {/* Tooltip hitbox */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <rect
                        x={node.x - 6} y={node.y - 6}
                        width={12} height={12}
                        fill="transparent"
                        className="cursor-default"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">
                        Distance: {node.distance.toFixed(4)}<br />
                        Cluster size: {node.count} exercises
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </g>
              );
            })}

            {/* Leaf labels */}
            {leaves.map((leaf) => {
              const color = colorMap.get(leaf.id) || '#9ca3af';
              const id = leaf.exerciseId!;
              const isCopied = copiedId === id;
              const preview = exerciseLabels[id]?.textPreview;

              return (
                <Tooltip key={leaf.id}>
                  <TooltipTrigger asChild>
                    <g
                      className="cursor-pointer"
                      onClick={() => onCopyId(id)}
                    >
                      <circle cx={leaf.x} cy={leaf.y} r={3} fill={color} />
                      <text
                        x={leaf.x + 8} y={leaf.y + 4}
                        fill={color}
                        className="text-[11px] font-mono hover:underline"
                      >
                        {isCopied ? "Copied!" : leafLabel(id)}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="text-xs font-mono">{id}</p>
                    {preview && <p className="text-xs mt-1 max-w-xs">{preview}</p>}
                    <p className="text-xs text-muted-foreground mt-1">Click to copy</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </svg>
        </TooltipProvider>
      </div>
    </Card>
  );
};
