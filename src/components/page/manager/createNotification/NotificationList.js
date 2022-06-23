/* eslint-disable object-curly-spacing */
import { Button, Col, Modal, Row } from 'antd'
import moment from 'moment'
import * as React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CMTable } from '../../..'
import ModalEditNotice from './ModalEditNotice'
import { delItemListNoticeDraft, getDataListNoticeDraft } from './slice/slice'

const NotificationList = () => {
  const dispatch = useDispatch()
  const [modal, setModal] = useState({ open: false, data: {} })
  const [load, setLoad] = useState(false)

  useEffect(() => {
    const returnData = async () => {
      await dispatch(getDataListNoticeDraft({ perPage: 10, page: 1 }))
    }
    returnData()
  }, [load])

  const dataNoticeDraft = useSelector((state) => {
    return state.noticeListDraft
  })

  const confirmCancel = (record) => {
    Modal.confirm({
      title: 'CLOSE MODAL',
      content: 'Are you sure ?',
      okText: 'Cancel',
      cancelText: 'OK',
      okButtonProps: {
        type: 'default',
      },
      cancelButtonProps: {
        style: { padding: '0 28px' },
        type: 'primary',
      },
      onCancel() {
        dispatch(delItemListNoticeDraft(record.id))
        setLoad(!load)
      },
    })
  }

  const columns = [
    {
      title: <p>NO</p>,
      dataIndex: 'id',
      key: 'id',
      render: (payload, recored) => {
        return (
          <p className="resetMargin">
            {(dataNoticeDraft.page - 1) * 10 + Number(recored.key) + 1}
          </p>
        )
      },
    },
    {
      title: <p>AUTHOR</p>,
      dataIndex: 'author',
      key: 'author',
      render: (payload, recored) => {
        return <p className="textOverFlow resetMargin">{recored.created_by}</p>
      },
    },
    {
      title: <p>SUBJECT</p>,
      dataIndex: 'subject',
      key: 'subject',
      render: (payload, recored) => {
        return <p className="textOverFlow resetMargin">{recored.subject}</p>
      },
    },
    {
      title: <p>Published Date</p>,
      dataIndex: 'published_date',
      key: 'published_date',
      render: (payload, recored) => {
        return (
          <p className="textOverFlow resetMargin">{recored.published_date}</p>
        )
      },
    },
    {
      title: <p>Status</p>,
      dataIndex: 'status',
      key: 'status',
      render: (payload, recored) => {
        return (
          <p className="textOverFlow resetMargin">
            {moment(recored.published_date).unix() > moment().unix()
              ? 'Bản tương lai'
              : 'Đã Xuất bản'}
          </p>
        )
      },
    },
    {
      title: <p> ACTION </p>,
      dataIndex: 'action',
      key: 'action',
      render: (payload, record) => {
        return (
          <Row>
            <Col ms={12} md={12} xl={12}>
              <p
                className="tb_center colorBlue resetMargin"
                onClick={() => setModal({ open: true, data: record })}
              >
                Details
              </p>
            </Col>
            <Col xs={12} md={12} xl={12}>
              <p
                className="tb_center colorBlue resetMargin"
                onClick={() => confirmCancel(record)}
              >
                Delete
              </p>
            </Col>
          </Row>
        )
      },
    },
  ]

  const onShowSizeChange = (page, size) => {
    dispatch(getDataListNoticeDraft({ perPage: size, page: page }))
  }

  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return (
        <>
          <button
            style={
              dataNoticeDraft.currentPage === 1 ? { cursor: 'not-allowed' } : {}
            }
            onClick={(e) => {
              e.stopPropagation()
              dispatch(
                getDataListNoticeDraft({
                  perPage: dataNoticeDraft.per_page,
                  page: 1,
                }),
              )
            }}
            className="ant-pagination-item"
          >
            <i className="fa-solid fa-angles-left" />
          </button>
          <button
            className="ant-pagination-item"
            style={
              dataNoticeDraft.currentPage === 1 ? { cursor: 'not-allowed' } : {}
            }
          >
            <i className="fa-solid fa-angle-left" />
          </button>
        </>
      )
    }

    if (type === 'next') {
      return (
        <>
          <button
            className="ant-pagination-item"
            style={
              dataNoticeDraft.currentPage === dataNoticeDraft.lastPage
                ? { cursor: 'not-allowed' }
                : {}
            }
          >
            <i className="fa-solid fa-angle-right" />
          </button>
          <button
            style={
              dataNoticeDraft.currentPage === dataNoticeDraft.lastPage
                ? { cursor: 'not-allowed' }
                : {}
            }
            onClick={(e) => {
              e.stopPropagation()
              dispatch(
                getDataListNoticeDraft({
                  perPage: dataNoticeDraft.per_page,
                  page: dataNoticeDraft.lastPage,
                }),
              )
            }}
            className="ant-pagination-item"
          >
            <i className="fa-solid fa-angles-right" />
          </button>
        </>
      )
    }

    return originalElement
  }

  const onChange = (size, page) => {
    dispatch(getDataListNoticeDraft({ perPage: page, page: size }))
  }

  return (
    <div>
      <Row
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          borderRadius: 5,
        }}
      >
        <Col xs={24} md={22} xl={22}>
          <CMTable
            title={() => {
              return (
                <Row style={{ justifyContent: 'space-between' }}>
                  <Col xl={12} md={12} xs={12}>
                    <h2>List Notice Draft</h2>
                  </Col>
                  <Col xl={12} md={12} xs={12} style={{ textAlign: 'right' }}>
                    <Button onClick={() => setModal({ open: true })}>
                      Create Notice Draft
                    </Button>
                  </Col>
                </Row>
              )
            }}
            data={dataNoticeDraft.tableData}
            loading={dataNoticeDraft.loading}
            columns={columns}
            pagination={{
              current: dataNoticeDraft.currentPage,
              total: dataNoticeDraft.total,
              onShowSizeChange: onShowSizeChange,
              itemRender: itemRender,
              onChange: onChange,
            }}
            scroll={{
              x: 1000,
              y: 400,
            }}
            sorter={{ published_date: 'date' }}
            width={{
              id: '5%',
              subject: '20%',
            }}
          />
        </Col>
      </Row>
      <ModalEditNotice
        isOpen={modal.open}
        handleModal={() =>
          setModal((prev) => {
            return { ...prev, open: false }
          })
        }
        data={modal?.data}
      />
    </div>
  )
}

export default NotificationList
