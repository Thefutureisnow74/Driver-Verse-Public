# Email Templates

This directory contains all email templates used throughout the Driver Gigs application, organized by category.

## Structure

```
src/emails/
├── auth/                    # Authentication-related emails
│   ├── email-verification.ts   # Email verification template
│   ├── password-reset.ts       # Password reset template
│   └── index.ts                # Auth templates exports
├── index.ts                    # Main exports file
└── README.md                   # This file
```

## Usage

### Importing Templates

```typescript
// Import specific templates
import { emailVerificationTemplate, passwordResetTemplate } from '@/emails/auth';

// Or import all auth templates
import * as authTemplates from '@/emails/auth';

// Or import from main index
import { emailVerificationTemplate } from '@/emails';
```

### Using Templates

Each template is a function that accepts props and returns an email object with `subject`, `text`, and `html` properties:

```typescript
// Email verification example
const emailContent = emailVerificationTemplate({
  user: {
    email: 'user@example.com',
    name: 'John Doe' // optional
  },
  url: 'https://app.drivergigs.com/verify?token=abc123',
  token: 'abc123'
});

// Send the email
await sendEmail({
  to: user.email,
  subject: emailContent.subject,
  text: emailContent.text,
  html: emailContent.html
});
```

## Template Categories

### Auth Templates (`/auth`)

Authentication-related email templates:

- **`emailVerificationTemplate`**: Welcome email with verification link
- **`passwordResetTemplate`**: Password reset email with secure link

## Template Structure

Each template follows this interface pattern:

```typescript
interface TemplateProps {
  user: {
    email: string;
    name?: string;
  };
  url: string;
  token: string;
  // Additional props specific to the template
}

export const templateName = (props: TemplateProps) => {
  return {
    subject: string;
    text: string;      // Plain text version
    html: string;      // HTML version
  };
};
```

## Design Guidelines

### HTML Templates

- **Responsive Design**: All templates use responsive CSS that works across email clients
- **Accessibility**: Proper semantic HTML with alt text and ARIA labels
- **Brand Consistency**: Uses Driver Gigs branding colors and typography
- **Fallback Support**: Always include plain text versions

### Styling

- **Inline CSS**: Email clients require inline styles for best compatibility
- **Web Fonts**: Uses system fonts with fallbacks for better compatibility
- **Colors**: 
  - Primary: `#007bff` (blue)
  - Danger: `#dc3545` (red)
  - Text: `#333` (dark gray)
  - Muted: `#666` (medium gray)

### Security

- **Link Safety**: All external links are properly formatted and validated
- **Token Handling**: Tokens are included in URLs but never exposed in readable text
- **Expiration**: Clear messaging about link expiration times

## Adding New Templates

1. **Create the template file** in the appropriate category folder
2. **Follow the naming convention**: `kebab-case.ts`
3. **Export from the category index**: Add to `auth/index.ts`
4. **Update main index**: Add category export if new
5. **Add TypeScript interfaces** for props
6. **Include both HTML and text versions**
7. **Test across email clients**

### Example New Template

```typescript
// src/emails/auth/welcome.ts
interface WelcomeTemplateProps {
  user: {
    email: string;
    name?: string;
  };
}

export const welcomeTemplate = ({ user }: WelcomeTemplateProps) => {
  const userName = user.name || user.email.split('@')[0];
  
  return {
    subject: 'Welcome to Driver Gigs!',
    text: `Welcome ${userName}! Thanks for joining Driver Gigs...`,
    html: `<!-- HTML content -->`
  };
};

export default welcomeTemplate;
```

## Testing

To test email templates:

1. **Visual Testing**: Use email client previews or tools like Litmus
2. **Functional Testing**: Test with actual email sending in development
3. **Responsive Testing**: Check templates on mobile and desktop
4. **Accessibility Testing**: Verify screen reader compatibility

## Future Enhancements

Planned template categories:

- **`/notifications`**: System notifications and alerts
- **`/marketing`**: Promotional and marketing emails  
- **`/system`**: System maintenance and status updates
- **`/transactional`**: Payment confirmations, receipts, etc.

## Best Practices

1. **Keep templates focused**: One template per email type
2. **Use consistent branding**: Follow the design system
3. **Optimize for mobile**: Test on small screens
4. **Include clear CTAs**: Make action buttons prominent
5. **Provide fallbacks**: Always include text versions
6. **Handle edge cases**: Account for missing user data
7. **Use semantic HTML**: Improve accessibility and deliverability
