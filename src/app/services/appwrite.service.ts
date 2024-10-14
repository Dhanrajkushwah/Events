import { Injectable } from '@angular/core';
import { Client, Account, Databases, Query, ID } from 'appwrite';
@Injectable({
  providedIn: 'root'
})

export class AppwriteService {
  client: Client;
  account: Account;
  databases: Databases;

  constructor() {
    this.client = new Client()
      .setEndpoint(AppwriteConfig.endpoint)  
      .setProject(AppwriteConfig.projectID); 

    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
  }


  async registerUser(email: string, password: string, name: string) {
    try {
      const userId = ID.unique();
      const user = await this.account.create(userId, email, password, name);
      console.log('User Registered:', user);
      return user;
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  }

 
  async loginUser(email: string, password: string): Promise<any> {
    let retries = 3;
    let delay = 5000;

    while (retries > 0) {
      try {
        const session = await this.account.createEmailPasswordSession(email, password);
        console.log('User Logged In:', session);
        return session;
      } catch (error: any) {
        if (error.code === 429) {
          console.error('Rate limit exceeded, retrying...');
          retries--;
          if (retries === 0) {
            alert('Too many login attempts. Please try again in a few minutes.');
            throw new Error('Max retries reached. Please try again later.');
          }
          await this.sleep(delay);
        } else {
          console.error('Login Error:', error);
          throw error;
        }
      }
    }
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async updateUserName(name: string) {
    try {
      const updatedUser = await this.account.updateName(name);
      console.log('User Name Updated:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Update Name Error:', error);
      throw error;
    }
  }


  async logoutUser() {
    try {
      await this.account.deleteSession('current');
      console.log('User Logged Out');
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  }


  async createEvent(title: string, description: string, date: string) {
    try {
      const event = await this.databases.createDocument(
        AppwriteConfig.databaseID,   
        AppwriteConfig.collectionID, 
        ID.unique(),
        { title, description, date }
      );
      console.log('Event Created:', event);
      return event;
    } catch (error) {
      console.error('Create Event Error:', error);
      throw error;
    }
  }

  // List all events
  async listEvents() {
    try {
      const events = await this.databases.listDocuments(
        AppwriteConfig.databaseID,   
        AppwriteConfig.collectionID  
      );
      console.log('Events List:', events);
      return events;
    } catch (error) {
      console.error('List Events Error:', error);
      throw error;
    }
  }

  // Delete an event
  async deleteEvent(eventId: string) {
    try {
      await this.databases.deleteDocument(
        AppwriteConfig.databaseID,  
        AppwriteConfig.collectionID, 
        eventId
      );
      console.log('Event Deleted');
    } catch (error) {
      console.error('Delete Event Error:', error);
      throw error;
    }
  }

  // Update an event
  async updateEvent(eventId: string, title: string, description: string, date: string) {
    try {
      const updatedEvent = await this.databases.updateDocument(
        AppwriteConfig.databaseID,   
        AppwriteConfig.collectionID, 
        eventId,
        { title, description, date }
      );
      console.log('Event Updated:', updatedEvent);
      return updatedEvent;
    } catch (error) {
      console.error('Update Event Error:', error);
      throw error;
    }
  }

  async registerForEvent(eventId: string) {
    console.log('User registered for event with ID:', eventId);
  }
}

export const AppwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectID: '670914d1001aca1df178',
  databaseID: '670914d1001aca1devent', 
  collectionID: '670b4849002af2f73c4b' 
};
