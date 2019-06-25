<template>
    <div class="add-course row justify-content-center">
        <navigation :title="'Add Course'" />
        <div class="col-11">
            <div class="row">
                <div class="col-12 col-md-8 offset-md-2 d-flex justify-content-between my-3">
                    <h2>Where you tryna play?</h2>
                    <div class="input-group w-fc">
                        <input v-model="location" type="text" placeholder="location" @input="setLocation">
                        <div @click="toggleMapGen = false; setTimeout(() => {toggleMapGen = true}, 500)" class="input-group-append action">
                            <span class="input-group-text text-info"><i class="fas fa-search-location fa-lg"></i></span>
                        </div>
                    </div>
                </div>
                <div class="col-12 justify-content-around d-flex my-2 mb-4">
                    <h4 @click="setTab(i)" :class="i == activeTab ? 'active-tab no-events' : 'action'" class="tab-bottom text-center" v-for="({title}, i) in tabs">{{title}}</h4>
                </div>
                <map-generator @startUp="setTab" class="w-100" v-if="toggleMapGen" :location="location.replace(/\s+/g, '+')" />
            </div>
        </div>
    </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import MapGenerator from '@/components/MapGenerator.vue'
import { setTimeout } from 'timers';
export default {
   name: "add-course",
   props: [],
   data() {
      return {
        toggleMapGen: false,
        location: '',
        bounce: null,
        setTimeout,
        tabs: [{title: 'Search Result', toggle: 'toggleMapGen'},
        {title: 'Save Details', toggle: 'toggleSaveDetails'},
        {title: 'Course History', toggle: 'toggleCourseHistory'}],
        activeTab: 0
      }
   },
   computed: {},
   methods: {
       setLocation() {
           if(this.bounce) {
               clearTimeout(this.bounce._id)
           }
           this.bounce = setTimeout(() => { this.toggleMapGen = true }, 1000)
       },
       setTab(i) {
           let propToToggle = this.tabs[this.activeTab].toggle
           this.$data[propToToggle] = false
           propToToggle = this.tabs[i].toggle
           this.$data[propToToggle] = true
           this.activeTab = i
       }
   },
   components: { MapGenerator, Navigation }
}
</script>

<style>
.tab-bottom {
  padding-bottom: 2vh;
  border-bottom: 1px solid var(--main);
  width: 100%;
  opacity: .5;
}
.active-tab {
  border: 1px solid var(--main);
  opacity: 1;
  border-top-left-radius: 5%;
  border-top-right-radius: 5%;
  border-bottom: none;
}
</style>
