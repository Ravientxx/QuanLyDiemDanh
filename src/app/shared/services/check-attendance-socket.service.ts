import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs';
@Injectable()
export class CheckAttendanceSocketService {
  private socket: SocketIOClient.Socket; // The client instance of socket.io

   invokeCheckAttendanceUpdated = new Subject();
   invokeCheckAttendanceCreated = new Subject();
   invokeCheckAttendanceStopped = new Subject();
  // Constructor with an injection of ToastService
  constructor() {
    this.socket = io();
  }

  // Emit: Check Attendance updated event
  emitEventOnCheckAttendanceUpdated(checkAttendanceUpdated){
    this.socket.emit('checkAttendanceUpdated', checkAttendanceUpdated);
  }
  // Consume on Check Attendance updated 
  consumeEventOnCheckAttendanceUpdated(){
    var self = this;
    this.socket.on('checkAttendanceUpdated', function(event:any){
      self.invokeCheckAttendanceUpdated.next();
    });
  }

  // Emit: Check Attendance created event
  emitEventOnCheckAttendanceCreated(checkAttendanceCreated){
    this.socket.emit('checkAttendanceCreated', checkAttendanceCreated);
  }
  // Consume on Check Attendance created 
  consumeEventOnCheckAttendanceCreated(){
    var self = this;
    this.socket.on('checkAttendanceCreated', function(event:any){
      self.invokeCheckAttendanceCreated.next();
    });
  }
  // Emit: Check Attendance created event
  emitEventOnCheckAttendanceStopped(checkAttendanceStopped){
    this.socket.emit('checkAttendanceStopped', checkAttendanceStopped);
  }
  // Consume on Check Attendance created 
  consumeEventOnCheckAttendanceStopped(){
    var self = this;
    this.socket.on('checkAttendanceStopped', function(event:any){
      self.invokeCheckAttendanceStopped.next(event);
    });
  }
}