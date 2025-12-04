// Simple global request manager to coordinate AbortControllers across the app

const controllers = new Set<AbortController>();

export const createController = (): AbortController => {
  const controller = new AbortController();
  controllers.add(controller);
  return controller;
};

export const registerController = (controller: AbortController): AbortController => {
  controllers.add(controller);
  return controller;
};

export const removeController = (controller: AbortController | null | undefined): void => {
  if (!controller) return;
  controllers.delete(controller);
};

export const abortAllControllers = (): void => {
  try {
    controllers.forEach((c) => {
      try { c.abort(); } catch (_) {}
    });
  } finally {
    controllers.clear();
  }
};

export default {
  createController,
  registerController,
  removeController,
  abortAllControllers,
};


