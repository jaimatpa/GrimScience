import { ref, shallowRef, reactive, watch, computed, watchEffect } from "vue";
import { useFetch } from "#app";

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
  content: string | null;
  address: string;
  model?: string;
  serialNo?: string;
}

export const useMap = () => {
  const mapRef = ref<HTMLElement | null>(null);
  const map = shallowRef<google.maps.Map | null>(null);
  const markers = ref<google.maps.Marker[]>([]);

  const filters = reactive<Record<string, Filter>>({
    pendingInstalls: {
      checked: false,
      color: "darkgreen",
      label: "Pending Installations",
      labelColor: "#fff",
    },
    checkups: {
      checked: false,
      color: "lightblue",
      label: "Checkups",
      labelColor: "#222",
    },
    serviceReports: {
      checked: false,
      color: "red",
      label: "Open Field Complaints",
      labelColor: "#fff",
    },
    siteVisits: {
      checked: false,
      color: "blue",
      label: "Open Site Visits",
      labelColor: "#fff",
    },
    orderPendings: {
      checked: false,
      color: "orange",
      label: "Orders Pending",
      labelColor: "#222",
    },
    openQuotes: {
      checked: false,
      color: "yellow",
      label: "Open Quotes",
      labelColor: "#222",
    },
    shippedOrders: {
      checked: false,
      color: "white",
      label: "Shipped Orders",
      labelColor: "#222",
    },
  });

  const iconBase =
    "https://www.grimmscientific.com/wp-content/uploads/2019/07/";

  const icons: Record<string, string> = {
    pendingInstalls: iconBase + "darkgreen.png",
    checkups: iconBase + "lightblue.png",
    serviceReports: iconBase + "red.png",
    siteVisits: iconBase + "blue.png",
    orderPendings: iconBase + "orange-1.png",
    openQuotes: iconBase + "yellow.png",
    shippedOrders: iconBase + "white.png",
  };

  const {
    data: pins,
    refresh: refreshPins,
    error: pinsError,
  } = useFetch<Pin[]>("/api/map", {
    params: { action: "getPins" },
    key: "map-pins",
  });
  console.log("Pin--------", pins.value);

  const initMap = () => {
    if (!mapRef.value) return;
    const mapOptions: google.maps.MapOptions = {
      zoom: 5,
      center: { lat: 39.809734, lng: -98.55562 },
      styles: [
        {
          elementType: "geometry",
          stylers: [
            {
              color: "#A9A9A9",
            },
          ],
        },
        {
          elementType: "labels.icon",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          elementType: "labels.text",
          stylers: [
            {
              color: "#e4e4e4",
            },
          ],
        },
        {
          elementType: "labels.text.fill",
          stylers: [
            {
              visibility: "simplified",
            },
          ],
        },
        {
          featureType: "administrative",
          elementType: "geometry",
          stylers: [
            {
              visibility: "on",
            },
          ],
        },
        {
          featureType: "administrative.land_parcel",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#bdbdbd",
            },
          ],
        },
        {
          featureType: "administrative.locality",
          stylers: [
            {
              color: "#1f6124",
            },
          ],
        },
        {
          featureType: "administrative.locality",
          elementType: "labels.text",
          stylers: [
            {
              color: "#6b6b6b",
            },
          ],
        },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#6b6b6b",
            },
          ],
        },
        {
          featureType: "administrative.neighborhood",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "administrative.country",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.province",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.province",
          elementType: "labels.text",
          stylers: [
            {
              color: "#6c6c6c",
            },
            {
              lightness: 65,
            },
            {
              visibility: "simplified",
            },
          ],
        },
        {
          featureType: "administrative.province",
          elementType: "geometry.stroke",
          stylers: [
            {
              color: "#000000",
            },
            {
              strole: "60",
            },
            {
              visibility: "on",
            },
          ],
        },
        {
          featureType: "poi",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [
            {
              color: "#eeeeee",
            },
          ],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#757575",
            },
          ],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [
            {
              color: "#e5e5e5",
            },
          ],
        },
        {
          featureType: "poi.school",
          elementType: "labels.icon",
          stylers: [
            {
              color: "#15889b",
            },
          ],
        },
        {
          featureType: "poi.school",
          elementType: "labels.text",
          stylers: [
            {
              color: "#15889b",
            },
            {
              visibility: "simplified",
            },
            {
              weight: 8,
            },
          ],
        },
        {
          featureType: "poi.school",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#15889b",
            },
            {
              visibility: "on",
            },
          ],
        },
        {
          featureType: "poi.sports_complex",
          elementType: "labels.icon",
          stylers: [
            {
              color: "#d5686b",
            },
          ],
        },
        {
          featureType: "poi.sports_complex",
          elementType: "labels.text",
          stylers: [
            {
              color: "#d5686b",
            },
            {
              visibility: "simplified",
            },
          ],
        },
        {
          featureType: "poi.sports_complex",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#d5686b",
            },
          ],
        },
        {
          featureType: "road",
          elementType: "labels",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "road.arterial",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#757575",
            },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [
            {
              color: "#dadada",
            },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#e0e0e0",
            },
            {
              lightness: 80,
            },
          ],
        },
        {
          featureType: "road.local",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#9e9e9e",
            },
          ],
        },
        {
          featureType: "transit",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "transit.line",
          elementType: "geometry",
          stylers: [
            {
              color: "#e5e5e5",
            },
          ],
        },
        {
          featureType: "transit.station",
          elementType: "geometry",
          stylers: [
            {
              color: "#eeeeee",
            },
          ],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [
            {
              color: "#c9c9c9",
            },
          ],
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#404040",
            },
          ],
        },
        {
          featureType: "water",
          elementType: "labels.text",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#9e9e9e",
            },
          ],
        },
      ],
    };
    map.value = new google.maps.Map(mapRef.value, mapOptions);
    setPins();
  };

  const setPins = () => {
    clearMarkers();
    if (!pins.value || !map.value) return;
    pins.value.forEach((pin) => {
      if (filters[pin.type]?.checked) {
        const marker = new google.maps.Marker({
          position: {
            lat: Number(pin.position.lat),
            lng: Number(pin.position.lng),
          },
          map: map.value,
          icon: icons[pin.type],
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="bg-white pb-5 text-black space-y-3">
              <h3 class="text-2xl font-medium">Zip: ${
                pin.zip || "Zip unavailable"
              }</h3>
              ${
                pin.serialNo
                  ? `<p class="text-xl font-medium">Serial #: <button class="bg-black px-3 py-1 text-white font-medium text-xl" onclick="openDetails(${pin?.type}, ${pin?.id})">${pin.serialNo}</button></p>`
                  : ""
              }
              ${
                pin.model
                  ? `<p class="text-xl font-medium">Model #: <button class="bg-black px-3 py-1 text-white font-medium text-xl" onclick="openDetails(${pin?.type}, ${pin?.id})">${pin.model}</button></p>`
                  : ""
              }
              ${
                !pin.model && !pin.serialNo && pin.city && pin.state
                  ? `<button class="bg-black px-3 py-1 text-white font-medium text-xl" onclick="openDetails(${pin?.type}, ${pin?.id} )">${pin.city}, ${pin.state}</button>`
                  : ""
              }
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map.value, marker);
        });

        markers.value.push(marker);
      }
    });
  };

  const clearMarkers = () => {
    markers.value.forEach((marker) => marker.setMap(null));
    markers.value = [];
  };

  const modalMeta = ref({
    isSiteVisitModalOpen: false,
    isQuoteModalOpen: false,
    isInvoiceModalOpen: false,
    isServiceOrderModalOpen: false,
  });

  const gridMeta = ref({
    selectedCustomerId: null,
    selectedOrderId: null,
    selectedComplaint: null,
  });

  const getInvoice = async (tblName: string, id: number) => {
    await useApiFetch(`/api/mapLocation/${tblName}/${id}`, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          gridMeta.value.selectedCustomerId = response._data.body.customerid;
          gridMeta.value.selectedOrderId = response._data.body.orderid;
          modalMeta.value.isInvoiceModalOpen = true;
        }
      },
    });
  };

  const getQuoteInfo = async (tblName: string, id: number) => {
    await useApiFetch(`/api/mapLocation/${tblName}/${id}`, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          gridMeta.value.selectedCustomerId = response._data.body.customerid;
          gridMeta.value.selectedOrderId = response._data.body.orderid;
          modalMeta.value.isQuoteModalOpen = true;
        }
      },
    });
  };

  const getSiteVisit = async (tblName: string, id: number) => {
    await useApiFetch(`/api/mapLocation/${tblName}/${id}`, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          // gridMeta.value.selectedOrderId = response._data.body.orderid;
          gridMeta.value.selectedCustomerId = response._data.body.CustomerID;
          modalMeta.value.isSiteVisitModalOpen = true;
        }
      },
    });
  };

  const getServiceOrder = async (tblName: string, id: number) => {
    await useApiFetch(`/api/mapLocation/${tblName}/${id}`, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          if (tblName === "tblComplaints") {
            gridMeta.value.selectedCustomerId = response._data.body.CustomerID;
            gridMeta.value.selectedComplaint = id;
            modalMeta.value.isServiceOrderModalOpen = true;
          }
        }
      },
    });
  };

  const openDetails = (type: string, id: number) => {
    //invoice 1, 7
    if (id && type?.name === "pendingInstalls" || type?.name === "shippedOrders") {
      getInvoice("tblOrder", id);
    }
    //Service Order  2, 3
    if (id && type?.name === "checkups" || type?.name === "serviceReports") {
      getServiceOrder("tblComplaints", id);
      getServiceOrder("tblOrder", id);
    }
    //Site Visit  4
    if (id && type?.name === "siteVisits") {
      getSiteVisit("tblSiteVisit", id);
    }
    //Quotes  5, 6
    if (id && type?.name === "orderPendings" || type?.name === "openQuotes") {
      getQuoteInfo("tblOrder", id);
    }
  };

  watch(
    filters,
    () => {
      setPins();
    },
    { deep: true }
  );
  watch(pinsError, (error) => {
    if (error) {
      console.error("Error fetching pins:", error);
    }
  });

  return {
    mapRef,
    filters,
    pins,
    pinsError,
    refreshPins,
    initMap,
    openDetails,
    modalMeta,
    gridMeta,
  };
};
