import comp from "./index";

async function main() {
  const self = Object.assign({}, comp.props, comp.methods);

  await comp.run.call(self, { $: {} });
}

main().then(() => process.exit());
