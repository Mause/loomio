import comp from "./index";

async function main() {
  await comp.run({ $: {} });
}

main().then(() => process.exit());
