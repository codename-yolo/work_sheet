import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, DatePicker, Input, Skeleton } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { handlePlusTime, handleFormat, handleSubTime } from './handleTime'
import { get } from '../../../service/requestApi'
import moment from 'moment'
import PropTypes from 'prop-types'
import {
  DialogRequest,
  dateTime,
  typeStatusRequest,
  typeRequest,
  handleDateTime,
  handleField,
  buttonForm,
  tryCatch,
  messageRequest,
  requestSlice,
  endPoint,
  checkRequest,
  typePopup,
} from '../../../index'
import styles from './Index.module.scss'

const {
  checkRequestStatus,
  checkRequestStatusColorText,
  checkRequestComment,
  checkRequestManager,
} = checkRequest

const Index = ({ handleCloseLateEarly, isOpen, row }) => {
  const [requestExists, setRequestExists] = useState(false)
  const [overTime, setOverTime] = useState(null)
  const checkRef = useRef(1)

  const timeRequest =
    !row?.late && !row?.early
      ? '--:--'
      : handleFormat(handlePlusTime(row?.late, row?.early))

  const getCompensation = async (date) => {
    const response = await get(
      `worksheet/show-date?work_date=${dateTime.formatDate(date)}`,
    )
      .then((res) => {
        const checkOut = dateTime.formatTime(res.checkout_original)
        const checkIn = dateTime.formatTime(res.checkin_original)
        return handleSubTime(checkIn, checkOut)
      })
      .catch(() => {
        return null
      })
    return response
  }

  const { request, status } = useSelector((state) => state.requests)
  const dispatch = useDispatch()

  useEffect(() => {
    const checkRequestExists = async () => {
      await dispatch(
        requestSlice.getRequestsOfDay({
          url: endPoint.GET_REQUEST_LATE_EARLY_OF_DAY,
          date: row.work_date,
        }),
      )
    }
    checkRequestExists()
  }, [])

  useEffect(() => {
    if (checkRef.current > 3) {
      let dateTime = moment().subtract(1, 'days')
      if (request.created_at) {
        dateTime = new Date(request.compensation_date)
      }
      const getTimeOver = async () => {
        const response = await getCompensation(dateTime)
        setOverTime(response)
      }
      getTimeOver()
    }
    checkRef.current++
  }, [request])

  const schema = yup.object().shape({
    reasonInput: yup.string().trim().required('Please enter reason'),
    checkDateTime: yup.date().nullable().required('Please enter date'),
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      checkDateTime: moment().subtract(1, 'days'),
    },
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (Object.keys(request).length !== 0) {
      setValue('reasonInput', request.reason)
      setRequestExists(true)
    }
  }, [request])

  const onSubmit = async (values, e) => {
    if (!overTime || timeRequest === '--:--') {
      typePopup.popupNotice(
        typePopup.ERROR_MESSAGE,
        'Message',
        'Overtime or time request not found',
        1,
      )
      return null
    }

    const buttonSubmit = e.nativeEvent.submitter.name.toUpperCase()
    switch (buttonSubmit) {
      case 'REGISTER':
        const newRequest = {
          request_type: typeRequest.REQUEST_LATE_EARLY,
          check_in: dateTime.formatTime(row.checkin || row.checkin_original),
          check_out: dateTime.formatTime(row.checkout || row.checkout_original),
          request_for_date: dateTime.formatDate(row.work_date),
          reason: values.reasonInput,
          compensation_time: overTime,
          compensation_date: dateTime.formatDate(values.checkDateTime),
          status: typeStatusRequest.SEND,
        }
        await tryCatch.handleTryCatch(
          dispatch(
            requestSlice.postRequests({
              url: endPoint.POST_REQUEST_LATE_EARLY,
              requestData: newRequest,
            }),
          ),
          messageRequest.CREATE,
          handleCloseModal,
        )
        break
      case 'UPDATE':
        const updateRequest = {
          request_type: typeRequest.REQUEST_LATE_EARLY,
          check_in: dateTime.formatTime(row.checkin || row.checkin_original),
          check_out: dateTime.formatTime(row.checkout || row.checkout_original),
          request_for_date: dateTime.formatDate(row.work_date),
          reason: values.reasonInput,
          compensation_time: overTime,
          compensation_date: dateTime.formatDate(values.checkDateTime),
          status: typeStatusRequest.SEND,
        }
        await tryCatch.handleTryCatch(
          dispatch(
            requestSlice.putRequests({
              id: request.id,
              requestData: updateRequest,
              url: endPoint.PUT_REQUEST_LATE_EARLY,
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
              url: endPoint.DELETE_REQUEST_LATE_EARLY,
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

  const handleCloseModal = () => {
    handleCloseLateEarly()
    dispatch(
      requestSlice.getRequestsOfDay({
        url: endPoint.GET_REQUEST_LATE_EARLY_OF_DAY,
        date: -1,
      }),
    )
  }

  return (
    <>
      <DialogRequest
        title="Register Late/Early"
        handleModal={handleCloseModal}
        isOpen={isOpen}
        listButton={buttonForm.formRequestButton}
        statusRequest={request.status}
        requestExists={requestExists}
        statusGetRequest={status}
      >
        <>
          <form id="myForm" onSubmit={handleSubmit(onSubmit)}>
            {status === 'loading' ? (
              <Skeleton paragraph={{ rows: 10 }}></Skeleton>
            ) : (
              <>
                <Row style={{ marginBottom: 0 }}>
                  <Col xs={24} md={24} xl={24}>
                    <div className={styles.formGroup} style={{ marginTop: 0 }}>
                      <Col xs={6} md={6} xl={4}>
                        Registration date:
                      </Col>
                      <Col xs={20} md={20} xl={20}>
                        {request?.created_at
                          ? dateTime.formatDateTime(request?.create_at)
                          : ''}
                      </Col>
                    </div>
                  </Col>
                </Row>
                <Row style={!request?.status ? { margin: 0 } : {}}>
                  <Col xs={24} md={24} xl={24}>
                    <div className={styles.formGroup}>
                      <Col xs={6} md={6} xl={4}>
                        Register for date:
                      </Col>
                      <Col xs={20} md={20} xl={20}>
                        {row.work_date}
                      </Col>
                    </div>
                  </Col>

                  <Col xs={24} md={24} xl={24}>
                    <div className={styles.formGroup}>
                      <Col xs={12} md={12} xl={12} style={{ display: 'flex' }}>
                        <Col xs={12} md={12} xl={8}>
                          Check-in:
                        </Col>
                        <Col xs={12} md={12} xl={16}>
                          {handleDateTime.checkInvalidTime(
                            row?.checkin || row?.checkin_original,
                          )}
                        </Col>
                      </Col>
                      <Col xs={12} md={12} xl={12} style={{ display: 'flex' }}>
                        <Col xs={12} md={12} xl={8}>
                          Check-out:
                        </Col>
                        <Col xs={12} md={12} xl={16}>
                          {handleDateTime.checkInvalidTime(
                            row?.checkout || row?.checkout_original,
                          )}
                        </Col>
                      </Col>
                    </div>
                  </Col>

                  <Col xs={24} md={24} xl={24}>
                    <div className={styles.formGroup}>
                      <Col xs={12} md={12} xl={12} style={{ display: 'flex' }}>
                        <Col xs={12} md={12} xl={8}>
                          Late time:
                        </Col>
                        <Col xs={12} md={12} xl={16}>
                          <p style={row?.late ? { color: 'red' } : {}}>
                            {handleDateTime.checkInvalid(row?.late)}
                          </p>
                        </Col>
                      </Col>
                      <Col xs={12} md={12} xl={12} style={{ display: 'flex' }}>
                        <Col xs={12} md={12} xl={8}>
                          Early:
                        </Col>
                        <Col xs={12} md={12} xl={16}>
                          <p style={row?.early ? { color: 'red' } : {}}>
                            {handleDateTime.checkInvalid(row?.early)}
                          </p>
                        </Col>
                      </Col>
                    </div>
                  </Col>

                  <Col xs={24} md={24} xl={24}>
                    <div className={styles.formGroup}>
                      <Col xs={24} md={12} xl={12} style={{ display: 'flex' }}>
                        <Col xs={6} md={12} xl={8}>
                          <span>Date cover up:</span>
                          <span className={styles.requiredField}>(*)</span>
                        </Col>
                        <Col xs={18} md={12} xl={16}>
                          <Controller
                            name="checkDateTime"
                            control={control}
                            render={({ field }) => (
                              <>
                                <DatePicker
                                  disabledDate={(current) =>
                                    current.isAfter(moment())
                                  }
                                  disabled={handleField.disableField(
                                    request.status,
                                  )}
                                  format={dateTime.formatDateTypeYear}
                                  onChange={(e) => {
                                    const res = async () => {
                                      const response = await getCompensation(e)
                                      setOverTime(response)
                                    }
                                    res()
                                    return field.onChange(e)
                                  }}
                                  defaultValue={
                                    request.compensation_date
                                      ? moment(request.compensation_date)
                                      : moment().subtract(1, 'days')
                                  }
                                />
                                {errors.checkDateTime && (
                                  <span className={styles.errorField}>
                                    {errors.checkDateTime?.message}
                                  </span>
                                )}
                              </>
                            )}
                          />
                        </Col>
                      </Col>
                      <Col
                        xs={24}
                        md={12}
                        xl={12}
                        style={{ display: 'flex' }}
                        className={styles.formChild}
                      >
                        <Col
                          xs={12}
                          md={12}
                          xl={12}
                          style={{ display: 'flex' }}
                        >
                          <Col xs={12} md={10} xl={8}>
                            Overtime:
                          </Col>
                          <Col xs={12} md={14} xl={16}>
                            {overTime ? overTime : '--:--'}
                          </Col>
                        </Col>
                        <Col
                          xs={12}
                          md={12}
                          xl={12}
                          style={{ display: 'flex' }}
                        >
                          <Col xs={12} md={14} xl={11}>
                            Time request:
                          </Col>
                          <Col xs={12} md={10} xl={13}>
                            <p
                              style={handleDateTime.compareTime(
                                overTime ? overTime : '00:00',
                                timeRequest,
                              )}
                            >
                              {timeRequest === '00:00' ? '--:--' : timeRequest}
                            </p>
                          </Col>
                        </Col>
                      </Col>
                    </div>
                  </Col>

                  <Col xs={24} md={24} xl={24}>
                    <div
                      className={styles.formGroup}
                      style={{ marginBottom: 0 }}
                    >
                      <Col xs={6} md={6} xl={4} style={{ display: 'flex' }}>
                        Reason:
                        <span className={styles.requiredField}> (*)</span>
                      </Col>
                      <Col xs={18} md={18} xl={20}>
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
                                disabled={handleField.disableField(
                                  request.status,
                                )}
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
                    </div>
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
                              color: checkRequestStatusColorText(
                                request.status,
                              ),
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
    </>
  )
}

Index.propTypes = {
  handleCloseLateEarly: PropTypes.func,
  isOpen: PropTypes.bool,
  row: PropTypes.object,
}

export default Index
