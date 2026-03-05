export const appName = 'BibleApp Pro';

let _version = '2.1.0';
let _buildNumber = 1;
let _buildDate = new Date().toISOString();
let _environment = process.env.NODE_ENV || 'development';

export const getVersion = () => _version;
export const getBuildNumber = () => _buildNumber;
export const getBuildDate = () => _buildDate;
export const getEnvironment = () => _environment;

function bump() {
  _buildNumber += 1;
  _buildDate = new Date().toISOString();
}

export function incrementBuild() {
  bump();
}

export function incrementPatch() {
  const parts = _version.split('.').map(Number);
  parts[2] += 1;
  _version = parts.join('.');
  bump();
}

export function incrementMinor() {
  const parts = _version.split('.').map(Number);
  parts[1] += 1;
  parts[2] = 0;
  _version = parts.join('.');
  bump();
}

export function incrementMajor() {
  const parts = _version.split('.').map(Number);
  parts[0] += 1;
  parts[1] = 0;
  parts[2] = 0;
  _version = parts.join('.');
  bump();
}
