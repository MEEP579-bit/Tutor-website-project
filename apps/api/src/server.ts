import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`[api] gia-su-platform API đang chạy tại http://localhost:${env.PORT}`);
});
