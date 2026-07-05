export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.28 } }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.24, ease: "easeOut" } }
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
};

export const cardHover = {
  y: -4,
  transition: { duration: 0.2, ease: "easeOut" }
};

export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: "easeOut" }
};

export const mapMarkerPulse = {
  scale: [1, 1.55, 1],
  opacity: [0.3, 0, 0.3]
};

export const modalAnimation = {
  hidden: { opacity: 0, scale: 0.97, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22 } },
  exit: { opacity: 0, scale: 0.98, y: 8, transition: { duration: 0.18 } }
};
