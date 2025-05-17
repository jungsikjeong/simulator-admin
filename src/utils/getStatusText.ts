export const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return '엔딩 완료'
    case 'in_progress':
      return '진행 중'
    case 'pending':
      return '대기 중'
    default:
      return status
  }
}
