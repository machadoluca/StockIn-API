import { Client } from 'pg';

class DatabaseNotificationService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL,
      password: process.env.DATABASE_PASSWORD
    });

    this.start();
  }

  async start() {
    await this.client.connect();
  }

  async listen(channel: string, callback: (payload: string) => void) {
    await this.client.query(`LISTEN ${channel}`);

    this.client.on('notification', notification => {
      if (notification.channel === channel) {
        callback(notification.payload || '');
      }
    });
  }

  async notify(channel: string, payload?: string) {
    await this.client.query(`SELECT pg_notify($1, $2)`, [
      channel,
      payload ?? ''
    ]);
  }

  async stop() {
    await this.client.end();
  }
}

export default DatabaseNotificationService;
