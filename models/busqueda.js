const fs= require('fs');

const axios = require('axios');


class Busquedas{
    historial = [];
    dbPath='./db/database.json';
    constructor(){
       this.leerBD();
    }

    get historialCapitalizado(){
      return this.historial.map(lugar=>{
        let palabras = lugar.split('');
        palabras=palabras.map(p=>p[0].toUpperCase()+p.substring(1));
        return palabras.join('');
      })
    }

    get paramMapBox(){
         return {
            'access_token':process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
         }
    }

    get paramsWeather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang:'es'
        }
    }
    async ciudad(lugar = ''){
        try {

            const intance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox_places/${lugar}.json`,
                params:this.paramMapBox
             })

            const resp = await intance.get('');
            return resp.data.features.map(lugar=>({
                id:lugar.id,
                nombre:lugar.place_name,
                lng: lugar.center[0],
                lat:lugar.center[1]
            }));
        } catch (error) {
            return[];
        }
        
    }
    async climaLugar(lat,lon){
        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsWeather,lat,lon}  

            })
            const resp= await instance.get();
            const {weather,main} = resp.data;
            console.log(weather);
            return{
                desc:weather[0].description,
                min:main.temp_min,
                max:main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar=""){
        if(this.historial.includes(lugar.toLocaleLowerCase())){
        return
        };
        this.historial.unshift(lugar.toLocaleLowerCase);
        timeStamp.historial=this.historial.splice(0,5);
    }

    guardarBD(){
        const payload={
            historial:this.historial
        };
        fs.writeFileSync(this.dbPath,JSON.stringify(payload))
    }
    leerBD(){
      if (!fs.existsSync(this.dbPath)) {
        return
      }
      const info = fs.readFileSync(this.dbPath,{encoding:'utf-8'});
      const data = JSON.parse(info);
      this.historial=data.historial;
    }
}
module.exports=Busquedas;
