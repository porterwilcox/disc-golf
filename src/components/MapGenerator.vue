<template>
    <div class="map-generator">
        <div class="d-flex align-items-center justify-content-center">
            <h4 data-toggle="tooltip" data-placement="top" :title="address" class="text-truncate mr-2">{{address}}</h4>
            <i @click="copy" data-toggle="tooltip" data-placement="top" :title="copied ? 'Copied!' : 'Copy Address'" class="far fa-copy btn btn-outline-info action"></i>
        </div>
        <div @mouseenter="toggleMapEvents" @click="toggleMapEvents" tabindex="1" class="map action col-12 offset-md-3 col-md-6">
            <div @click="getUserLocation" class="map-overlay no-events d-flex flex-column justify-content-center align-items-center text-white">
                <h4>Get Directions</h4>
            </div>
        </div>
    </div>
</template>

<script>
import Axios from 'axios'
import { gMapKey, directionsAndRoutesKey } from '@/utils/keys.js'
import { setTimeout } from 'timers';

let baseURL = 'https://maps.googleapis.com/maps/api/', 
proxy = 'https://cors-anywhere.herokuapp.com/', 
mapsAPI = Axios.create({
    baseURL,
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
          address: '',
          copied: false,
          bounce: null,
          destination: {},
          directions: ''
      }
   },
   computed: {},
   methods: {
       async getCoords() {
           let query = `geocode/json?address=${this.location}&key=${gMapKey}`
           let { data: { results } } = await mapsAPI.get(query)
           if(!results.length) return alert('Sorry, that place doesn\'t exist.')
           let { formatted_address: address, geometry: { location: coords } } = results.find(({ formatted_address: address }) => address.toUpperCase().includes('DISC')) || results[0]
           this.address = address
           this.destination = coords
           this.genMap(coords)
       },
       genMap({lat, lng}) {
           let map = document.querySelector('.map')
           map.style.backgroundImage = `url("https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=17&size=1000x1000&sensor=false&key=${gMapKey}")`
       },
       copy() {
           let el = document.createElement('textarea');
           el.value = this.address;
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
           if(this.directions) return
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
           if(this.directions) return
           let query = `directions/json?origin=${lat},${lng}&destination=${this.destination.lat},${this.destination.lng}&key=${directionsAndRoutesKey}`
           let { data: { routes } } = await Axios.get(proxy + baseURL + query)
           if (!routes.length) return alert('Sorry no directions available.')
           let directions = routes[0].legs[0].steps.map(e => '<p>'+e.html_instructions+'</p>')
           this.directions = directions
           this.displayDirections()
       },
       displayDirections() {
           let mapOverlay = document.querySelector('.map-overlay'),
           template = ''
           this.directions.forEach(s => template += s)
           mapOverlay.innerHTML = template
           mapOverlay.style.background = 'var(--main)'
           mapOverlay.style.paddingTop = '20vh'
           mapOverlay.style.overflowY = 'scroll'
       }
   },
   components: {},
   watch: {
       destination(coords) {
           this.$store.dispatch('isDestinationACourse', { coords, address: this.address })
       }
   }
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
    overflow-x: hidden;
}
.map:hover .map-overlay, .map:hover .map-overlay *, .map:focus .map-overlay {
    visibility: visible;
}
</style>
