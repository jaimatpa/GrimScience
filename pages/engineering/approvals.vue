<script lang="ts" setup>
useSeoMeta({
    title: "Grimm-Engineering approvals",
});
import EngineeringApprovalsApprovalList from "@/components/engineering/approvals/ApprovalList.vue";
</script>

<template>
    <div class="w-full">
        <EngineeringApprovalsApprovalList :is-page="true" />
    </div>
</template>
