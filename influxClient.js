import { InfluxDB } from '@influxdata/influxdb-client'
import dotenv from 'dotenv'
dotenv.config()

const influxDB = new InfluxDB({
  url: process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN,
});

const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG);
const writeApi = influxDB.getWriteApi(process.env.INFLUX_ORG, process.env.INFLUX_BUCKET);

export { queryApi ,writeApi}
