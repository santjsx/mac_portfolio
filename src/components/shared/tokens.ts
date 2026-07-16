export const SPRING_PRESETS = {
  dock: {
    stiffness: 300,
    damping: 20
  },
  window: {
    stiffness: 260,
    damping: 24
  },
  page: {
    stiffness: 220,
    damping: 26
  }
};

export const REDUCED_MOTION_TRANSITION = {
  duration: 0.15,
  ease: "linear" as const
};

export interface AnimationConfig {
  springSnappy: any;
  springWindow: any;
  springPage: any;
}
