/// <reference types="@types/google.maps" />

declare global {
    interface Window {
      initMap: () => void;
      openDetails: (type: string, id: number) => void;
    }
  }
  
  export {};