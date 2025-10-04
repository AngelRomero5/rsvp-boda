# Form Backend Setup Instructions

## Formspree Integration

To enable the RSVP form functionality, you need to set up Formspree:

### Step 1: Create a Formspree Account
1. Go to [formspree.io](https://formspree.io)
2. Sign up for a free account
3. Create a new form

### Step 2: Get Your Form ID
1. After creating the form, you'll get a form ID (e.g., `xrgkqyvw`)
2. Copy this form ID

### Step 3: Update the Code
1. Open `src/Components/RSVP.tsx`
2. Find line 71: `const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {`
3. Replace `YOUR_FORM_ID` with your actual form ID
4. Example: `const response = await fetch('https://formspree.io/f/xrgkqyvw', {`

### Step 4: Test the Form
1. Run your development server: `npm run dev`
2. Fill out and submit the RSVP form
3. Check your Formspree dashboard for the submission

## Alternative: Netlify Forms

If you're deploying to Netlify, you can use Netlify Forms instead:

1. Add `netlify` attribute to your form:
```html
<form onSubmit={handleSubmit} autoComplete="off" netlify>
```

2. Add a hidden input for Netlify:
```html
<input type="hidden" name="form-name" value="rsvp" />
```

3. Update the form submission to use Netlify's endpoint

## Form Fields

The form collects the following information:
- **name**: Guest's full name
- **guests**: Number of additional guests
- **email**: Email address
- **phone**: Phone number
- **dietaryRestrictions**: Any dietary restrictions or allergies
- **songRequest**: Song requests for the reception
- **message**: Personal message for the couple

## Email Notifications

Formspree will automatically send you an email notification when someone submits the form. You can customize the email template in your Formspree dashboard.
