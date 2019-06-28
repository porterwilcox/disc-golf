<template>
    <div class="details-default text-center text-muted pt-5 mt-5 w-100">
        <h2 v-if="!location">Where you tryna play?</h2>
        <h2 v-else><i class="fas fa-spinner color fa-spin"></i></h2>
    </div>
</template>

<script>
export default {
   name: "details-default",
   props: ['location'],
   mounted() {
       document.querySelector('.add-course input').focus()
   }
}
</script>