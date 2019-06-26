<template>
    <div class="map-generator">
        <div class="d-flex align-items-center justify-content-center">
            <h4 data-toggle="tooltip" data-placement="top" :title="addressProper" class="text-truncate mr-2">{{addressProper}}</h4>
            <i @click="copy" data-toggle="tooltip" data-placement="top" :title="copied ? 'Copied!' : 'Copy Address'" class="far fa-copy btn btn-outline-info action"></i>
        </div>
        <div @mouseenter="toggleMapEvents" @click="toggleMapEvents" tabindex="1" class="map action col-12 offset-md-3 col-md-6">
            <div @click="getUserLocation" class="map-overlay no-events d-flex justify-content-center align-items-center">
                <h4 class="text-white">Get Directions</h4>
            </div>
        </div>
    </div>
</template>

<script>
import Axios from 'axios'
import { gMapKey } from '@/utils/keys.js'
import { setTimeout } from 'timers';

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
          bounce: null,
          destination: {}
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
           this.destination = coords
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
       },
       getUserLocation(e) {
           e.stopPropagation()
           if(!navigator.geolocation) return alert('sorry your device isn\'t compatible.')
           navigator.geolocation.getCurrentPosition(({coords}) => {
                this.getDirections(coords)            
           })
       },
       toggleMapEvents() {
           if(this.bounce) {
               clearTimeout(this.bounce._id)
           }
           this.bounce = setTimeout(() => {
               let mapOverlay = document.querySelector('.map-overlay')
               let classes = Array(...mapOverlay.classList)
               if(classes.includes('no-events')) mapOverlay.classList.remove('no-events')
               else mapOverlay.classList.add('no-events')
           }, 500)
       },
       async getDirections({latitude: lat, longitude: lng}) {
           let query = `directions/json?origin=${lat},${lng}&destination=${this.destination.lat},${this.destination.lng}&key=${gMapKey}`
           let res = await mapsAPI.get(query)
           console.log(res)
       }
   },
   components: {}
}
</script>

<style>
.map {
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 50vh;
    border: 2px outset var(--secondary)
}
.map-overlay {
    top: 0;
    left: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    background: #0c014d7e;
    visibility: hidden;
}
.map:hover .map-overlay, .map:hover .map-overlay *, .map:focus .map-overlay {
    visibility: visible;
}
</style>
