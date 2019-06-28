<template>
    <div class="w-100">
        <form v-if="destination" @submit.prevent="saveCourse" class="destination-details w-100 bg-light border px-5 pt-5 pb-3">
            <h6><b>Name: </b><input required placeholder="update me" tabindex="1" @focus="e => e.target.select()" v-model="destination.name" /></h6>
            <h6><b>Address: </b>{{destination.address}}</h6>
            <hr />
            <h6><b># of holes: </b><input required type="number" min="0" placeholder="update me" tabindex="2" @focus="e => e.target.select()" v-model="destination.holeCount" @input="genDestinationHoles" /></h6>
            <h6 class="d-flex flex-column" v-for="(hole, i) in destination.holes || []"><b>Hole {{i+1}}: </b><textarea cols="100" rows="3" placeholder="description" :tabindex="i+3" @focus="e => e.target.select()" v-model="hole.description"></textarea></h6>
            <hr v-if="destination.holes" />
            <h6 class="d-flex flex-column"><b>Notes: </b><textarea placeholder="additional comments" cols="100" rows="3" @focus="e => e.target.select()" v-model="destination.notes" @input="genDestinationHoles"></textarea></h6>
            <div class="w-100 d-flex justify-content-center mt-3">
                <button type="submit" class="btn btn-info">{{destination._id ? 'Update' : 'Save'}} Course</button>
            </div>
        </form>
    </div>
</template>

<script>
import DetailsDefault from '@/components/DetailsDefault.vue'

export default {
   name: "destination-details",
   props: [],
   data() {
      return {}
   },
   computed: {
       destination() {
           let d = this.$store.state.destination
           let c = this.$store.state.course
           return c._id ? c : d
       }
   },
   methods: {
       genDestinationHoles() {
           let arr = this.destination.holes || []
           while(arr.length <= this.destination.holeCount) arr.push({ description: '' })
           while(arr.length > this.destination.holeCount) arr.pop()
           this.destination.holes = arr
       },
       saveCourse() {
           if(!this.destination.holeCount) return alert('Please specify the number of holes')
           this.$store.dispatch('saveCourse', this.destination)
       }
   },
   components: { DetailsDefault }
}
</script>

<style>
.destination-details input, .destination-details:active input, .destination-details:focus input, 
.destination-details textarea, .destination-details:active textarea, .destination-details:focus textarea {
    margin-left: 5px;
    margin-bottom: 5px;
    background-color: transparent;
    box-shadow: none;
    outline: none;
    border: none;
    font-weight: 500;
}
.destination-details textarea, .destination-details:active textarea, .destination-details:focus textarea {
    font-weight: 400;
}
</style>
