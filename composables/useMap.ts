import { ref, shallowRef, reactive, watch } from 'vue'
import { useFetch } from '#app'

interface Filter {
  checked: boolean;
  color: string;
  label: string;
  labelColor: string;
}

interface Pin {
  position: google.maps.LatLngLiteral;
  type: string;
  id: number;
  title: string;
  content: string;
  address: string;
  model?: string;
  serialNo?: string;
}

export const useMap = () => {
  const mapRef = ref<HTMLElement | null>(null)
  const map = shallowRef<google.maps.Map | null>(null)
  const markers = ref<google.maps.Marker[]>([])

  const filters = reactive<Record<string, Filter>>({
    pendingInstalls: { checked: true, color: 'darkgreen', label: 'Pending Installations', labelColor: '#fff' },
    checkups: { checked: true, color: 'lightblue', label: 'Checkups', labelColor: '#222' },
    serviceReports: { checked: true, color: 'red', label: 'Open Field Complaints', labelColor: '#fff' },
    siteVisits: { checked: false, color: 'blue', label: 'Open Site Visits', labelColor: '#fff' },
    orderPendings: { checked: false, color: 'orange', label: 'Orders Pending', labelColor: '#222' },
    openQuotes: { checked: false, color: 'yellow', label: 'Open Quotes', labelColor: '#222' },
    shippedOrders: { checked: false, color: 'white', label: 'Shipped Orders', labelColor: '#222' },
  })

  const iconBase = 'https://www.grimmscientific.com/wp-content/uploads/2019/07/'
  const icons: Record<string, string> = {
    pendingInstalls: iconBase + 'darkgreen.png',
    checkups: iconBase + 'lightblue.png',
    serviceReports: iconBase + 'red.png',
    siteVisits: iconBase + 'blue.png',
    orderPendings: iconBase + 'orange-1.png',
    openQuotes: iconBase + 'yellow.png',
    shippedOrders: iconBase + 'white.png',
  }

  const { data: pins, refresh: refreshPins, error: pinsError } = useFetch<Pin[]>('/api/map', { 
    params: { action: 'getPins' },
    key: 'map-pins'
  })

  const initMap = () => {
    if (!mapRef.value) return

    const mapOptions: google.maps.MapOptions = {
      zoom: 5,
      center: { lat: 39.809734, lng: -98.55562 },
    }
    map.value = new google.maps.Map(mapRef.value, mapOptions)
    setPins()
  }

  const setPins = () => {
    clearMarkers()
    if (!pins.value || !map.value) return

    pins.value.forEach((pin) => {
      if (filters[pin.type].checked) {
        const marker = new google.maps.Marker({
          position: pin.position,
          map: map.value,
          icon: icons[pin.type],
        })
        
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h3>${pin.title}</h3>
              <p>${pin.content}</p>
              <p>${pin.address}</p>
              ${pin.model ? `<p>Model: ${pin.model}</p>` : ''}
              ${pin.serialNo ? `<p>Serial No: ${pin.serialNo}</p>` : ''}
              <button onclick="window.openDetails('${pin.type}', ${pin.id})">Open Details</button>
            </div>
          `
        })

        marker.addListener('click', () => {
          infoWindow.open(map.value, marker)
        })

        markers.value.push(marker)
      }
    })
  }

  const clearMarkers = () => {
    markers.value.forEach((marker) => marker.setMap(null))
    markers.value = []
  }

  const openDetails = (type: string, id: number) => {
    console.log(`Opening details for ${type} with ID ${id}`)
    // Implement logic to open details page or modal
  }

  watch(filters, setPins, { deep: true })

  watch(pinsError, (error) => {
    if (error) {
      console.error('Error fetching pins:', error)
      // Handle error (e.g., show error message to user)
    }
  })

  return {
    mapRef,
    filters,
    pins,
    pinsError,
    refreshPins,
    initMap,
    openDetails,
  }
}