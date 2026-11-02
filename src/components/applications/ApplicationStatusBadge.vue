<script setup>
import { applicationStatus } from '@/constants/masterData';
// 从申请一览表格获取申请条目
const props = defineProps({
    item: { type: Object, required: true },
})
// 请求申请一览表格取消申请
const emits = defineEmits(["cancel"]);
function requestCancel() {
    emits("cancel");
}
// 根据状态获取颜色
function getStatusColor(status) {
    return applicationStatus.find(
        status => status.value === props.item.status
    )?.color ?? 'default';
}
</script>
<template>
    <!-- 状态标签与取消按钮并排 -->
    <div class="d-flex align-center">
        <!-- 申请状态标签 -->
        <v-chip :color="getStatusColor(props.item.status)" variant="tonal">
            <!-- 根据状态值获取文字 -->
            {{
                applicationStatus.find(
                    status => status.value === props.item.status
                )?.title ?? props.item.status
            }}
        </v-chip>
        <!-- 状态为申请中时显示取消按钮 -->
        <v-btn v-if="props.item.status === 'pending'" icon="mdi-close-circle" variant="text" size="small"
            color="warning" @click="requestCancel" />
    </div>
</template>
<style scoped></style>