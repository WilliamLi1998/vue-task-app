<script setup>
import { validLeaveType, handoverStatus } from '@/constants/masterData';
// 从申请确认view获取申请数据
const props = defineProps({
    paidLeaveDays: { type: Number, required: true },
    applicationDraft: { type: Object, required: true },
})
</script>
<template>
    <v-table>
        <tbody>
            <tr>
                <th scope="row">休暇種別</th>
                <td>
                    <!-- 转换显示休暇種別文字 -->
                    {{validLeaveType.find(type => type.value ===
                        props.applicationDraft.leaveType).title}}
                </td>
            </tr>
            <tr>
                <th scope="row">開始終了日</th>
                <td>
                    <!-- 拼接開始終了日 -->
                    {{ props.applicationDraft.startDate + " - " + props.applicationDraft.endDate }}
                </td>
            </tr>
            <tr>
                <th scope="row">休暇期間</th>
                <td>{{ props.paidLeaveDays }}</td>
            </tr>
            <tr>
                <th scope="row">申請理由</th>
                <td>{{ props.applicationDraft.reason }}</td>
            </tr>
            <tr>
                <th scope="row">引継ぎ状況</th>
                <td>
                    <!-- 转换显示申请状况文字 -->
                    {{handoverStatus.find(status => status.value ===
                        props.applicationDraft.handoverStatus).title}}
                </td>
            </tr>
        </tbody>
    </v-table>
</template>
<style scoped></style>