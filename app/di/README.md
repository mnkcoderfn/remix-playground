# Dependency Injection Implementation

This directory contains the dependency injection (DI) implementation for the Remix 2.0 application.

## Overview

The DI system provides a clean way to manage dependencies and make services available throughout the application, particularly in route loaders and actions.

## Architecture

### Service Registry (`service-registry.ts`)
- Manages the lifecycle of services
- Provides lazy initialization of services
- Implements singleton pattern for service instances
- Includes a reset method for testing purposes

### Context Loader (`../context/loader.ts`)
- Creates loader context with injected services
- Provides convenience functions for accessing services
- Makes services available in route loaders and actions

## Services

### UserService
- Handles user authentication and registration
- Manages user data (currently in-memory, can be extended for database)
- Provides validation methods

### ValidateUtility
- Provides email validation
- Can be extended with additional validation methods

## Usage

### In Route Loaders
```typescript
export async function loader({ context }: LoaderFunctionArgs) {
  const loaderContext = createLoaderContext();
  const userService = getUserService(loaderContext);
  
  // Use the service
  const user = await userService.getUserByEmail('test@example.com');
  
  return json({ user });
}
```

### In Route Actions
```typescript
export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  
  const loaderContext = createLoaderContext();
  const validateUtility = getValidateUtility(loaderContext);
  
  if (!validateUtility.isValidEmail(email)) {
    return json({ error: "Invalid email" }, { status: 400 });
  }
  
  // Continue with action logic...
}
```

## Adding New Services

1. Create your service class
2. Add it to the `ServiceRegistry` interface
3. Implement the getter in `ServiceRegistryImpl`
4. Add convenience function in `loader.ts`

### Example:
```typescript
// In service-registry.ts
export interface ServiceRegistry {
  userService: UserService;
  validateUtility: ValidateUtility;
  emailService: EmailService; // New service
}

class ServiceRegistryImpl implements ServiceRegistry {
  // ... existing code ...
  
  get emailService(): EmailService {
    if (!this._emailService) {
      this._emailService = new EmailService();
    }
    return this._emailService;
  }
}

// In loader.ts
export function getEmailService(context: LoaderContext) {
  return getServices(context).emailService;
}
```

## Testing

The service registry includes a `reset()` method that can be used in tests to clear all service instances:

```typescript
import { serviceRegistry } from '~/di/service-registry';

beforeEach(() => {
  serviceRegistry.reset();
});
```

## Benefits

1. **Separation of Concerns**: Services are isolated and testable
2. **Dependency Management**: Clear dependency relationships
3. **Testability**: Easy to mock services for testing
4. **Extensibility**: Easy to add new services
5. **Type Safety**: Full TypeScript support
6. **Performance**: Lazy initialization of services 