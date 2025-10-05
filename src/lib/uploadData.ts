import { database } from './firebase';
import { ref, set } from 'firebase/database';
import { toast } from 'sonner';

// Helper to generate a new data point with random values
const addDataPoint = () => {
  const timestamp = Math.floor(Date.now() / 1000);
  const dbRef = ref(database, 'sensor_data/' + timestamp);

  const newData = {
      "After aqi": parseFloat((Math.random() * 20).toFixed(2)),
      "After co_ppm": parseFloat(Math.random().toFixed(6)),
      "After dust_density": parseFloat((Math.random() * 100).toFixed(6)),
      "After no2_ppm": parseFloat((Math.random() * 15).toFixed(6)),
      "Before aqi": parseFloat((18.9 + (Math.random() - 0.5) * 5).toFixed(2)),
      "User Latitude": 12.83968,
      "User Longitude": 80.15524,
      "co_ppm": parseFloat((Math.random() * 5).toFixed(4)),
      "dust_density": parseFloat((Math.random() * 200).toFixed(6)),
      "humidity": parseFloat((60 + Math.random() * 5).toFixed(6)),
      "motor_state": Math.random() > 0.5,
      "no2_ppm": parseFloat((Math.random() * 30).toFixed(5)),
      "temperature": parseFloat((23 + (Math.random() - 0.5) * 2).toFixed(2))
  };

  set(dbRef, newData)
    .then(() => {
      console.log(`Data for timestamp ${timestamp} added successfully!`);
    })
    .catch((error) => {
      console.error('Error adding data point: ', error);
      toast.error("Error sending data to Firebase", {
        description: error.message,
      });
      stopFluctuation(); // Stop trying if there is an error
    });
};

let fluctuationInterval: any = null;

// Starts sending data to Firebase every 3 seconds
export const startFluctuation = () => {
  if (fluctuationInterval) {
    toast.info("Fluctuation is already running.");
    return;
  }
  toast.success("Starting data fluctuation...");
  fluctuationInterval = setInterval(addDataPoint, 3000);
};

// Stops sending data to Firebase
export const stopFluctuation = () => {
  if (fluctuationInterval) {
    toast.success("Stopping data fluctuation.");
    clearInterval(fluctuationInterval);
    fluctuationInterval = null;
  } else {
    toast.info("Fluctuation is not running.");
  }
};

// Vite-specific Hot Module Replacement (HMR) cleanup
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (fluctuationInterval) {
      clearInterval(fluctuationInterval);
    }
  });
}
