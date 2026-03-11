/**
 * Pure functions for converting a scipy linkage matrix into a renderable dendrogram.
 * No React dependency — used by the ClusteringDendrogram component.
 */

export interface DendrogramNode {
  id: number;
  isLeaf: boolean;
  exerciseId?: string;
  distance: number;
  count: number;
  left?: DendrogramNode;
  right?: DendrogramNode;
  x: number;
  y: number;
}

/**
 * Convert a scipy-format linkage matrix into a binary tree.
 * Leaf indices 0..N-1 map to exerciseIds. Each row [a, b, distance, count]
 * creates internal node N+i by merging nodes a and b.
 */
export function linkageToTree(
  linkageMatrix: [number, number, number, number][],
  exerciseIds: string[]
): DendrogramNode {
  const N = exerciseIds.length;
  const nodes: Record<number, DendrogramNode> = {};

  for (let i = 0; i < N; i++) {
    nodes[i] = { id: i, isLeaf: true, exerciseId: exerciseIds[i], distance: 0, count: 1, x: 0, y: 0 };
  }

  for (let i = 0; i < linkageMatrix.length; i++) {
    const [a, b, distance, count] = linkageMatrix[i];
    nodes[N + i] = {
      id: N + i,
      isLeaf: false,
      distance,
      count,
      left: nodes[a],
      right: nodes[b],
      x: 0,
      y: 0,
    };
  }

  return nodes[N + linkageMatrix.length - 1];
}

export interface LayoutConfig {
  width: number;
  height: number;
  leafLabelWidth: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
}

/**
 * Assign x/y positions for a horizontal dendrogram.
 * Root at left, leaves at right. Y via in-order traversal.
 */
export function layoutDendrogram(root: DendrogramNode, config: LayoutConfig): void {
  const { width, height, leafLabelWidth, paddingTop, paddingBottom, paddingLeft } = config;
  const usableWidth = width - leafLabelWidth - paddingLeft;
  const usableHeight = height - paddingTop - paddingBottom;
  const maxDistance = root.distance || 1;
  const leafSpacing = usableHeight / (root.count - 1 || 1);

  let leafIndex = 0;

  function assignY(node: DendrogramNode): void {
    if (node.isLeaf) {
      node.y = paddingTop + leafIndex * leafSpacing;
      leafIndex++;
    } else {
      assignY(node.left!);
      assignY(node.right!);
      node.y = (node.left!.y + node.right!.y) / 2;
    }
  }

  function assignX(node: DendrogramNode): void {
    if (node.isLeaf) {
      node.x = paddingLeft + usableWidth;
    } else {
      node.x = paddingLeft + (1 - node.distance / maxDistance) * usableWidth;
      assignX(node.left!);
      assignX(node.right!);
    }
  }

  assignY(root);
  assignX(root);
}

const CLUSTER_COLORS = [
  '#6366f1', // indigo
  '#22c55e', // green
  '#f97316', // orange
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#eab308', // yellow
  '#8b5cf6', // violet
  '#ef4444', // red
];

/**
 * Assign cluster color indices based on a distance threshold.
 * Subtrees merging below the threshold share a color.
 */
export function assignClusterColors(
  root: DendrogramNode,
  threshold: number
): Map<number, string> {
  const colorMap = new Map<number, string>();
  let colorIndex = 0;

  function walk(node: DendrogramNode, color: string | null): void {
    if (node.isLeaf) {
      colorMap.set(node.id, color ?? CLUSTER_COLORS[colorIndex++ % CLUSTER_COLORS.length]);
      return;
    }

    if (node.distance > threshold) {
      // Above threshold — children are separate clusters
      colorMap.set(node.id, '#9ca3af'); // gray for cross-cluster links
      walk(node.left!, null);
      walk(node.right!, null);
    } else {
      // Below threshold — same cluster
      const c = color ?? CLUSTER_COLORS[colorIndex++ % CLUSTER_COLORS.length];
      colorMap.set(node.id, c);
      walk(node.left!, c);
      walk(node.right!, c);
    }
  }

  walk(root, null);
  return colorMap;
}

/**
 * Flatten tree into arrays of leaf and internal nodes for rendering.
 */
export function collectNodes(root: DendrogramNode): {
  leaves: DendrogramNode[];
  internals: DendrogramNode[];
} {
  const leaves: DendrogramNode[] = [];
  const internals: DendrogramNode[] = [];

  function walk(node: DendrogramNode): void {
    if (node.isLeaf) {
      leaves.push(node);
    } else {
      internals.push(node);
      walk(node.left!);
      walk(node.right!);
    }
  }

  walk(root);
  return { leaves, internals };
}
