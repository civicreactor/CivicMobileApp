import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase';


@Injectable()
export class ProjectData {
  data: any;
  projects: any;

  constructor(public http: Http, public user: UserData, af: AngularFire) {
    this.projects = af.database.list('/projects');
  }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      // return this.http.get('assets/data/data.json')
      //   .map(this.processData);
    }
  }

  getProjectLine(queryText = '', segment = 'all') {
    return this.load().map(data => {
      let projects = data;
      projects.shownProjects = 0;

      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      projects.forEach(project => {
        project.hide = true;
          // check if this project should show or not
          this.filterProject(project, queryWords, segment);

          if (!project.hide) {
            // if this session is not hidden then this group should show
            project.hide = false;
            projects.shownProjects++;
          }
        });
        return projects;
      });
    }

    filterProject(project, queryWords, segment) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (project.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // if the segement is 'favorites', but session is not a user favorite
    // then this session does not pass the segment test
    let matchesSegment = false;
    if (segment === 'favorites') {
      if (this.user.hasFavorite(project.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    project.hide = !(matchesQueryText && matchesSegment);
  }

  processData(data) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    this.data = data.json();

    this.data.tracks = [];

    // loop through each day in the schedule
    this.data.schedule.forEach(day => {
      // loop through each timeline group in the day
      day.groups.forEach(group => {
        // loop through each session in the timeline group
        group.sessions.forEach(session => {
          session.speakers = [];
          if (session.speakerNames) {
            session.speakerNames.forEach(speakerName => {
              let speaker = this.data.speakers.find(s => s.name === speakerName);
              if (speaker) {
                session.speakers.push(speaker);
                speaker.sessions = speaker.sessions || [];
                speaker.sessions.push(session);
              }
            });
          }

          if (session.tracks) {
            session.tracks.forEach(track => {
              if (this.data.tracks.indexOf(track) < 0) {
                this.data.tracks.push(track);
              }
            });
          }
        });
      });
    });

    return this.data;
  }


  // getTracks() {
  //   return this.load().map(data => {
  //     return data.tracks.sort();
  //   });
  // }

  // getMap() {
  //   return this.load().map(data => {
  //     return data.map;
  //   });
  // }

}
