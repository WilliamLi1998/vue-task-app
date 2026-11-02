//休假类型
export const validLeaveType = [
    { title: '有給休暇', value: 'paid' },
    { title: '半日休暇（午前）', value: 'half-am' },
    { title: '半日休暇（午後）', value: 'half-pm' },
    { title: '特別休暇', value: 'special' }
]
//交接状态
export const handoverStatus = [
    { title: '対応済', value: 'done' },
    { title: '対応不要', value: 'not-required' },
]
//申请状态
export const applicationStatus = [
    { title: '申請中', value: 'pending' },
    { title: '承認済', value: 'approved' },
    { title: '差戻し', value: 'returned' },
    { title: '取消済', value: 'cancelled' },
]