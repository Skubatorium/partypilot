# Testing Guidelines

## Test IDs

We use `data-testid` attributes for E2E testing with Cypress and component testing. These IDs follow a strict naming convention and are managed in `apps/frontend/src/types/test-ids.ts`.

### Naming Convention

All test IDs follow this pattern: `type-name-context?`

#### Types and Examples:

```typescript
// Buttons
button-submit-form
button-cancel-modal
button-edit-party

// Input Fields
input-email-signup
input-password-login
input-date-party

// Forms
form-login
form-signup
form-create-party

// Modals
modal-confirm-delete
modal-party-details
modal-settings

// Containers
container-main
container-sidebar
container-party-list

// Text Elements
text-error-message
text-welcome
text-party-title

// Pages
page-dashboard
page-settings
page-party-details

// Lists
list-parties
list-guests
list-items

// Navigation
nav-main
nav-sidebar
nav-footer
```

### Implementation Requirements

1. **Every Interactive Element Must Have a Test ID:**
   - Buttons
   - Forms
   - Input fields
   - Links
   - Interactive containers

2. **Every Major Container Should Have a Test ID:**
   - Page containers
   - Section containers
   - Modal containers
   - List containers

3. **Important Text Elements Should Have Test IDs:**
   - Error messages
   - Success messages
   - Important headings
   - Dynamic content

### Using Test IDs

1. Import the TestId enum:
```typescript
import { TestId } from './types/test-ids';
```

2. Use it in your components:
```typescript
<button data-testid={TestId.ButtonSubmitForm}>Submit</button>
```

### Adding New Test IDs

1. Add the new ID to `apps/frontend/src/types/test-ids.ts`
2. Follow the naming convention
3. Add a comment if the purpose isn't immediately clear
4. Group related IDs together

Example:
```typescript
export enum TestId {
  // Party Management
  ButtonCreateParty = 'button-create-party',
  FormCreateParty = 'form-create-party',
  InputPartyName = 'input-party-name',
  InputPartyDate = 'input-party-date',
  
  // Guest Management
  ButtonInviteGuest = 'button-invite-guest',
  InputGuestEmail = 'input-guest-email',
  ListGuests = 'list-guests',
}
```

### Best Practices

1. **Be Specific:**
   - Use descriptive names that clearly indicate the element's purpose
   - Include context when similar elements might exist in different areas

2. **Be Consistent:**
   - Use the same pattern for similar elements
   - Keep naming consistent across related components

3. **Think About Testing:**
   - Consider how the element will be targeted in tests
   - Make IDs unique enough to avoid conflicts
   - Make IDs descriptive enough to understand test failures

4. **Maintain the Enum:**
   - Keep the TestId enum organized and well-documented
   - Remove unused IDs
   - Group related IDs together

### Example Component

```tsx
function PartyForm() {
  return (
    <div data-testid={TestId.ContainerPartyForm}>
      <form data-testid={TestId.FormCreateParty}>
        <input
          type="text"
          data-testid={TestId.InputPartyName}
          placeholder="Party Name"
        />
        <input
          type="date"
          data-testid={TestId.InputPartyDate}
          placeholder="Date"
        />
        <button
          type="submit"
          data-testid={TestId.ButtonSubmitParty}
        >
          Create Party
        </button>
      </form>
    </div>
  )
}
```

### Common Test Scenarios

```typescript
// Cypress test example
describe('Party Creation', () => {
  it('should create a new party', () => {
    cy.get(`[data-testid=${TestId.ButtonCreateParty}]`).click();
    cy.get(`[data-testid=${TestId.InputPartyName}]`).type('Birthday Party');
    cy.get(`[data-testid=${TestId.InputPartyDate}]`).type('2024-12-31');
    cy.get(`[data-testid=${TestId.ButtonSubmitParty}]`).click();
    cy.get(`[data-testid=${TestId.ListParties}]`).should('contain', 'Birthday Party');
  });
});
``` 