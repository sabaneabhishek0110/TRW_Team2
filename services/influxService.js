import { queryApi,writeApi } from '../influxClient.js'
import { Point } from '@influxdata/influxdb-client';
import axios from 'axios';

export async function getMachineData(measurement,c) {
    const sql = `
        SELECT *
        FROM "${measurement}"
        WHERE time >= now() - INTERVAL 1 HOUR
    `;


    const fluxQuery = `
        from(bucket: "TRW_Moniter")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "${measurement}")
    `;

    const fluxQuery1 = `
        from(bucket: "TRW_Moniter")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "machine1")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> keep(columns: ["_time", "count", "temp", "pressure", "station"])
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 1)
    `;


    return new Promise((resolve, reject) => {
        const results = [];
        const query = c ? fluxQuery : fluxQuery1;
        queryApi.queryRows(query, {
        next(row, tableMeta) {
            const obj = tableMeta.toObject(row);
            results.push(obj);
        },
        error(err) {
            console.error('InfluxDB query error:', err);
            reject(err);
        },
        complete() {
            resolve(results);
        },
        });
    });
}

export async function writeMachineData(measurement, data) {
  const { count, temp, pressure, station } = data;

  const point = new Point(measurement)
    .tag('station', station || measurement)
    .floatField('count', count)
    .floatField('temp', temp)
    .floatField('pressure', pressure);

  try {
    writeApi.writePoint(point);
    await writeApi.flush();
    console.log(`✅ Data written to InfluxDB:`, { station, count, temp, pressure });
  } catch (err) {
    console.error('❌ Failed to write data to InfluxDB:', err);
  }
}

export async function deleteMachineData(measurement) {
  const url = `https://us-east-1-1.aws.cloud2.influxdata.com/api/v2/delete?orgID=${process.env.INFLUX_ORG_ID}&bucket=${process.env.INFLUX_BUCKET}`;

  const headers = {
    Authorization: `Token ${process.env.INFLUX_TOKEN}`,
    'Content-Type': 'application/json',
  };

  const body = {
    start: '2025-07-07T00:00:00Z',
    stop: new Date().toISOString(), // current time
    predicate: `_measurement="${measurement}"`,
  };

  try {
    const response = await axios.post(url, body, { headers });
    console.log('✅ Deletion successful');
    return response.data;
  } catch (error) {
    console.error('❌ Deletion failed:', error.response?.data || error.message);
    throw error;
  }
}
