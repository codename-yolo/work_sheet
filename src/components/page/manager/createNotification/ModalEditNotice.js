import React from 'react'
import Dialog from '../../../common/createModal/Modal'
import CreateNotification from './CreateNotification'
import PropTypes from 'prop-types'
import './CreateNotification.scss'

const ModalEditNotice = (props) => {
  const { isOpen, handleModal, data } = props

  return (
    <Dialog
      isOpen={isOpen}
      handleModal={handleModal}
      className={'modalNotice'}
      title="Create Notifications Draft"
    >
      <CreateNotification data={data} handleModal={handleModal} />
    </Dialog>
  )
}

ModalEditNotice.propTypes = {
  isOpen: PropTypes.bool,
  handleModal: PropTypes.func,
  data: PropTypes.object,
}

export default ModalEditNotice
