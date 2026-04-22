import { db } from '../config/firebase.js';

class EnvironmentReading {
  constructor(data) {
    this.id = data.id;
    this.district = data.district;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.temperature = data.temperature;
    this.humidity = data.humidity;
    this.pm25 = data.pm25;
    this.pm10 = data.pm10;
    this.no2 = data.no2;
    this.so2 = data.so2;
    this.co = data.co;
    this.o3 = data.o3;
    this.pollenLevel = data.pollenLevel;
    this.weatherDescription = data.weatherDescription;
    this.aqi = data.aqi;
    this.timestamp = data.timestamp || new Date();
  }

  // Save to Firestore
  async save() {
    const readingRef = db.collection('environmentReadings').doc(this.id);
    await readingRef.set({
      district: this.district,
      latitude: this.latitude,
      longitude: this.longitude,
      temperature: this.temperature,
      humidity: this.humidity,
      pm25: this.pm25,
      pm10: this.pm10,
      no2: this.no2,
      so2: this.so2,
      co: this.co,
      o3: this.o3,
      pollenLevel: this.pollenLevel,
      weatherDescription: this.weatherDescription,
      aqi: this.aqi,
      timestamp: this.timestamp
    });
    return this;
  }

  // Find readings
  static async find(query) {
    let readingsRef = db.collection('environmentReadings');

    if (query.district) {
      readingsRef = readingsRef.where('district', '==', query.district);
    }

    const snapshot = await readingsRef.orderBy('timestamp', 'desc').get();
    return snapshot.docs.map(doc => new EnvironmentReading({ id: doc.id, ...doc.data() }));
  }

  // Delete all readings
  static async deleteMany() {
    const batch = db.batch();
    const snapshot = await db.collection('environmentReadings').get();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}

export default EnvironmentReading;