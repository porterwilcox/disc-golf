<template>
    <div class="map-generator">
        <div class="d-flex align-items-center justify-content-center">
            <h4 data-toggle="tooltip" data-placement="top" :title="addressProper" class="text-truncate mr-2">{{addressProper}}</h4>
            <i @click="copy" data-toggle="tooltip" data-placement="top" :title="copied ? 'Copied!' : 'Copy Address'" class="far fa-copy btn btn-outline-info action"></i>
        </div>
        <div class="map col-12 offset-md-3 col-md-6"></div>
    </div>
</template>

<script>
import Axios from 'axios'
import { gMapKey } from '@/utils/keys.js'

let mapsAPI = Axios.create({
    baseURL: 'https://maps.googleapis.com/maps/api/',
    timeout: 3000
})

export default {
   name: "map-generator",
   props: ["location"],
   created() {
       this.$emit('startUp', 0)
       if(this.location) this.getCoords()
   },
   data() {
      return {
          addressProper: '',
          copied: false,
      }
   },
   computed: {},
   methods: {
       async getCoords() {
           let query = `geocode/json?address=${this.location}&key=${gMapKey}`
           let { data: { results } } = await mapsAPI.get(query)
           if(!results.length) return alert('Sorry, that place doesn\'t exist.')
           let { formatted_address: address, geometry: { location: coords } } = results[0]
           this.addressProper = address
           this.genMap(coords)
       },
       genMap({lat, lng}) {
           let map = document.querySelector('.map')
           map.style.backgroundImage = `url("https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=17&size=1000x1000&sensor=false&key=${gMapKey}")`
       },
       copy() {
          let el = document.createElement('textarea');
          el.value = this.addressProper;
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
          this.copied = true
          setTimeout(() => { this.copied = false }, 2500)
       }
   },
   components: {}
}
</script>

<style>
.map {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 50vh;
    border: 2px outset var(--secondary)
}
</style>
