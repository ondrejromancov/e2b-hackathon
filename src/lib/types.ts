import { ExecutionError, Result } from "@e2b/code-interpreter";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TEMPLATES_IDS = ["code-interpreter-v1"] as const;
type TemplateIds = (typeof TEMPLATES_IDS)[number];

type ExecutionResultBase = {
  sbxId: string;
};

export type ExecutionResultInterpreter = ExecutionResultBase & {
  template: TemplateIds;
  stdout: string[];
  stderr: string[];
  runtimeError?: ExecutionError;
  cellResults: Result[];
};

export type ExecutionResultWeb = ExecutionResultBase & {
  template: TemplateIds;
  url: string;
};

export type ExecutionResult = ExecutionResultInterpreter | ExecutionResultWeb;
