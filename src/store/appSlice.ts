import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  count: number
  contactEmail: string
  contactMessage: string
  contactName: string
  contactNumber: string
  contactDay: string
  contactTimeSlot: string
}

const initialState: AppState = {
  count: 0,
  contactEmail: '',
  contactMessage: '',
  contactName: '',
  contactNumber: '',
  contactDay: '',
  contactTimeSlot: '',
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    incrementCount(state) {
      state.count += 1
    },
    setContactEmail(state, action: PayloadAction<string>) {
      state.contactEmail = action.payload
    },
    setContactMessage(state, action: PayloadAction<string>) {
      state.contactMessage = action.payload
    },
    setContactName(state, action: PayloadAction<string>) {
      state.contactName = action.payload
    },
    setContactNumber(state, action: PayloadAction<string>) {
      state.contactNumber = action.payload
    },
    setContactDay(state, action: PayloadAction<string>) {
      state.contactDay = action.payload
    },
    setContactTimeSlot(state, action: PayloadAction<string>) {
      state.contactTimeSlot = action.payload
    },
    resetContactForm(state) {
      state.contactEmail = ''
      state.contactMessage = ''
      state.contactName = ''
      state.contactNumber = ''
      state.contactDay = ''
      state.contactTimeSlot = ''
    },
  },
})

export const {
  incrementCount,
  setContactEmail,
  setContactMessage,
  setContactName,
  setContactNumber,
  setContactDay,
  setContactTimeSlot,
  resetContactForm,
} = appSlice.actions
export default appSlice.reducer
