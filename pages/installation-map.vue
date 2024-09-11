<template>
    <div id="container">
        <div id="map" ref="mapRef"></div>
        <div id="infoi">
            <h4 style="color:black;">Map Filters</h4>
            <form>
                <div v-for="(filter, key) in filters" :key="key"
                    :style="{ backgroundColor: filter.color, padding: '6px' }">
                    <input type="checkbox" v-model="filter.checked" @change="setPins" :id="key" :name="key">
                    <label :for="key" :style="{ color: filter.labelColor }">
                        <i><strong>CRYO</strong>Therm</i> {{ filter.label }}
                    </label>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'

const mapRef = ref(null)
let map
let markers = []

const filters = reactive({
    pendingInstalls: { checked: true, color: 'darkgreen', label: 'Pending Installations', labelColor: '#fff' },
    checkups: { checked: true, color: 'lightblue', label: 'Checkups', labelColor: '#222' },
    serviceReports: { checked: true, color: 'red', label: 'Open Field Complaints', labelColor: '#fff' },
    siteVisits: { checked: false, color: 'blue', label: 'Open Site Visits', labelColor: '#fff' },
    orderPendings: { checked: false, color: 'orange', label: 'Orders Pending', labelColor: '#222' },
    openQuotes: { checked: false, color: 'yellow', label: 'Open Quotes', labelColor: '#222' },
    shippedOrders: { checked: false, color: 'white', label: 'Shipped Orders', labelColor: '#222' },
})

const iconBase = 'https://www.grimmscientific.com/wp-content/uploads/2019/07/'
const icons = {
    pendingInstalls: iconBase + 'darkgreen.png',
    checkups: iconBase + 'lightblue.png',
    serviceReports: iconBase + 'red.png',
    siteVisits: iconBase + 'blue.png',
    orderPendings: iconBase + 'orange-1.png',
    openQuotes: iconBase + 'yellow.png',
    shippedOrders: iconBase + 'white.png',
}

const features = [
    { position: { lat: 39.3931528, lng: -81.4043352 }, type: 'pendingInstalls' },
    { position: { lat: 40.5734401, lng: -105.088736 }, type: 'serviceReports' },
    { position: { lat: 30.4418824, lng: -84.3006776 }, type: 'openQuotes' },
    { position: { lat: 39.1974478, lng: -96.5869136 }, type: 'orderPendings' },
    { position: { lat: 29.8884156, lng: -97.9405397 }, type: 'shippedOrders' },
    { position: { lat: 40.5734401, lng: -105.088736 }, type: 'checkups' },
    { position: { lat: 41.878, lng: -87.629 }, type: 'siteVisits' },
]

const initMap = () => {
    const mapOptions = {
        zoom: 5,
        center: { lat: 39.809734, lng: -98.55562 },
        styles:

            [
                {
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#A9A9A9"
                        }
                    ]
                },
                {
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "color": "#e4e4e4"
                        }
                    ]
                },
                {
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "administrative.land_parcel",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#bdbdbd"
                        }
                    ]
                },
                {
                    "featureType": "administrative.locality",
                    "stylers": [
                        {
                            "color": "#1f6124"
                        }
                    ]
                },
                {
                    "featureType": "administrative.locality",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "color": "#6b6b6b"
                        }
                    ]
                },
                {
                    "featureType": "administrative.locality",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#6b6b6b"
                        }
                    ]
                },
                {
                    "featureType": "administrative.neighborhood",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative.country",
                    "elementType": "labels",
                    "stylers": [
                        { "visibility": "off" }
                    ]
                }, {
                    "featureType": "administrative.province",
                    "elementType": "labels",
                    "stylers": [
                        { "visibility": "off" }
                    ]
                }, {
                    "featureType": "water",
                    "elementType": "labels",
                    "stylers": [
                        { "visibility": "off" }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "color": "#6c6c6c"
                        },
                        {
                            "lightness": 65
                        },
                        {
                            "visibility": "simplified"
                        }
                    ]
                }, {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "strole": "60"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#eeeeee"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#757575"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#e5e5e5"
                        }
                    ]
                },
                {
                    "featureType": "poi.school",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "color": "#15889b"
                        }
                    ]
                },
                {
                    "featureType": "poi.school",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "color": "#15889b"
                        },
                        {
                            "visibility": "simplified"
                        },
                        {
                            "weight": 8
                        }
                    ]
                },
                {
                    "featureType": "poi.school",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#15889b"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "poi.sports_complex",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "color": "#d5686b"
                        }
                    ]
                },
                {
                    "featureType": "poi.sports_complex",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "color": "#d5686b"
                        },
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "poi.sports_complex",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#d5686b"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#757575"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#dadada"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#e0e0e0"
                        },
                        {
                            "lightness": 80
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#9e9e9e"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#e5e5e5"
                        }
                    ]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#eeeeee"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#c9c9c9"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#404040"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#9e9e9e"
                        }
                    ]
                }
            ],
    }
    map = new google.maps.Map(mapRef.value, mapOptions)
    setPins()
}

const setPins = () => {
    clearMarkers()
    features.forEach((feature) => {
        if (filters[feature.type].checked) {
            const marker = new google.maps.Marker({
                position: feature.position,
                map: map,
                icon: icons[feature.type],
            })
            markers.push(marker)
        }
    })
}

const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null))
    markers = []
}

onMounted(() => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDnm8l8a4EJtuibuVLa04QmneDNgJQNHcU&callback=initMap`
    script.async = true
    document.head.appendChild(script)
    window.initMap = initMap
})
</script>

<style scoped>
#container {
    width: 100%;
    height: 100%;
    position: relative;
}

#map {
    height: 100%;
}

#infoi {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border-radius: 5px;
}

label {
    font-family: Arial, sans-serif;
    font-size: 15px;
    margin-left: 4px;
}

input[type='checkbox'] {
    transform: scale(1.5);
    margin-right: 5px;
}

h4 {
    font-family: Arial, sans-serif;
    color: #000;
    font-size: 20px;
    margin-top: 0;
}
</style>