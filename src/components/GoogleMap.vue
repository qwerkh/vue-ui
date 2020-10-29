<template>
  <div>
    <div class="card-box second-margin">
      <div class="card-header flex between">
        <h5 class="flex middle">ស្វែងរកទីតាំង</h5>
        <div class="flex middle">
          <gmap-autocomplete
            class="el-input__inner"
            style="width: 500px;font-size: 0.87em;"
            @place_changed="setPlace"
          ></gmap-autocomplete>
          <button type="success" class="btn-round flex center middle" @click="addMarker">+</button>
        </div>
      </div>
      <div class="card-body">
        <GmapMap
          :center="center"
          :zoom="15"
          map-type-id="terrain"
          style="width:100%; height: 600px"
        >
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            :draggable="true"
            @click="center=m.position"
          />
        </GmapMap>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: [],
      currentPlace: null
    };
  },

  mounted() {
    this.geolocate();
  },

  methods: {
    // receives a place object via the autocomplete component
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  }
};
</script>
<style lang="scss">
.btn-round {
  margin-left: 10px;
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: 500;
  height: 40px;
  padding: 0rem 0.95rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  background-color: transparent;
  color: #fff;
  background-color: #6a75ff;
  border-color: #6a75ff !important;
}
</style>
