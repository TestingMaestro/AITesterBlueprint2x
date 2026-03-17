import { createServer } from 'vite';

async function start() {
  try {
    const server = await createServer({
      // Configure to match normal dev server setup
      server: {
        host: true,
        port: 5173
      }
    });

    await server.listen();
    server.printUrls();
    console.log('Vite server started programmatically and will stay alive.');
    
    // Keep process alive indefinitely
    setInterval(() => {}, 1000 * 60 * 60); 
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

start();
