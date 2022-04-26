const url = "https://api.pipedream.com/graphql";

import * as dotenv from "dotenv";
import { createClient, CombinedError, gql } from "@urql/core";
import type {
  CreatePipeline,
  CreatePipelineVariables,
} from "./__generated__/CreatePipeline";
import "isomorphic-fetch";
import type { AddStepVariables, AddStep } from "./__generated__/AddStep";
import type { GetActions } from "./__generated__/GetActions";
import type { GetPipeline } from "./__generated__/GetPipeline";

const CreatePipelineMut = gql`
  mutation CreatePipeline($pipeline: PipelineInput!) {
    pipelineCreate(pipeline: $pipeline) {
      errors
      pipeline {
        id
        deployments {
          id
        }
      }
    }
  }
`;
const GetPipelineQue = gql`
  query GetPipeline($id: String!) {
    pipeline(id: $id) {
      id
      description
    }
  }
`;
const AddStepMut = gql`
  mutation AddStep($deploymentId: String!, $index: Int!, $step: StepInput!) {
    pipelineAddStep(deploymentId: $deploymentId, index: $index, step: $step) {
      errors
    }
  }
`;
const GetActionsQue = gql`
  query GetActions {
    viewer {
      _can
      nickname
      email
      hasActions
      admin
      apiKey
      publishedComponents(type: "action") {
        id
        name
        key
        description
        code
        registry
        type
        version
      }
      actionConnections {
        nodes {
          adminOnly
          title
          subtitle
          description
        }
      }
    }
  }
`;

const { parsed } = dotenv.config();
const headers = { Authorization: "Bearer " + parsed!["PIPEDREAM_API_KEY"]! };

async function main() {
  const client = createClient({ url, fetch, fetchOptions: { headers } });

  await client
    .query<GetPipeline>(GetPipelineQue, { id: "p_G6CRnee" })
    .toPromise();

  const { data } = await client
    .mutation<CreatePipeline, CreatePipelineVariables>(CreatePipelineMut, {
      pipeline: {},
    })
    .toPromise();

  console.log(data?.pipelineCreate?.pipeline);

  const deploymentId = data!.pipelineCreate!.pipeline!.deployments![0]!.id!;

  const actions = await client.query<GetActions>(GetActionsQue).toPromise();
  console.log(actions.error);
  console.log(actions);
  const pc = actions.data?.viewer!.publishedComponents;

  const addstep = await client
    .mutation<AddStep, AddStepVariables>(AddStepMut, {
      index: 0,
      deploymentId: deploymentId,
      step: {
        type: "action",
        namespace: "mauseme",
        actionId: pc![0]!.id,
        actionParamsJson: "{}",
        componentKey: pc![0]!.key,
      },
    })
    .toPromise();

  console.log(addstep.error);

  return;
}

main().then(
  (res) => console.log(res),
  (err) => {
    console.log("an error has occured. goodbye!");
    console.log(err);
    if (err instanceof CombinedError)
      console.error(
        JSON.stringify(
          (err?.response as { errors: string[] })?.errors || err,
          undefined,
          2
        )
      );
  }
);
