import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Space,
  Form,
  DatePicker,
  Typography,
  Radio,
  Select,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'
import TableTimesheet from './tableTimesheet/TableTimesheet'
import { getTimeSheet } from './slice/slice'
import { typePopup, dateTime } from '../../index'
import './SearchBox.scss'

const { Option } = Select
const { Text } = Typography

const SearchBox = () => {
  const [choose, setChoose] = useState(1)
  const [errDate, setErrDate] = useState(false)
  const dispatch = useDispatch()
  const [params, setParams] = useState({
    sort: 'desc',
    startDate: null,
    endDate: moment().subtract(1, 'days'),
  })

  useEffect(() => {
    const dateCompare =
      moment().format('YYYY-MM-DD') ===
      moment().startOf('month').format('YYYY-MM-DD')
        ? moment().subtract(1, 'months').startOf('month')
        : moment().startOf('month')
    dispatch(
      getTimeSheet({
        ...params,
        page: 1,
        perPage: 10,
        startDate: dateCompare,
      }),
    )
  }, [])

  const worksheet = useSelector((state) => {
    return state.timeSheet
  })

  const onFinish = (values) => {
    if (values.selected === 1) {
      switch (values.selectedDate) {
        case 1:
          setParams((prev) => ({
            ...prev,
            startDate: moment().subtract(1, 'year').startOf('year'),
          }))
          dispatch(
            getTimeSheet({
              ...params,
              page: 1,
              perPage: worksheet.per_page,
              startDate: moment().subtract(1, 'year').startOf('year'),
            }),
          )
          break
        case 2:
          setParams((prev) => ({
            ...prev,
            startDate: moment().subtract(1, 'months').startOf('month'),
          }))
          dispatch(
            getTimeSheet({
              ...params,
              page: 1,
              perPage: worksheet.per_page,
              startDate: moment().subtract(1, 'months').startOf('month'),
            }),
          )
          break
        case 3:
          const dateCompare =
            moment().format('YYYY-MM-DD') ===
            moment().startOf('month').format('YYYY-MM-DD')
              ? moment().subtract(1, 'months').startOf('month')
              : moment().startOf('month')

          setParams((prev) => ({
            ...prev,
            startDate: dateCompare,
          }))
          dispatch(
            getTimeSheet({
              ...params,
              page: 1,
              perPage: worksheet.per_page,
              startDate: dateCompare,
            }),
          )

          break
        default:
          throw new Error('Invalid Selected')
      }
    } else if (values.selected === 2) {
      if (errDate) {
        typePopup.popupNotice(
          typePopup.ERROR_MESSAGE,
          'Invalid Date',
          'Start date cannot be greater than end date',
        )
        return null
      }
      dispatch(
        getTimeSheet({
          ...params,
          page: 1,
          perPage: worksheet.per_page,
        }),
      )
    } else {
      throw new Error('Invalid Selected')
    }
  }

  const handleReset = () => {
    form.resetFields()
    setChoose(1)
    setParams({
      sort: 'asc',
      startDate: null,
      endDate: moment().subtract(1, 'days'),
    })
  }

  const [form] = Form.useForm()
  const onChangeChoose = (e) => {
    setChoose(e.target.value)
  }

  return (
    <>
      <div className="search-field" id="WorkSheet">
        <fieldset>
          <legend>My Time Sheet</legend>
          <Form
            form={form}
            layout="horizontal"
            name="form_searchList"
            className="searchList"
            onFinish={onFinish}
            scrollToFirstError
            initialValues={{
              selectedDate: 3,
              selected: 1,
              sort: 'desc',
              endDate: params.endDate,
              radioGroup: 2,
            }}
          >
            <div className="search-form">
              <div className="selected_choose">
                <Form.Item name="selected" style={{ position: 'relative' }}>
                  <Radio.Group
                    name="radioGroup"
                    onChange={onChangeChoose}
                    value={choose}
                  >
                    <Space direction="vertical" size={35}>
                      <Radio value={1}>Choose from list</Radio>
                      <Radio value={2}>Choose start, end</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
                <div className="selected_data">
                  <Form.Item name="selectedDate">
                    <Select style={{ width: 150 }} disabled={choose === 2}>
                      <Option value={3}>This month</Option>
                      <Option value={2}>Last month</Option>
                      <Option value={1}>Last year</Option>
                    </Select>
                  </Form.Item>
                  <Space direction="horizontal" size={25} align="center">
                    <Form.Item name="startDate">
                      <DatePicker
                        format={dateTime.formatDateTypeDate}
                        disabled={choose === 1}
                        value={params.startDate}
                        onChange={(date) => {
                          if (date) {
                            const compareDate = date.isBefore(params.endDate)
                            if (!compareDate && params.endDate !== null) {
                              setErrDate(true)
                            } else {
                              setErrDate(false)
                            }
                            setParams((prev) => ({
                              ...prev,
                              startDate: date,
                            }))
                          } else {
                            setParams((prev) => ({
                              ...prev,
                              startDate: null,
                            }))
                          }
                        }}
                      />
                      <span style={{ marginLeft: 20 }}>To</span>
                    </Form.Item>

                    <Form.Item name="endDate">
                      <DatePicker
                        format={dateTime.formatDateTypeDate}
                        disabled={choose === 1}
                        value={params.endDate}
                        onChange={(date) => {
                          if (date) {
                            const compareDate = date.isAfter(params.startDate)
                            if (params.startDate !== null && !compareDate) {
                              setErrDate(true)
                            } else {
                              setErrDate(false)
                            }
                            setParams((prev) => ({ ...prev, endDate: date }))
                          } else {
                            setParams((prev) => ({
                              ...prev,
                              endDate: moment().subtract(1, 'days'),
                            }))
                          }
                        }}
                      />
                    </Form.Item>
                  </Space>
                </div>
              </div>

              <div className="selected_sort">
                <Text>Sort by work date</Text>
                <Form.Item name="sort">
                  <Select
                    style={{ width: 150 }}
                    onChange={(value) => {
                      setParams((prev) => ({
                        ...prev,
                        sort: value,
                      }))
                    }}
                  >
                    <Option value="asc">Ascending</Option>
                    <Option value="desc">Descending</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="button-form-search">
              <Button
                type="primary"
                icon={<SearchOutlined />}
                size="large"
                htmlType="submit"
              >
                Search
              </Button>
              <Button
                size="large"
                onClick={handleReset}
                style={{ padding: ' 0 35px' }}
              >
                Reset
              </Button>
            </div>
          </Form>
        </fieldset>

        <>
          <TableTimesheet row={worksheet} params={params}></TableTimesheet>
        </>
      </div>
    </>
  )
}

export default SearchBox
