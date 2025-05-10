// 증가/감소에 따른 색상 결정
const getColorClass = (value: number) => {
  if (value > 0) return 'text-emerald-500'
  if (value < 0) return 'text-red-500'
  return 'text-gray-500'
}

// 증가/감소에 따른 접두사 결정
const getPrefix = (value: number) => {
  if (value > 0) return '+'
  if (value < 0) return ''
  return ''
}

export { getColorClass, getPrefix }
