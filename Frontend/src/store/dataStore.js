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

  getData: async (id, callback) => {
    try {
      const response = await axios.get(`${API_URL}/initdata/${id}`);
      const countArray = response.data.data.map(item => item.count);
      console.log(countArray, "count-only array from backend for getData");

      set({ arr: countArray });

      // 🔁 pass array to callback
      if (callback) callback(countArray);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  },
}));
