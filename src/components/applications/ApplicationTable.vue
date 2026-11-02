<script setup>
import { applicationStatus, validLeaveType } from '@/constants/masterData';

const props = defineProps({
    headers: { type: Object, required: true },
    filteredApplicationList: { type: Array, required: true },
})

const emits = defineEmits(["cancel"]);

function requestCancel(id) {
    emits("cancel", id)
}

function getStatusColor(status) {
    const colors = {
        pending: 'warning',
        approved: 'success',
        returned: 'error',
        cancelled: 'grey',
    };

    return colors[status] ?? 'default';
}

const whiteCard = {
    class: "pa-8",
};
</script>
<template>
    <v-card v-bind="whiteCard">
        <v-data-table :headers="props.headers" :items="props.filteredApplicationList" item-value="id"
            :sort-by="[{ key: 'id', order: 'aec' }]" items-per-page-text="1ページあたりの表示件数">
            <template #item.leaveType="{ item }">
                {{
                    validLeaveType.find(
                        type => type.value === item.leaveType
                    )?.title ?? item.leaveType
                }}
            </template>
            <template #item.status="{ item }">
                <div class="d-flex align-center">
                    <v-chip :color="getStatusColor(item.status)" variant="tonal">
                        {{
                            applicationStatus.find(
                                status => status.value === item.status
                            )?.title ?? item.status
                        }}
                    </v-chip>
                    <v-btn v-if="item.status === 'pending'" icon="mdi-close-circle" variant="text" size="small"
                        color="warning" @click="requestCancel(item.id)" />
                </div>
            </template>
            <template #item.leavePeriod="{ item }">
                {{ item.startDate }} - {{ item.endDate }}
            </template>
        </v-data-table>
    </v-card>
</template>
<style scoped></style>