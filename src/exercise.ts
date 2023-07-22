const url = "https://api.pipedream.com/graphql";

import * as dotenv from "dotenv";
import { createClient, CombinedError, gql, Client } from "@urql/core";
import type {
  CreatePipeline,
  CreatePipelineVariables,
} from "./__generated__/CreatePipeline";
import "isomorphic-fetch";
import type { AddStepVariables, AddStep } from "./__generated__/AddStep";
import type { GetActions } from "./__generated__/GetActions";
import type { GetPipeline } from "./__generated__/GetPipeline";
import {
  DeleteComponent,
  DeleteComponentVariables,
} from "./__generated__/DeleteComponent";
import { PipelineInput, StepInput } from "../__generated__/globalTypes";
import { appMinimal, appMinimalVariables } from "./__generated__/appMinimal";

const GetAppQue = gql`
  query appMinimal($id: String!) {
    app(id: $id) {
      ...AppMinimalParts
    }
  }
  fragment AppMinimalParts on App {
    id
    nameSlug
    name
    authType
  }
`;

const DeleteComponentMut = gql`
  mutation DeleteComponent($id: String!) {
    deleteDeployedComponent(id: $id, ignoreHookErrors: true) {
      errors
    }
  }
`;

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

class Pipedream {
  private readonly client: Client;

  constructor() {
    this.client = createClient({ url, fetch, fetchOptions: { headers } });
  }

  async deleteComponent(id: string) {
    return await this.client
      .mutation<DeleteComponent, DeleteComponentVariables>(DeleteComponentMut, {
        id,
      })
      .toPromise();
  }

  async getPipeline(id: string) {
    return await this.client
      .query<GetPipeline>(GetPipelineQue, { id })
      .toPromise();
  }

  async createPipeline(pipeline: PipelineInput) {
    return await this.client
      .mutation<CreatePipeline, CreatePipelineVariables>(CreatePipelineMut, {
        pipeline,
      })
      .toPromise();
  }

  async getActions() {
    return await this.client.query<GetActions>(GetActionsQue).toPromise();
  }

  async getAppMinimal(id: string) {
    return await this.client
      .query<appMinimal, appMinimalVariables>(GetAppQue, { id })
      .toPromise();
  }

  async addStep(deploymentId: string, index: 0, step: StepInput) {
    return await this.client
      .mutation<AddStep, AddStepVariables>(AddStepMut, {
        index,
        deploymentId,
        step,
      })
      .toPromise();
  }
}

async function main() {
  const client = new Pipedream();

  // await client.getPipeline("p_G6CRnee");

  // const { data } = await client.createPipeline({});

  // console.log(data?.pipelineCreate?.pipeline);

  // const deploymentId = data!.pipelineCreate!.pipeline!.deployments![0]!.id!;

  console.log(await client.getAppMinimal("loomio"));

  const actions = await client.getActions();
  // console.log(actions.error);
  // console.log(actions);
  const pc = actions.data!.viewer!.publishedComponents;

  for (const comp of pc) {
    console.log("deleting", comp.name);
    const newLocal = await client.deleteComponent(comp.id!);
    console.log(
      newLocal.error || newLocal.data?.deleteDeployedComponent?.errors
    );
  }

  // const addstep = await client.addStep(deploymentId, 0, {
  //   type: "action",
  //   namespace: "mauseme",
  //   actionId: pc![0]!.id,
  //   actionParamsJson: "{}",
  //   componentKey: pc![0]!.key,
  // });

  // console.log(addstep.error);
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
