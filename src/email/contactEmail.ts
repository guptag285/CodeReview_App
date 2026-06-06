import emailjs from '@emailjs/browser'

export interface ContactEmailData {
  name: string
  email: string
  contactNumber: string
  day: string
  timeSlot: string
  message: string
}

export const EMAIL_RECIPIENTS = [
  'guptag285@gmail.com',
  'ad.deep418@gmail.com',
]

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export function formatContactEmailSubject(name: string) {
  return `New contact request from ${name}`
}

export function formatContactEmailBody(data: ContactEmailData) {
  return [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Contact Number: ${data.contactNumber}`,
    `Preferred Day: ${data.day}`,
    `Preferred Time: ${data.timeSlot}`,
    `Message: ${data.message}`,
  ].join('\n')
}

export async function sendContactEmail(data: ContactEmailData, recipients: string[] = EMAIL_RECIPIENTS) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error('EmailJS environment variables are not configured.')
  }

  const templateParams = {
    subject: formatContactEmailSubject(data.name),
    from_name: data.name,
    from_email: data.email,
    contact_number: data.contactNumber,
    preferred_day: data.day,
    preferred_time: data.timeSlot,
    message: data.message,
    email_body: formatContactEmailBody(data),
  }

  const uniqueRecipients = Array.from(new Set(recipients))

  const results = await Promise.allSettled(
    uniqueRecipients.map((recipient) =>
      emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          ...templateParams,
          to_email: recipient,
          reply_to: data.email,
        },
        EMAILJS_PUBLIC_KEY,
      )
    )
  )

  const failed = results.filter((result) => result.status === 'rejected')

  if (failed.length > 0) {
    throw new Error('One or more email deliveries failed.')
  }

  return results
}
