# CI/CD Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### CI Workflow (`ci.yml`)

Runs on every pull request and push.

#### Jobs

**1. Test Job**
- Runs tests on Node.js 18.x and 20.x
- Executes linting checks
- Runs full test suite with coverage
- Uploads coverage reports to Codecov (Node 20.x only)

**2. Build Job**
- Builds the Next.js application
- Verifies build output exists
- Ensures production build is successful

**3. Type Check Job**
- Runs TypeScript compiler in no-emit mode
- Validates all type definitions
- Catches type errors before merge

#### Firebase Emulators

Both the test and build jobs use Firebase emulators running in Docker containers. This provides:

- **Isolated testing environment**: No need for real Firebase credentials
- **Consistent behavior**: Same environment across all CI runs
- **Cost-effective**: No Firebase usage costs during CI
- **Faster execution**: Local emulators are faster than cloud services

**Emulator Services:**
- Auth Emulator (port 9099)
- Firestore Emulator (port 8080)
- Storage Emulator (port 9199)

The Docker image `andreysenov/firebase-tools:latest` provides all Firebase emulators pre-configured.

#### Optional Secrets

- `CODECOV_TOKEN`: Token for uploading coverage reports to Codecov

#### Status Checks

All jobs must pass before a PR can be merged:
- ✅ Tests pass on Node 18.x and 20.x
- ✅ Linting passes
- ✅ Build succeeds
- ✅ Type checking passes

## Local Testing

Before pushing, run these commands locally to ensure CI will pass:

```bash
# Run linter
npm run lint

# Run tests
npm run test:ci

# Build application
npm run build

# Type check
npx tsc --noEmit
```

## Coverage Reporting

Test coverage is automatically uploaded to Codecov on Node.js 20.x runs. Coverage thresholds are configured in `jest.config.js`:

- Statements: 70%
- Branches: 70%
- Functions: 70%
- Lines: 70%

## Troubleshooting

**Build Failures**
- Check `.next` directory is generated
- Verify all dependencies are installed
- Check for TypeScript errors

**Test Failures**
- Run `npm run test:ci` locally
- Check test output for specific failures
- Ensure all mocks are properly configured

**Type Check Failures**
- Run `npx tsc --noEmit` locally
- Fix reported type errors
- Ensure all imports are correct
