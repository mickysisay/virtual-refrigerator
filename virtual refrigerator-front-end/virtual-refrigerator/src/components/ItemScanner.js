import React from "react";
import Quagga from 'quagga';
import {orderByFrequency} from "../Utils/Constants"
import './login.css'

export default class ItemScanner extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            barcode:"",
        }
    }
    closeCamera = async () =>{
        Quagga.offDetected();
       Quagga.stop();    
    }
    

    loadQuagga = async () => {
      let results =[];  
      const scanner = document.getElementById("item-scanner");
      if(scanner ===null || scanner === undefined){
          return;
      }
       
      if (navigator.mediaDevices && typeof  navigator.mediaDevices.getUserMedia === 'function'
      ) {
          
        if(Quagga.intialize === undefined){
         const video = document.getElementById("scannerIndicator");
          
            Quagga.onDetected(async (result)=>{ 
                const lastCode = result.codeResult.code;
                if(video.classList.contains('border-radius')){
                    video.classList.remove('border-radius');
                    setTimeout(()=>{
                        video.classList.add("border-radius")},1000);
            }
                results.push(lastCode);
                if(results.length === 20){
                let code = await orderByFrequency(results);   
                this.props.setBarCode(code);
                // await this.getItemFromBackend(code);
                 results = [];
                 Quagga.offDetected();
                 Quagga.stop();
                 this.props.changeisScannerOn(false);
                 scanner.innerHTML = "";
                }
            })
        }
       Quagga.init({
        inputStream : {
            name : "Live",
            type : "LiveStream",
            numOfWorkers:navigator.hardwareConcurrency ,
            target: document.getElementById('item-scanner')
            // constraints: {
            //     width: 400 ,//  window.innerWidth*0.6,
            //     height:500 //window.innerHeight*0.5,
            // }   
          },
          decoder : {
            readers : ["code_128_reader","ean_reader","ean_8_reader","code_39_reader","code_39_vin_reader",
            "upc_e_reader","i2of5_reader","2of5_reader","codabar_reader","code_93_reader","upc_reader"]
          }
       },
           (err)=>{
               if(err){console.log(err);return}
               Quagga.intialized = true;
               Quagga.start();
           }
       );
       
      }else{
          console.log("cant access camera")
      } 
    }
    

    componentDidMount(){
        this.loadQuagga();
        this.props.setCloseCamera(this.closeCamera);
 
    }
    

    render(){
        return (<div>
            <div id="scannerIndicator" className="border-radius">Scanning ... </div>
        <div id="item-scanner">
            
        </div>
        </div>
        );
    }
}