import Config from '../../package.json'

export function getVersion(): string {
  return Config.version;
}
