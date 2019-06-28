<template>
    <div class="add-course row justify-content-center">
        <navigation :title="'Course Info'" />
        <div class="input-group w-100 d-flex justify-content-center my-3">
            <form @submit.prevent="toggleMapGen = false; setTimeout(() => {toggleMapGen = true}, 500)">
                <input class="location" v-model="location" type="text" placeholder="location" @input="setLocation">
            </form>
        </div>
        <div class="col-12 justify-content-around d-flex my-2 mb-4">
            <h4 @click="setTab(i)" :class="i == activeTab ? 'active-tab no-events' : 'action'" class="tab-bottom text-center" v-for="({title}, i) in tabs">{{title}}</h4>
        </div>
        <div class="col-11">
            <div class="row">
                <map-generator @startUp="setTab" class="w-100" v-if="toggleMapGen && location" :location="location.replace(/\s+/g, '+')" />
                <details-default :location="location" v-else-if="!activeTab" />
                <destination-details v-if="toggleDestinationDetails" />
            </div>
        </div>
    </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import MapGenerator from '@/components/MapGenerator.vue'
import DestinationDetails from '@/components/DestinationDetails.vue'
import DetailsDefault from '@/components/DetailsDefault.vue'

import { setTimeout } from 'timers';
export default {
   name: "add-course",
   props: [],
   data() {
      return {
        toggleMapGen: false,
        toggleDestinationDetails: false,
        location: '',
        bounce: null,
        setTimeout,
        tabs: [{title: 'Search Result', toggle: 'toggleMapGen'},
        {title: 'Course Details', toggle: 'toggleDestinationDetails'},
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
           if(!this.location) return
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
   components: { MapGenerator, Navigation, DestinationDetails, DetailsDefault },
   watch: {
       activeTab:{
           handler(val) {
                if(val == 1) return
                setTimeout(() => {
                    let tab = document.querySelector('.active-tab')
                    if(!val) tab.style.borderLeft = 'none'
                    else tab.style.borderRight = 'none'
                }, 500)
           },
           immediate: true
       },
       location: {
            handler(val, oldVal) {
                !val ? this.$store.dispatch('resetDandC') : ''
                if(!oldVal) return
                if (val.length < oldVal.length) this.toggleMapGen = false
            },
            immediate: true
        }
    }
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
  border-bottom: none;
}
.location, .location:active, .location:focus {
    margin-left: 5px;
    margin-bottom: 5px;
    background-color: transparent;
    border: none;
    box-shadow: none;
    outline: none;
    border-bottom: 1px solid var(--main);
}
.location:active, .location:focus {
    border-bottom-width: 2px;
}
</style>
