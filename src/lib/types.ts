import { ExecutionError, Result } from "@e2b/code-interpreter";

export const TEMPLATES_IDS = ["nextjs-developer"] as const;
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
