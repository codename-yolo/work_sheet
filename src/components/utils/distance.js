const distance = (idElement, percent = 55) => {
  const header = document.querySelector('#Header_TimeSheet')
  const homeTable = document.querySelector(`#${idElement}`)
  const screenHeight = screen.height
  const HEIGHT = screenHeight - header.getBoundingClientRect().height - 160
  homeTable.style.height = HEIGHT + 'px'
  homeTable.style.maxHeight = HEIGHT + 'px'
  const height = screenHeight - header.getBoundingClientRect().height
  return {
    height: height,
    heightTable: height - (height / 100) * percent,
  }
}

export default distance
