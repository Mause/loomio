import comp from "./index";

import dotenv from "dotenv";

const config = dotenv.config();

function fromPairs<T>(iter: [string, T][]): Record<string, T> {
  const res: Record<string, T> = {};
  for (const [key, value] of iter) res[key] = value;
  return res;
}

async function main() {
  const props: Record<keyof typeof comp.props, any> = {
    username: config.parsed!.USERNAME,
    email: config.parsed!.EMAIL,
    password: config.parsed!.PASSWORD,
  };
  const self = Object.create(
    Object.assign(
      {
        run: comp.run,
      },
      props,
      // fromPairs(Object.entries(comp.props)),
      comp.methods
    )
  );

  await self.run({ $: {} });
}

main().then(() => process.exit());
