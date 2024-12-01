import { EnvVariableKeys } from '../types/env-variables';

export class MissingEnvironmentVariableError extends Error {
  constructor(variableString: EnvVariableKeys) {
    super(`${variableString} is not defined in .env`);
    this.name = MissingEnvironmentVariableError.name;
  }
}
