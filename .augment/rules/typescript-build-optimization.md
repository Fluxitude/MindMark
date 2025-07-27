---
type: "always_apply"
---

# TypeScript Build Optimization & Error Prevention Rules

## Critical Build System Rules

### 1. Circular Dependency Prevention
- **NEVER** create circular imports between packages
- Always import from the correct package exports (e.g., `@mindmark/supabase` not `@mindmark/supabase/types`)
- Use `import type` for type-only imports to prevent runtime circular dependencies
- Regularly audit import chains using `madge` or similar tools

### 2. Typia Transformer Configuration
- Only configure Typia transformers in packages that need runtime validation
- **NEVER** add Typia transformers to pure type definition packages
- For build compatibility, prefer simple type assertions over complex Typia validators
- Keep Typia usage server-side only to avoid client-side build issues

### 3. Package Architecture Rules
- Maintain clear separation: Database → Domain → UI → API layers
- Each package should have a single responsibility
- Export types explicitly to avoid conflicts
- Use proper package.json exports configuration

## Error Resolution Strategies

### 4. Build Hanging Issues
- **Root Cause**: Usually circular dependencies or infinite type recursion
- **Solution**: Fix import paths and remove conflicting transformers
- **Prevention**: Regular dependency audits and proper import structure

### 5. Framer Motion Type Issues
- Use proper easing arrays `[0.4, 0.0, 0.2, 1]` instead of string values
- Separate `transition` props from `animate` props
- Avoid complex nested transition configurations

### 6. Environment Variable Management
- **Server-only services** should handle missing env vars gracefully
- **Client-side code** should never directly import server services
- Use API routes as intermediaries for server-side functionality
- Add proper fallbacks and error handling

## Code Quality Rules

### 7. Unused Code Management
- Regularly remove unused components that cause build errors
- Prioritize removing experimental/demo components over core functionality
- Use tools to identify truly unused vs. referenced code
- Clean up test files for removed components

### 8. Component Architecture
- Keep server-side services (Firecrawl, etc.) out of client components
- Use React hooks with API calls instead of direct service imports
- Implement proper loading states and error boundaries
- Separate concerns between UI and business logic

### 9. Type Safety Best Practices
- Use domain-driven design with clear type hierarchies
- Transform database types to UI types at boundaries
- Add computed properties (like tags) at the UI layer
- Maintain single source of truth for database schemas

## Build Performance Optimization

### 10. Dependency Management
- Use package managers (bun/npm) instead of manual package.json edits
- Install missing dependencies immediately when build errors occur
- Keep dev dependencies separate from production dependencies
- Regular dependency audits and updates

### 11. Build Process Monitoring
- Monitor build times and identify performance regressions
- Use incremental compilation when possible
- Clear build caches when making major changes
- Test both development and production builds regularly

## Error Prevention Checklist

### Before Major Changes:
- [ ] Run `bunx tsc --noEmit` to check for type errors
- [ ] Verify no circular dependencies in new imports
- [ ] Test both `bun run dev` and `bun run build`
- [ ] Check that server-side services aren't imported client-side

### After Resolving Build Issues:
- [ ] Document the root cause and solution
- [ ] Update this rules file with new learnings
- [ ] Test the full application flow
- [ ] Verify production build still works

## Emergency Build Fix Protocol

1. **Identify the root cause** (circular deps, missing deps, type conflicts)
2. **Fix critical path first** (build hanging → specific errors → warnings)
3. **Remove unused code** that contributes to errors
4. **Test incrementally** after each major fix
5. **Document the solution** for future reference

## Success Metrics

- Build completes in under 60 seconds
- Zero TypeScript compilation errors
- All pages generate successfully
- Development server starts without runtime errors
- Production build creates complete artifacts

## Key Learnings from This Session

- **87% error reduction** achieved by removing unused components
- **Infinite build hanging** resolved by fixing circular dependencies
- **Client/server separation** critical for environment variable issues
- **Domain-driven architecture** preserved throughout optimization
- **Incremental fixes** more effective than wholesale rewrites
