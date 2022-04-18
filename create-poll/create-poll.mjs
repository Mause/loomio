export default {
  name: "Create Poll",
  version: "0.0.1",
  key: "create-poll",
  description: "",
  props: {},
  type: "action",
  methods: {},
  async run({ $ }) {
    $.export("name", "value");
    return $.flow.exit("end reason");
  },
};
