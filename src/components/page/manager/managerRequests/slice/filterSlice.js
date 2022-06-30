import { createSlice, createSelector } from '@reduxjs/toolkit'
import reducerRegistry from '../../../../../store/reducerRegister'

const initialState = {
  search: '',
}
const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    searchFilterChange: (state, action) => {
      state.search = action.payload
    },
  },
})

const searchTextSelector = (state) => {
  return state.filters.search
}
const requestsSelector = (state) => state.managerRequest.requests

export const filtersRequestSelector = createSelector(
  requestsSelector,
  searchTextSelector,
  (requests, searchText) => {
    return (requests || []).length !== 0
      ? requests.filter((request) => {
          const { full_name: fullName, email } = request
          const nameMember = fullName.toLowerCase()
          const emailMember = email.toLowerCase()
          const searchInput = searchText.toLowerCase()
          return (
            nameMember.includes(searchInput) ||
            emailMember.includes(searchInput)
          )
        })
      : requests
  },
)

export const { searchFilterChange } = filtersSlice.actions

reducerRegistry.register(filtersSlice.name, filtersSlice.reducer)
