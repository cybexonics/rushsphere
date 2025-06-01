export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),           // ✅ Bind to all network interfaces
  port: env.int('PORT', 1337),            // ✅ Use Render's injected PORT
  app: {
    keys: env.array('APP_KEYS'),         // ✅ Secure app keys (set these in Render's env vars)
  },
});

