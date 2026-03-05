import React from 'react';
import { ScrollView, View, Text, Button } from 'react-native';
import { appName, getVersion, getBuildNumber, getBuildDate, getEnvironment } from '../utils/version';
import { generateBuildSummary } from '../utils/changelog';

const SobreApp: React.FC = () => {
  const version = getVersion();
  const build = getBuildNumber();
  const date = getBuildDate();
  const env = getEnvironment();
  const summary = generateBuildSummary();

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{appName}</Text>
      <Text style={{ fontSize: 16 }}>Versão: {version}</Text>
      <Text style={{ fontSize: 16 }}>Build: {build}</Text>
      <Text style={{ fontSize: 16 }}>Data: {date}</Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>Ambiente: {env}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Changelog</Text>
      <Text style={{ fontSize: 14, marginBottom: 20, whiteSpace: 'pre-wrap' }}>{summary}</Text>
      <Button title="Ver detalhes técnicos" onPress={() => {}} />
    </ScrollView>
  );
};

export default SobreApp;
