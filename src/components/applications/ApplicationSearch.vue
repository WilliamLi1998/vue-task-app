<script setup>
import { applicationStatus } from "@/constants/masterData.js";
import { useApplications } from "@/stores/applications.js";

const applications = useApplications();

const model = defineModel({ required: true })

const emitw = defineEmits(["search"]);

function requestLoadLIst() {
    if (applications.status !== 'loaded') {
        return;
    }
    emits("search");
}

const buttonStyle = {
    block: true,
    color: 'primary',
    size: 'x-large',
    class: 'my-4',
}
</script>
<template>
    <v-container>
        <v-row align="center">
            <v-col cols="12" md="4" class="align-center">
                <v-select v-model="model.status" :items="applicationStatus" item-title="title" item-value="value"
                    label="申請状態" placeholder="すべて" clearable hide-details />
            </v-col>
            <v-col cols="12" md="6" class="align-center">
                <v-text-field label="検索キーワード" v-model="model.keyword" id="keyword" name="keyword" type="text"
                    maxlength="100" hide-details />
            </v-col>
            <v-col cols="12" md="2" class="d-flex align-center">
                <v-btn v-bind="buttonStyle" @click="requestLoadLIst()">検索</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
<style scoped></style>