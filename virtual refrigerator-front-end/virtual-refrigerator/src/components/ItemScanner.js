import React from "react";
import Quagga from 'quagga';
import {orderByFrequency} from "../Utils/Constants"


export default class ItemScanner extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            barcode:"",
        }
    }
    closeCamera = async () =>{
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
            Quagga.onDetected(async (result)=>{ 
                const lastCode = result.codeResult.code;
                console.log(lastCode);
                results.push(lastCode);
                if(results.length === 20){
                let code = await orderByFrequency(results);   
                this.props.setBarCode(code);
                // await this.getItemFromBackend(code);
                 results = [];
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
          },
          decoder : {
            readers : ["code_128_reader","ean_reader","ean_8_reader","code_39_reader","codabar_reader","upc_reader"]
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
        return (<div><div id="item-scanner"></div>
        </div>);
    }
}