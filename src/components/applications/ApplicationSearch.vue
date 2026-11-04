<script setup>
import { applicationStatus } from "@/constants/masterData.js";
import { useApplications } from "@/stores/applications.js";

const applications = useApplications();
// v-model与一览表view同步表单输入查询条件
const model = defineModel({ required: true });
// 请求一览表view条件搜索
const emits = defineEmits(["search"]);
async function requestLoadList() {
    if (applications.status !== 'loaded') {
        return;
    }
    // 禁止非法日期
    // if (model.value.startDate && model.value.endDate && model.value.startDate > model.value.endDate) {
    //     alert("終了日は開始日以降の日付を選択してください");
    //     return;
    // }

    emits("search");
}

// 按钮样式
const buttonStyle = {
    block: true,
    color: 'primary',
    size: 'x-large',
    class: 'my-4',
}
</script>
<template>
    <v-container fluid class="px-0">
        <!-- 申请搜索栏布局 -->
        <v-row align="center">
            <!-- 申请状态单选框 -->
            <v-col cols="12" md="4" class="align-center">
                <v-select v-model="model.status" :items="applicationStatus" item-title="title" item-value="value"
                    label="申請状態" placeholder="すべて" clearable hide-details />
            </v-col>
            <!-- 申请关键词输入框 -->
            <v-col cols="12" md="6" class="align-center">
                <v-text-field label="検索キーワード" v-model="model.keyword" id="keyword" name="keyword" type="text"
                    maxlength="100" hide-details />
            </v-col>
            <!-- 搜索按钮 -->
            <v-col cols="12" md="2" class="d-flex align-center">
                <v-btn v-bind="buttonStyle" @click="requestLoadList()">検索</v-btn>
            </v-col>
        </v-row>
        <!-- 日期搜索栏 -->
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field label="開始日" type="date" v-model="model.startDate" hide-details />
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field label="終了日" type="date" v-model="model.endDate" hide-details />
            </v-col>
        </v-row>
    </v-container>
</template>
<style scoped></style>