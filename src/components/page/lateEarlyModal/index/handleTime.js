export const handlePlusTime = (start, end) => {
  const arr = [end ? end : '00:00', start ? start : '00:00']
  const result = arr.reduce((current, next) => {
    const hours = next.split(':')
    return current + Number(hours[0]) * 60 + Number(hours[1])
  }, 0)

  const hour = Math.floor(result / 60)

  if (hour >= 1) {
    return {
      hours: hour,
      minutes: result - hour * 60,
    }
  } else {
    return {
      hours: hour,
      minutes: result,
    }
  }
}

export const handleSubTime = (start, end) => {
  const hours1 = start.split(':')
  const hours2 = end.split(':')
  const hours =
    +hours2[1] - +hours1[1] > 0
      ? +hours2[0] - +hours1[0]
      : +hours2[0] - +hours1[0] - 1
  const minutes =
    +hours2[1] - +hours1[1] > 0
      ? +hours2[1] - +hours1[1]
      : 60 + (+hours2[1] - +hours1[1])
  if (hours < 9 || !hours) {
    return null
  }
  return handleFormat({ hours: hours - 9, minutes })
}

export const handleFormat = (times) => {
  const hours =
    times.hours.toString().length > 1 ? times.hours : `0${times.hours}`
  const minutes =
    times.minutes.toString().length > 1 ? times.minutes : `0${times.minutes}`
  return `${hours}:${minutes}`
}
