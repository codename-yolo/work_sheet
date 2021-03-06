import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import reducerRegistry from '../../../../store/reducerRegister'
import { get } from '../../../service/requestApi'
import moment from 'moment'

export const getDataListNotice = createAsyncThunk(
  'noticeList/getDataListNotice',
  async (item) => {
    const response = await get(
      `/notification?per_page=${item.perPage}&page=${item.page}`,
    )
    return response
  },
)

const initialState = {
  tableData: [],
  per_page: 10,
  page: 1,
  total: 0,
  lastPage: 0,
  currentPage: 1,
  loading: true,
}

const noticeList = createSlice({
  name: 'noticeList',
  initialState,
  reducers: {
    setItemPerPage(state, action) {
      state.per_page = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDataListNotice.fulfilled, (state, action) => {
      const dataTable = action.payload?.data.filter((item) => {
        return moment().isAfter(item.published_date)
      })

      state.loading = false
      state.per_page = action.payload.meta?.per_page
      state.total = action.payload.meta?.total
      state.page = action.payload.meta?.current_page
      state.lastPage = action.payload.meta?.last_page
      state.currentPage = action.payload?.meta.current_page
      state.tableData = dataTable
      state.loading = false
    })
    builder.addCase(getDataListNotice.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(getDataListNotice.rejected, (state, action) => {
      state.loading = true
    })
  },
})

export const { setItemPerPage } = noticeList.actions
reducerRegistry.register(noticeList.name, noticeList.reducer)
