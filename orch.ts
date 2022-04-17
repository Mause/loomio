import dotenv from "dotenv";

import comp from "./index";
import { createComponent } from "./src/create-component";

const config = dotenv.config();

async function main() {
  const self = createComponent(comp, {
    email: config.parsed!.EMAIL,
    password: config.parsed!.PASSWORD,
  });

  await self.run({ $: {} });
}

if (require.main === module) {
  main().then(() => process.exit());
}
