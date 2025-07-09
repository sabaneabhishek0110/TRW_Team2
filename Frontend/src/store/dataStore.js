// import {create} from 'zustand'; 
// import axios from 'axios';

// const API_URL = "http://localhost:5000/api/influx"; 

// axios.defaults.withCredentials = true ; 

// export const useDataStore =  create((set,get) => ({

//     arr : [], 

//         getData : async(id) => {
//         const response = await axios.get(`${API_URL}/initdata/${id}`); 
//         // console.log(response.data.data, "data from backend for getData");
//         const countArray = response.data.data.map(item => item.count);
//         console.log(countArray, "count-only array from backend for getData");
//         set({ arr: countArray });

//     },

// }))

// store/dataStore.js
import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/influx";

axios.defaults.withCredentials = true;

export const useDataStore = create((set, get) => ({
  arr: [],
  Tarr: [],
  Parr: [],

  getData: async (id, callback) => {
    try {
      const response = await axios.get(`${API_URL}/initdata/machine${id}`);
      const countArray = response.data.data.map(item => item.count);
      const tempArray = response.data.data.map(item => item.temp);
      const pressureArray = response.data.data.map(item => item.pressure);
      console.log(response, "count-only array from backend for getData");

      set({
        arr: countArray,
        Tarr: tempArray,
        Parr: pressureArray
      });
      const { arr, Tarr, Parr } = get();
      console.log("This is arr", arr);
      console.log("This is Tarr", Tarr);
      console.log("This is Parr", Parr);

      // 🔁 pass array to callback
      if (callback) callback({countArray , tempArray, pressureArray});
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  },
}));
