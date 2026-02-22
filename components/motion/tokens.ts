// Centralized motion tokens to keep the UI feeling consistent.
// These values are tuned for a "clean iOS" spring: quick, controlled, and slightly bouncy.

export const springs = {
  /** Default UI spring: buttons, small panels, layout tweaks. */
  ui: { type: "spring", stiffness: 560, damping: 42, mass: 0.85 } as const,
  /** Slightly bouncier: modals/popovers, card entrances. */
  pop: { type: "spring", stiffness: 640, damping: 36, mass: 0.85 } as const,
  /** Softer: subtle layout shifts + list reflow. */
  soft: { type: "spring", stiffness: 420, damping: 42, mass: 1.0 } as const,
};

export const tweens = {
  fast: { type: "tween", duration: 0.16, ease: [0.2, 0.9, 0.2, 1] } as const,
  base: { type: "tween", duration: 0.22, ease: [0.2, 0.9, 0.2, 1] } as const,
  exit: { type: "tween", duration: 0.16, ease: [0.4, 0, 1, 1] } as const,
};
