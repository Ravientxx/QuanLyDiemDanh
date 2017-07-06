import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs';
@Injectable()
export class CheckAttendanceSocketService {
  public  socket: SocketIOClient.Socket; // The client instance of socket.io

   public invokeCheckAttendanceUpdated = new Subject();
  public  invokeCheckAttendanceCreated = new Subject();
   public invokeCheckAttendanceStopped = new Subject();
  // Constructor with an injection of ToastService
  public constructor() {
    this.socket = io();
  }

  // Emit: Check Attendance updated event
  public emitEventOnCheckAttendanceUpdated(checkAttendanceUpdated){
    this.socket.emit('checkAttendanceUpdated', checkAttendanceUpdated);
  }
  // Consume on Check Attendance updated 
  public consumeEventOnCheckAttendanceUpdated(){
    var self = this;
    this.socket.on('checkAttendanceUpdated', function(event:any){
      self.invokeCheckAttendanceUpdated.next(event);
    });
  }

  // Emit: Check Attendance created event
  public emitEventOnCheckAttendanceCreated(checkAttendanceCreated){
    this.socket.emit('checkAttendanceCreated', checkAttendanceCreated);
  }
  // Consume on Check Attendance created 
  public consumeEventOnCheckAttendanceCreated(){
    var self = this;
    this.socket.on('checkAttendanceCreated', function(event:any){
      self.invokeCheckAttendanceCreated.next(event);
    });
  }
  // Emit: Check Attendance created event
  public emitEventOnCheckAttendanceStopped(checkAttendanceStopped){
    this.socket.emit('checkAttendanceStopped', checkAttendanceStopped);
  }
  // Consume on Check Attendance created 
  public consumeEventOnCheckAttendanceStopped(){
    var self = this;
    this.socket.on('checkAttendanceStopped', function(event:any){
      self.invokeCheckAttendanceStopped.next(event);
    });
  }
}