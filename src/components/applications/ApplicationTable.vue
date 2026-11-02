<script setup>
import { validLeaveType } from '@/constants/masterData';
import ApplicationStatusBadge from './ApplicationStatusBadge.vue';
// 从申请一览view接受表头与申请一览数据
const props = defineProps({
    headers: { type: Object, required: true },
    filteredApplicationList: { type: Array, required: true },
})
// 收到标签请求后,进一步请求申请一览view取消申请
const emits = defineEmits(["cancel"]);
function requestCancel(id) {
    emits("cancel", id)
}
// 卡片样式
const whiteCard = {
    class: "pa-8",
};
</script>
<template>
    <v-card v-bind="whiteCard">
        <!-- 显示动态表格, 按ID升序, 说明文字用日语 -->
        <v-data-table :headers="props.headers" :items="props.filteredApplicationList" item-value="id"
            :sort-by="[{ key: 'id', order: 'aec' }]" items-per-page-text="1ページあたりの表示件数">
            <template #item.leaveType="{ item }">
                <!-- 转换显示休暇種別文字 -->
                {{
                    validLeaveType.find(
                        type => type.value === item.leaveType
                    )?.title ?? item.leaveType
                }}
            </template>
            <!-- 转换显示申请状况文字 -->
            <template #item.status="{ item }">
                <!-- 导入申请状态标签组件 -->
                <ApplicationStatusBadge :item="item" @cancel="requestCancel(item.id)"/>
            </template>
            <!-- 拼接显示開始終了日 -->
            <template #item.leavePeriod="{ item }">
                {{ item.startDate }} - {{ item.endDate }}
            </template>
        </v-data-table>
    </v-card>
</template>
<style scoped></style>