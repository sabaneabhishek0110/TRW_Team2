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
        |> sort(columns: ["_time"])
    `;

    const fluxQuery1 = `
        from(bucket: "TRW_Moniter")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "machine1")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> keep(columns: ["_time", "count", "temp", "pressure", "station","shift"])
        |> sort(columns: ["_time"], desc: true)
    `;


    return new Promise((resolve, reject) => {
        const results = [];
        const query = c ? fluxQuery1 : fluxQuery1;
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

// export async function getInitialData(measurement) {;
//     let v = ["dash","machine1","machine2","machine3","machine4"];

//     const fluxQuery = `
//         from(bucket: "TRW_Moniter")
//         |> range(start: -${realMinutes}s)
//         |> filter(fn: (r) => r._measurement == "${v[measurement]}")
//         |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
//         |> keep(columns: ["_time", "count", "temp", "pressure", "station","shift"])
//         |> sort(columns: ["_time"], desc: false)
//     `;
//     const fluxQuery1 = `
//         from(bucket: "TRW_Moniter")
//         |> range(start: -${realMinutes}m)
//         |> filter(fn: (r) => r._measurement == "${v[measurement]}")
//         |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
//         |> keep(columns: ["_time", "count", "temp", "pressure", "station"])
//         |> sort(columns: ["_time"], desc: false)
//     `;

//     return new Promise((resolve, reject) => {
//         const results = [];
//         const query1 = (measurement==0)?fluxQuery1 : fluxQuery;
//         queryApi.queryRows(query1, {
//         next(row, tableMeta) {
//             const obj = tableMeta.toObject(row);
//             results.push(obj);
//         },
//         error(err) {
//             console.error('InfluxDB query error:', err);
//             reject(err);
//         },
//         complete() {
//             resolve(results);
//         },
//         });
//     });
// }



// export async function getInitialData(measurement) {
//   const bucket = "TRW_Moniter";
//   const machines = ["dash", "machine1", "machine2", "machine3", "machine4"];
//   const selectedMachine = machines[measurement];

//   // 1️⃣ Step 1: Get latest shift
//   const latestShiftQuery = `
//     from(bucket: "${bucket}")
//       |> range(start: -1d)
//       |> filter(fn: (r) => r._measurement == "${selectedMachine}" and r._field == "shift")
//       |> sort(columns: ["_time"], desc: true)
//       |> limit(n: 1)
//   `;

//   const shiftValue = await new Promise((resolve, reject) => {
//     let latestShift = null;

//     queryApi.queryRows(latestShiftQuery, {
//       next(row, tableMeta) {
//         const obj = tableMeta.toObject(row);
//         latestShift = obj._value; // shift is in _value
//       },
//       error(err) {
//         console.error("❌ Error fetching latest shift:", err);
//         reject(err);
//       },
//       complete() {
//         if (latestShift != null) {
//           console.log("✅ Latest shift:", latestShift);
//           resolve(latestShift);
//         } else {
//           console.warn("⚠️ No shift data found.");
//           reject(new Error("No shift found"));
//         }
//       }
//     });
//   });

//   // 2️⃣ Step 2: Query all data with that shift
//   const dataQuery = `
//     from(bucket: "${bucket}")
//       |> range(start: -1d)
//       |> filter(fn: (r) => r._measurement == "${selectedMachine}")
//       |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
//       |> filter(fn: (r) => r.shift == ${shiftValue})
//       |> keep(columns: ["_time", "count", "temp", "pressure", "station", "shift"])
//       |> sort(columns: ["_time"], desc: false)
//   `;

//   return new Promise((resolve, reject) => {
//     const results = [];

//     queryApi.queryRows(dataQuery, {
//       next(row, tableMeta) {
//         const obj = tableMeta.toObject(row);
//         results.push(obj);
//       },
//       error(err) {
//         console.error("❌ Error fetching data by shift:", err);
//         reject(err);
//       },
//       complete() {
//         resolve(results);
//       },
//     });
//   });
// }

export async function getInitialData(measurement) {
  const bucket = "TRW_Moniter";

  const selectedMachine = measurement; // ✅ don't do machines[measurement]

  const latestShiftQuery = `
    from(bucket: "${bucket}")
      |> range(start: -1d)
      |> filter(fn: (r) => r._measurement == "${selectedMachine}" and r._field == "shift")
      |> sort(columns: ["_time"], desc: true)
      |> limit(n: 1)
  `;

  const shiftValue = await new Promise((resolve) => {
    let latestShift = null;

    queryApi.queryRows(latestShiftQuery, {
      next(row, tableMeta) {
        const obj = tableMeta.toObject(row);
        latestShift = obj._value;
      },
      error(err) {
        console.error("❌ Error fetching latest shift:", err);
        resolve(0);
      },
      complete() {
        if (latestShift != null) {
          console.log("✅ Latest shift:", latestShift);
          resolve(latestShift);
        } else {
          console.warn("⚠️ No shift data found. Defaulting to shift 0");
          resolve(0);
        }
      }
    });
  });

  console.log(shiftValue , "This is the shift alue");
  
  const dataQuery = `
      from(bucket: "${bucket}")
    |> range(start: -1d)
    |> filter(fn: (r) => r._measurement == "${selectedMachine}")
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> filter(fn: (r) => r.shift == ${shiftValue})  // ← runs after pivot
    |> keep(columns: ["_time", "count", "temp", "pressure", "station", "shift"])
    |> sort(columns: ["_time"], desc: false)
  `;

  return new Promise((resolve) => {
    const results = [];

    queryApi.queryRows(dataQuery, {
      next(row, tableMeta) {
        const obj = tableMeta.toObject(row);
        results.push(obj);
      },
      error(err) {
        console.error("❌ Error fetching data by shift:", err);
        resolve([]);
      },
      complete() {
        resolve(results);
      },
    });
  });
}


export async function writeMachineData(measurement, data) {
  const { count, temp, pressure, station,shift } = data;

  const point = new Point(measurement)
    .tag('station', station || measurement)
    .floatField('count', count)
    .floatField('temp', temp)
    .floatField('pressure', pressure)
    .floatField('shift',shift);

  try {
    writeApi.writePoint(point);
    await writeApi.flush();
    console.log(`✅ Data written to InfluxDB:`, { station, count, temp, pressure,shift });
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