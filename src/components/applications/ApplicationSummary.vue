<script setup>
import { validLeaveType, handoverStatus } from '@/constants/masterData';

const props = defineProps({
    paidLeaveDays: { type: Number, required: true },
    applicationDraft: { type: Array, required: true },
})
</script>
<template>
    <v-table>
        <tbody>
            <tr>
                <th scope="row">休暇種別</th>
                <td>
                    {{validLeaveType.find(type => type.value ===
                        props.applicationDraft.leaveType).title}}
                </td>
            </tr>
            <tr>
                <th scope="row">開始終了日</th>
                <td>
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
                    {{handoverStatus.find(status => status.value ===
                        props.applicationDraft.handoverStatus).title}}
                </td>
            </tr>
        </tbody>
    </v-table>
</template>
<style scoped></style>