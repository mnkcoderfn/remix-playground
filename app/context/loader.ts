import { serviceRegistry, ServiceRegistry } from '../di/service-registry';

export interface LoaderContext {
  services: ServiceRegistry;
}

export function createLoaderContext(): LoaderContext {
  return {
    services: serviceRegistry,
  };
}

// Helper function to get services from context
export function getServices(context: LoaderContext): ServiceRegistry {
  return context.services;
}

// Convenience functions for common services
export function getUserService(context: LoaderContext) {
  return getServices(context).userService;
}

export function getValidateUtility(context: LoaderContext) {
  return getServices(context).validateUtility;
}

export function getDatabaseService(context: LoaderContext) {
  return getServices(context).databaseService;
} 