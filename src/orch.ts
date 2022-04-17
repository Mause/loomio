import dotenv from "dotenv";
import { createComponent } from "./create-component";

import comp from "./index";

const config = dotenv.config();

async function main() {
  const parsed = config.parsed!;

  const self = createComponent(comp, {
    email: parsed.EMAIL,
    password: parsed.PASSWORD,
    title: "this is a test",
  });

  await self.run({ $: {} });
}

if (require.main === module) {
  main().then(
    () => process.exit(),
    (error) => console.error(error)
  );
}
