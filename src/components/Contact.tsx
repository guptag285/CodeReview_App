import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  resetContactForm,
  setContactEmail,
  setContactMessage,
  setContactName,
  setContactNumber,
  setContactDay,
  setContactTimeSlot,
} from "../store/appSlice"
import Screen from './Screen'
import { sendContactEmail } from '../email/contactEmail'

const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,}$/
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const PHONE_REGEX = /^[6-9]\d{9}$/

export default function Contact() {
  const dispatch = useAppDispatch()
  const contactName = useAppSelector(state => state.app.contactName)
  const contactEmail = useAppSelector(state => state.app.contactEmail)
  const contactMessage = useAppSelector(state => state.app.contactMessage)
  const contactNumber = useAppSelector(state => state.app.contactNumber)
  const contactDay = useAppSelector(state => state.app.contactDay)
  const contactTimeSlot = useAppSelector(state => state.app.contactTimeSlot)
  const [name, setName] = useState(contactName)
  const [email, setEmail] = useState(contactEmail)
  const [message, setMessage] = useState(contactMessage)
  const [number, setNumber] = useState(contactNumber)
  const [day, setDay] = useState(contactDay)
  const [timeSlot, setTimeSlot] = useState(contactTimeSlot)
  const [dateTime, setDateTime] = useState<Date | null>(
    contactDay && contactTimeSlot
      ? new Date(`${contactDay}T${contactTimeSlot}`)
      : null
  )
  const [tempDateTime, setTempDateTime] = useState<Date | null>(dateTime)
  const [isSending, setIsSending] = useState(false)
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    number: '',
    dateTime: '',
    message: '',
  })
  const resetTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)

  const resetFormState = () => {
    dispatch(resetContactForm())
    setName('')
    setEmail('')
    setNumber('')
    setMessage('')
    setDay('')
    setTimeSlot('')
    setDateTime(null)
    setTempDateTime(null)
    setValidationErrors({
      name: '',
      email: '',
      number: '',
      dateTime: '',
      message: '',
    })
  }

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  // Minimum date is today
  const minDate = new Date()
  minDate.setHours(0, 0, 0, 0)

  // Filter based on day of week:
  // Monday-Friday: 8 PM - 11:45 PM (evening)
  // Saturday-Sunday: 8 AM - 6 PM (morning)
  const filterTime = (time: Date) => {
    const dayOfWeek = dateTime ? dateTime.getDay() : time.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday
    const hours = time.getHours()
    const minutes = time.getMinutes()

    // Saturday (6) and Sunday (0): 8 AM - 6 PM
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return hours >= 8 && hours < 18 // 8 AM to 5:59 PM
    }

    // Monday-Friday (1-5): 8 PM - 11:45 PM
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      if (hours >= 20 && hours < 24) return true // 8 PM onwards
      if (hours === 23 && minutes <= 45) return true // Up to 11:45 PM
      return false
    }

    return false
  }

  const handleDateTimeChange = (date: Date | null) => {
    setTempDateTime(date)
    setValidationErrors((current) => ({ ...current, dateTime: '' }))
    if (date) {
      setDateTime(date)
      const dayString = date.toISOString().split('T')[0]
      const timeString = date.toTimeString().slice(0, 5)
      setDay(dayString)
      setTimeSlot(timeString)
    }
  }

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      number: '',
      dateTime: '',
      message: '',
    }

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedNumber = number.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName) {
      errors.name = 'Name is required.'
    } else if (!NAME_REGEX.test(trimmedName)) {
      errors.name = 'Name must contain only letters and spaces.'
    }

    if (!trimmedEmail) {
      errors.email = 'Email is required.'
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address containing @ and a domain (for example, name@example.com).'
    }

    if (!trimmedNumber) {
      errors.number = 'Phone number is required.'
    } else if (!PHONE_REGEX.test(trimmedNumber)) {
      errors.number = 'Phone number must be exactly 10 digits and start with 6, 7, 8, or 9 for Indian format.'
    }

    if (!tempDateTime) {
      errors.dateTime = 'Please select a date and time.'
    }

    if (!trimmedMessage) {
      errors.message = 'Message is required.'
    } else if (trimmedMessage.length < 10) {
      errors.message = 'Message must be at least 10 characters long.'
    }

    setValidationErrors(errors)
    return errors
  }

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const errors = validateForm()
    const hasErrors = Object.values(errors).some((error) => error)

    if (hasErrors) {
      return
    }

    const contactData = {
      name: name.trim(),
      email: email.trim(),
      contactNumber: number.trim(),
      day,
      timeSlot,
      message: message.trim(),
    }

    setIsSending(true)

    try {
      dispatch(setContactName(name))
      dispatch(setContactEmail(email))
      dispatch(setContactNumber(number))
      dispatch(setContactDay(day))
      dispatch(setContactTimeSlot(timeSlot))
      dispatch(setContactMessage(message))
       resetFormState()

      await sendContactEmail(contactData)

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }

      resetTimerRef.current = window.setTimeout(() => {
        resetFormState()
      }, 2000)
    } catch (error) {
      console.error('Failed to send contact email:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Screen title="Contact" subtitle="Get in touch with the developer.">
      <p>Send a quick message through the contact screen.</p>
      <form className="contact-form" onSubmit={submitForm}>
        <label>
          Name
          <input
            type="text"
            value={name}
            required
            onChange={event => {
              setName(event.target.value)
              setValidationErrors((current) => ({ ...current, name: '' }))
            }}
            placeholder="Your name"
          />
          {validationErrors.name ? <p className="field-error">{validationErrors.name}</p> : null}
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            required
            onChange={event => {
              setEmail(event.target.value)
              setValidationErrors((current) => ({ ...current, email: '' }))
            }}
            placeholder="you@example.com"
          />
          {validationErrors.email ? <p className="field-error">{validationErrors.email}</p> : null}
        </label>
        <label>
          Contact Number
          <input
            type="tel"
            value={number}
            required
            onChange={event => {
              setNumber(event.target.value)
              setValidationErrors((current) => ({ ...current, number: '' }))
            }}
            placeholder="+1 (555) 000-0000"
          />
          {validationErrors.number ? <p className="field-error">{validationErrors.number}</p> : null}
        </label>
        <label>
          Select Date and Time
          <p style={{ fontSize: '12px', color: 'var(--text)', marginTop: '-6px' }}>
            {tempDateTime
              ? tempDateTime.getDay() === 0 || tempDateTime.getDay() === 6
                ? '(Weekend: 8 AM - 6 PM)'
                : '(Weekday: 8 PM - 11:45 PM)'
              : '(Saturday/Sunday: 8 AM - 6 PM | Monday-Friday: 8 PM - 11:45 PM)'}
          </p>
          <DatePicker
            selected={tempDateTime}
            onChange={handleDateTimeChange}
            minDate={minDate}
            filterTime={filterTime}
            showTimeSelect
            dateFormat="yyyy-MM-dd h:mm aa"
            timeFormat="hh:mm aa"
            timeIntervals={15}
            timeCaption="Time"
            placeholderText="Select date and time"
            required
          />
          {validationErrors.dateTime ? <p className="field-error">{validationErrors.dateTime}</p> : null}
        </label>
        <label>
          Message
          <textarea
            value={message}
            required
            onChange={event => {
              setMessage(event.target.value)
              setValidationErrors((current) => ({ ...current, message: '' }))
            }}
            placeholder="Your message here"
          />
          {validationErrors.message ? <p className="field-error">{validationErrors.message}</p> : null}
        </label>
        <button type="submit" disabled={isSending}>
          {isSending ? 'Sending...' : 'Save contact info'}
        </button>
      </form>
      {contactName || contactEmail || contactNumber || contactDay || contactTimeSlot || contactMessage ? (
        <div className="hero-card">
          <p>Saved contact details:</p>
          <p><strong>Name:</strong> {contactName || '—'}</p>
          <p><strong>Email:</strong> {contactEmail || '—'}</p>
          <p><strong>Contact Number:</strong> {contactNumber || '—'}</p>
          <p><strong>Day:</strong> {contactDay || '—'}</p>
          <p><strong>Time Slot:</strong> {contactTimeSlot || '—'}</p>
          <p><strong>Message:</strong> {contactMessage || '—'}</p>
        </div>
      ) : null}
    </Screen>
  )
}
