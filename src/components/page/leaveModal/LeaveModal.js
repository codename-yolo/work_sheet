import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { TimePicker, Input, Checkbox, Radio, Row, Col, Skeleton } from 'antd'
import {
  DialogRequest,
  dateTime,
  typeStatusRequest,
  typeRequest,
  handleDateTime,
  handleField,
  buttonForm,
  tryCatch,
  endPoint,
  typePopup,
  messageRequest,
  requestSlice,
  checkRequest,
} from '../../index'
import styles from './LeaveModal.module.scss'

const {
  checkRequestStatus,
  checkRequestStatusColorText,
  checkRequestComment,
  checkRequestManager,
} = checkRequest

const LeaveModal = ({ isOpen, row, handleCloseLeave }) => {
  const [requestExists, setRequestExists] = useState(false)
  const [leaveAllDayCheck, setLeaveAllDayCheck] = useState(false)
  const [timeCount, setTimeCount] = useState()

  const dispatch = useDispatch()
  const { request, status } = useSelector((state) => state.requests)
  const schema = yup.object().shape({
    reasonInput: yup.string().trim().required('Please enter reason'),
    rangeInput: yup.array().when('checkboxLeaveAllDay', {
      is: (value) => {
        return (value || []).length === 0
      },
      then: yup.array().nullable(true).required('Please enter range'),
      otherwise: yup.array().nullable(true).notRequired(),
    }),
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      radioPaid: 'paid',
    },
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    const checkRequestExists = async () => {
      await dispatch(
        requestSlice.getRequestsOfDay({
          url: endPoint.GET_REQUEST_LEAVE_OF_DAY,
          date: row.work_date,
        }),
      )
    }
    checkRequestExists()
  }, [])

  useEffect(() => {
    if (Object.keys(request).length !== 0) {
      if (request.leave_all_day === typeRequest.LEAVE_ALL_DAY) {
        setValue('checkboxLeaveAllDay', [typeRequest.LEAVE_ALL_DAY])
        setLeaveAllDayCheck(!!request.leave_all_day)
      } else {
        setValue('rangeInput', [
          moment(request.leave_start, dateTime.formatTimeType),
          moment(request.leave_end, dateTime.formatTimeType),
        ])
        setTimeCount(request.leave_time)
      }
      setValue(
        'radioPaid',
        request.request_type === typeRequest.REQUEST_LEAVE_PAID
          ? 'paid'
          : request.request_type === typeRequest.REQUEST_LEAVE_UNPAID
          ? 'unpaid'
          : '',
      )
      setValue('reasonInput', request.reason)
      setRequestExists(true)
    }
  }, [request])

  const onSubmit = async (values, e) => {
    if (
      (!row.checkin && !row.checkout) ||
      (!row.checkin_original && !row.checkout_original)
    ) {
      typePopup.popupNotice(
        typePopup.ERROR_MESSAGE,
        'Message',
        'Time not found',
        1,
      )
      return
    }
    const [leaveStart, leaveEnd] = values.rangeInput || []
    const buttonSubmit = e.nativeEvent.submitter.name.toUpperCase()
    switch (buttonSubmit) {
      case 'REGISTER':
        const newRequest = {
          request_type:
            values.radioPaid == 'paid'
              ? typeRequest.REQUEST_LEAVE_PAID
              : values.radioPaid == 'unpaid'
              ? typeRequest.REQUEST_LEAVE_UNPAID
              : '',
          check_in: dateTime.formatTime(row.checkin || row.checkin_original),
          check_out: dateTime.formatTime(row.checkout || row.checkout_original),
          request_for_date: row.work_date,
          leave_start: leaveAllDayCheck ? '' : dateTime.formatTime(leaveStart),
          leave_end: leaveAllDayCheck ? '' : dateTime.formatTime(leaveEnd),
          leave_time: leaveAllDayCheck ? '' : timeCount,
          leave_all_day:
            (values.checkboxLeaveAllDay || []).length !== 0
              ? typeRequest.LEAVE_ALL_DAY
              : typeRequest.LEAVE_BY_RANGE,
          reason: values.reasonInput,
          status: typeStatusRequest.SEND,
        }

        await tryCatch.handleTryCatch(
          dispatch(
            requestSlice.postRequests({
              url: endPoint.POST_REQUEST_LEAVE,
              requestData: newRequest,
            }),
          ),
          messageRequest.CREATE,
          handleCloseModal,
        )
        break
      case 'UPDATE':
        const updateRequest = {
          request_type:
            values.radioPaid == 'paid'
              ? typeRequest.REQUEST_LEAVE_PAID
              : values.radioPaid == 'unpaid'
              ? typeRequest.REQUEST_LEAVE_UNPAID
              : '',
          request_for_date: row.work_date,
          check_in: dateTime.formatTime(row.checkin || row.checkin_original),
          check_out: dateTime.formatTime(row.checkout || row.checkout_original),
          leave_start: leaveAllDayCheck ? '' : dateTime.formatTime(leaveStart),
          leave_end: leaveAllDayCheck ? '' : dateTime.formatTime(leaveEnd),
          leave_time: leaveAllDayCheck ? '' : timeCount,
          leave_all_day:
            (values.checkboxLeaveAllDay || []).length !== 0
              ? typeRequest.LEAVE_ALL_DAY
              : typeRequest.LEAVE_BY_RANGE,
          reason: values.reasonInput,
        }
        await tryCatch.handleTryCatch(
          dispatch(
            requestSlice.putRequests({
              id: request.id,
              requestData: updateRequest,
              url: endPoint.PUT_REQUEST_LEAVE,
            }),
          ),
          messageRequest.UPDATE,
          handleCloseModal,
        )
        break
      case 'DELETE':
        await tryCatch.handleTryCatch(
          dispatch(
            requestSlice.deleteRequests({
              url: endPoint.DELETE_REQUEST_LEAVE,
              id: request.id,
            }),
          ),
          messageRequest.DELETE,
          handleCloseModal,
        )
        break
      default:
        throw new Error('An error occurred')
    }
  }

  const handleOnChangeRange = (values) => {
    if (values) {
      const [leaveStart, leaveEnd] = values
      const start = moment(leaveStart, dateTime.formatTimeType)
      const end = moment(leaveEnd, dateTime.formatTimeType)
      const millisecond = end.diff(start, 'millisecond')
      const timeCount = moment()
        .hour(0)
        .minute(0)
        .millisecond(millisecond)
        .format(dateTime.formatTimeType)
      setTimeCount(timeCount)
    } else {
      setTimeCount('')
    }
  }

  const handleChangeLeaveAllDay = (e) => {
    e.target.checked ? setLeaveAllDayCheck(true) : setLeaveAllDayCheck(false)
  }

  const handleCloseModal = () => {
    handleCloseLeave()
    dispatch(
      requestSlice.getRequestsOfDay({
        url: endPoint.GET_REQUEST_LEAVE_OF_DAY,
        date: -1,
      }),
    )
  }

  return (
    <DialogRequest
      isOpen={isOpen}
      handleModal={handleCloseModal}
      title="Register Leave"
      listButton={buttonForm.formRequestButton}
      statusRequest={request.status}
      requestExists={requestExists}
      statusGetRequest={status}
    >
      <>
        <form id="myForm" onSubmit={handleSubmit(onSubmit)}>
          {status === 'loading' ? (
            <Skeleton paragraph={{ rows: 10 }} />
          ) : (
            <>
              <Row>
                <Col xl={4} md={6} xs={6}>
                  Registration date:
                </Col>
                <Col xl={20} md={18} xs={18}>
                  {request?.created_at
                    ? dateTime.formatDateTime(request?.create_at)
                    : ''}
                </Col>
              </Row>
              <Row>
                <Col xl={4} md={6} xs={6}>
                  Register for date:
                </Col>
                <Col xl={20} md={18} xs={18}>
                  {dateTime.formatDate(row?.work_date)}
                </Col>
              </Row>
              <Row>
                <Col xl={8} md={6} xs={12} className={styles.dFlex}>
                  <Col xl={12} md={12} xs={12}>
                    Check-in:
                  </Col>
                  <Col xl={12} md={12} xs={12}>
                    {handleDateTime.checkInvalidTime(
                      row?.checkin || row?.checkin_original,
                    )}
                  </Col>
                </Col>
                <Col xl={8} md={6} xs={12} className={styles.dFlex}>
                  <Col xl={12} md={12} xs={12}>
                    Check-out:
                  </Col>
                  <Col xl={12} md={12} xs={12}>
                    {handleDateTime.checkInvalidTime(
                      row?.checkout || row?.checkout_original,
                    )}
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col xl={8} md={6} xs={12} className={styles.dFlex}>
                  <Col xl={12} md={12} xs={12}>
                    Work time:
                  </Col>
                  <Col xl={12} md={12} xs={12}>
                    {handleDateTime.checkInvalid(row?.work_time)}
                  </Col>
                </Col>
                <Col xl={8} md={6} xs={12} className={styles.dFlex}>
                  <Col xl={12} md={12} xs={12}>
                    Lack time:
                  </Col>
                  <Col xl={12} md={12} xs={12}>
                    {handleDateTime.checkInvalid(row?.lack)}
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col xl={24} md={24} xs={24}>
                  <Controller
                    name="checkboxLeaveAllDay"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Checkbox.Group
                          disabled={handleField.disableField(request.status)}
                          {...field}
                        >
                          <Checkbox
                            onChange={handleChangeLeaveAllDay}
                            value={typeRequest.LEAVE_ALL_DAY}
                          >
                            Leave All Day
                          </Checkbox>
                        </Checkbox.Group>
                      </>
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col xl={4} md={6} xs={6} style={{ lineHeight: '32px' }}>
                  Range
                </Col>
                <Col
                  xl={20}
                  md={18}
                  xs={18}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Col flex={'150px'}>
                    <Controller
                      name="rangeInput"
                      control={control}
                      render={({ field }) => {
                        return (
                          <>
                            <TimePicker.RangePicker
                              disabled={
                                handleField.disableField(request.status) ||
                                handleField.disableFieldWhenChoose(
                                  leaveAllDayCheck,
                                )
                              }
                              {...field}
                              onChange={(e) => {
                                handleOnChangeRange(e)
                                return field.onChange(e)
                              }}
                              format={dateTime.formatTimeType}
                              style={{
                                width: '100%',
                                minWidth: '150px',
                                maxWidth: '205px',
                                marginRight: '10px',
                              }}
                            />
                            {!leaveAllDayCheck && errors.rangeInput && (
                              <div className={styles.errorField}>
                                {errors.rangeInput?.message}
                              </div>
                            )}
                          </>
                        )
                      }}
                    />
                  </Col>
                  <Col
                    flex={'auto'}
                    style={{
                      alignSelf: 'flex-start',
                      lineHeight: '32px',
                    }}
                  >
                    <Controller
                      name="radioPaid"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Radio.Group
                            disabled={handleField.disableField(request.status)}
                            {...field}
                          >
                            <Radio value={'paid'}>Paid</Radio>
                            <Radio value={'unpaid'}>Unpaid</Radio>
                          </Radio.Group>
                          <div style={{ display: 'inline-block' }}>
                            | TimeCount:
                            <span
                              style={handleDateTime.compareTime(
                                timeCount,
                                row?.lack,
                              )}
                            >
                              {!leaveAllDayCheck && <span> {timeCount}</span>}
                            </span>
                          </div>
                        </>
                      )}
                    />
                  </Col>
                </Col>
              </Row>
              <Row style={!request?.status ? { margin: 0 } : {}}>
                <Col xl={4} md={6} xs={24}>
                  Reason: <span className={styles.requiredField}>(*)</span>
                </Col>
                <Col xl={20} md={18} xs={24}>
                  <Controller
                    name="reasonInput"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input.TextArea
                          showCount
                          maxLength={100}
                          placeholder="Please enter not too 100 characters"
                          autoSize={{ minRows: 5, maxRows: 5 }}
                          disabled={handleField.disableField(request.status)}
                          {...field}
                        />
                        {errors.reasonInput && (
                          <span
                            className={styles.errorField}
                            style={{ position: 'absolute' }}
                          >
                            {errors.reasonInput?.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </Col>
              </Row>
              {request.status !== 0 && request.status && (
                <>
                  <Row>
                    <Col xl={4}>Status:</Col>
                    <Col xl={20}>
                      <strong
                        style={{
                          color: checkRequestStatusColorText(request.status),
                        }}
                      >
                        {checkRequestStatus(request.status).toUpperCase()}
                      </strong>
                    </Col>
                  </Row>
                  <Row style={{ margin: 0 }}>
                    <>
                      <Col xl={4}>
                        {checkRequestManager(
                          request.manager_confirmed_status,
                          request.admin_approved_status,
                        )}
                      </Col>
                      <Col xl={20}>
                        <p
                          style={{
                            color: checkRequestStatusColorText(request.status),
                          }}
                        >
                          {checkRequestComment(
                            request.status,
                            request.manager_confirmed_comment,
                            request.admin_approved_comment,
                            request.manager_confirmed_status,
                            request.admin_approved_status,
                          )}
                        </p>
                      </Col>
                    </>
                  </Row>
                </>
              )}
            </>
          )}
        </form>
      </>
    </DialogRequest>
  )
}

LeaveModal.propTypes = {
  isOpen: PropTypes.bool,
  handleCloseLeave: PropTypes.func,
  row: PropTypes.object,
}

export default LeaveModal
