import { Component, ViewChild, ElementRef } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';

import { Platform } from 'ionic-angular';


declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('mapCanvas') mapElement: ElementRef;
  constructor(public confData: ConferenceData, public platform: Platform) {
  }

  ionViewDidLoad() {
      this.confData.getMap().subscribe(mapData => {
        let mapEle = this.mapElement.nativeElement;

        let map = new google.maps.Map(mapEle, {
          center: mapData.find(d => d.center),
          zoom: 16
        });

        mapData.forEach(markerData => {
          let infoWindow = new google.maps.InfoWindow({
            content: `<h5>${markerData.type} : ${markerData.name}</h5>`
          });

          let marker = new google.maps.Marker({
            position: markerData,
            icon: markerData.img,
            map: map,

            title: markerData.name
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });

        google.maps.event.addListenerOnce(map, 'idle', () => {
          mapEle.classList.add('show-map');
        });

      });

  }
}
