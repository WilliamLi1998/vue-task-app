<script setup>
import { ref } from 'vue';

const props = defineProps({
    formError: { type: String },
});

const formErrorBar = ref(null);

function scrollToError() {
    formErrorBar.value?.$el?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
    });
}

defineExpose({
    scrollToError,
});
</script>

<template>
    <!-- 错误信息栏 -->
    <v-alert v-if="props.formError" ref="formErrorBar" type="error" variant="tonal" class="mb-4">
        {{ props.formError }}
    </v-alert>
</template>

<style scoped></style>