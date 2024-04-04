import { createAction } from 'redux-actions'
import {
  CREATE_ACCOUNT,
  DELETE_ACCOUNT,
  ENABLE_ACCOUNT,
  FETCH_ACCOUNTS,
  FETCH_ACCOUNTS_CREATE_TICKET,
  SAVE_EDIT_ACCOUNT,
  UNLOAD_ACCOUNTS,
  SAVE_PROFILE,
  GEN_MFA
} from 'actions/types'

export const fetchAccounts = createAction(
  FETCH_ACCOUNTS.ACTION,
  payload => payload,
  () => ({ thunk: true })
)
export const fetchAccountsCreateTicket = createAction(
  FETCH_ACCOUNTS_CREATE_TICKET.ACTION,
  payload => payload,
  () => ({ thunk: true })
)
export const createAccount = createAction(CREATE_ACCOUNT.ACTION)
export const saveEditAccount = createAction(
  SAVE_EDIT_ACCOUNT.ACTION,
  payload => payload,
  () => ({ thunk: true })
)
export const deleteAccount = createAction(DELETE_ACCOUNT.ACTION)
export const enableAccount = createAction(ENABLE_ACCOUNT.ACTION)
export const unloadAccounts = createAction(
  UNLOAD_ACCOUNTS.ACTION,
  payload => payload,
  () => ({ thunk: true })
)
export const saveProfile = createAction(
  SAVE_PROFILE.ACTION,
  payload => payload,
  () => ({ thunk: true })
)

export const genMFA = createAction(
  GEN_MFA.ACTION,
  payload => payload,
  () => ({ thunk: true })
)
