import { Component, OnInit } from '@angular/core';
import { AppwriteService } from '../services/appwrite.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  title = '';
  description = '';
  date = '';
  selectedEventId: string | null = null;
  isEditMode = false;

  constructor(private appwriteService: AppwriteService) {}

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.appwriteService.listEvents().then((res: any) => {
      this.events = res.documents;
    });
  }


  createOrUpdateEvent() {
    if (this.isEditMode && this.selectedEventId) {
      this.appwriteService.updateEvent(this.selectedEventId, this.title, this.description, this.date).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Event Updated',
          text: 'The event has been updated successfully!',
          timer: 1500
        });
        this.fetchEvents(); 
        this.resetForm();
      }).catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update the event.',
        });
      });
    } else {
     
      this.appwriteService.createEvent(this.title, this.description, this.date).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Event Created',
          text: 'The event has been created successfully!',
          timer: 1500
        });
        this.fetchEvents(); 
        this.resetForm();
      }).catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create the event.',
        });
      });
    }
  }

 
  editEvent(event: any) {
    this.isEditMode = true;
    this.selectedEventId = event.$id; 
    this.title = event.title;
    this.description = event.description;
    this.date = event.date;
  }

  
  registerForEvent(event: any) {
    Swal.fire({
      icon: 'success',
      title: 'Registered',
      text: `You have successfully registered for ${event.title}`,
      timer: 1500
    });
  }

  deleteEvent(eventId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this event?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appwriteService.deleteEvent(eventId).then(() => {
          Swal.fire(
            'Deleted!',
            'The event has been deleted successfully.',
            'success'
          );
          this.fetchEvents(); 
        }).catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the event.',
          });
        });
      }
    });
  }

  
  resetForm() {
    this.title = '';
    this.description = '';
    this.date = '';
    this.isEditMode = false;
    this.selectedEventId = null;
  }
}