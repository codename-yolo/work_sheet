import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Input } from 'antd'
import { dateTime, checkRequest } from '../../../../index'
const {
  checkRequestType,
  checkRequestStatus,
  checkRequestErrorType,
  checkRequestLeave,
  checkRequestLeavePaid,
  checkRequestTwoCondition,
  checkRequestStatusColorText,
} = checkRequest
import './RequestDetail.scss'

const RequestDetail = ({ row, refInput, roleUser, commentInput }) => {
  const {
    check_in: checkIn,
    check_out: checkOut,
    request_type: requestType,
    request_for_date: requestForDate,
    status: requestStatus,
    full_name: fullName,
    email,
    reason,
    status,
    error_count: errorType,
    leave_time: leaveTime,
    request_ot_time: otTime,
    compensation_time: compensationTime,
    compensation_date: compensationDate,
    manager_confirmed_comment: managerConfirmedComment,
    admin_approved_comment: adminApprovedComment,
  } = row

  const onChange = (e) => {
    if (!e.target.value.trim()) {
      commentInput.setEmpty(true)
    } else {
      commentInput.setEmpty(false)
    }
  }
  return (
    <div className="requestDetail">
      <Row style={{ margin: 0 }}>
        <Col xl={15} style={{ paddingRight: '10px' }}>
          <Row>
            <Col xl={8}>Request type:</Col>
            <Col xl={16}>
              <strong>{checkRequestType(requestType)}</strong>
            </Col>
          </Row>
          <Row>
            <Col xl={8}>Request for date:</Col>
            <Col xl={16}>{dateTime.formatDateTable(requestForDate)}</Col>
          </Row>
          <Row>
            <Col xl={8}>From member:</Col>
            <Col xl={16}>
              <span>
                {fullName} ({email})
              </span>
            </Col>
          </Row>
          <Row>
            <Col xl={8}>Reason:</Col>
            <Col xl={16}>{reason}</Col>
          </Row>
          <Row>
            <Col xl={8}>Status:</Col>
            <Col xl={16}>
              <strong style={{ color: checkRequestStatusColorText(status) }}>
                {checkRequestStatus(status).toUpperCase()}
              </strong>
            </Col>
          </Row>
          {((roleUser === 'Manager' && requestStatus !== 0) ||
            roleUser === 'Admin') && (
            <Row>
              <Col xl={8}>Manager Comment:</Col>
              <Col xl={16}>
                {roleUser === 'Admin'
                  ? adminApprovedComment || managerConfirmedComment
                  : roleUser === 'Manager'
                  ? managerConfirmedComment
                  : ''}
              </Col>
            </Row>
          )}
          {(roleUser === 'Admin' && requestStatus === 1) ||
          (roleUser === 'Manager' && requestStatus === 0) ? (
            <Row style={{ margin: 0 }}>
              <Col xl={8}>
                Comment:<span style={{ color: 'red' }}> (*)</span>
              </Col>
              <Col xl={16}>
                <Input.TextArea
                  ref={refInput}
                  onChange={onChange}
                  autoSize={{ minRows: 3, maxRows: 3 }}
                  maxLength={100}
                  placeholder="Please enter not too 100 characters"
                  showCount
                ></Input.TextArea>
                {commentInput.value && (
                  <span className="requiredField">Please enter comment</span>
                )}
              </Col>
            </Row>
          ) : (
            <></>
          )}
        </Col>
        <Col
          xl={9}
          style={{ borderLeft: '1px solid #e0e0e0', paddingLeft: '10px' }}
        >
          <Row>
            <Col xl={12}>Check In:</Col>
            <Col xl={12}>{dateTime.formatTime(checkIn)}</Col>
          </Row>
          <Row>
            <Col xl={12}>Check Out:</Col>
            <Col xl={12}>{dateTime.formatTime(checkOut)}</Col>
          </Row>
          {requestType === 1 && (
            <Row>
              <Col xl={12}>Error type:</Col>
              <Col xl={12}>{checkRequestErrorType(errorType)}</Col>
            </Row>
          )}
          {checkRequestTwoCondition(requestType === 2, requestType === 3) && (
            <>
              <Row>
                <Col xl={12}>Leave time:</Col>
                <Col xl={12}>{checkRequestLeave(leaveTime)}</Col>
              </Row>
              <Row>
                <Col xl={12}>Leave Type:</Col>
                <Col xl={12}>{checkRequestLeavePaid(requestType)}</Col>
              </Row>
            </>
          )}
          {requestType === 4 && (
            <>
              <Row>
                <Col xl={12}> Compensation Date:</Col>
                <Col xl={12}>{dateTime.formatDateTable(compensationDate)}</Col>
              </Row>
              <Row>
                <Col xl={12}>Compensation Time:</Col>
                <Col xl={12}>{compensationTime}</Col>
              </Row>
            </>
          )}
          {requestType === 5 && (
            <Row>
              <Col xl={12}>OT Time:</Col>
              <Col xl={12}>{otTime}</Col>
            </Row>
          )}
        </Col>
      </Row>
    </div>
  )
}

RequestDetail.propTypes = {
  row: PropTypes.object,
  refInput: PropTypes.object,
  roleUser: PropTypes.string,
  commentInput: PropTypes.object,
}

export default RequestDetail
