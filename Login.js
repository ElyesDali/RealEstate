import React, { useState } from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { login, register, refreshDB, isRemote } from './db';
import { Btn, Field, Chip, Row, C, say } from './ui';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const set = (k, v) => setF({ ...f, [k]: v });
  const submit = async () => {
    try { if (isRemote) await refreshDB().catch(() => {}); onLogin(mode === 'login' ? login(f.email, f.password) : await register(f)); }
    catch (e) { say('Error', e.message); }
  };
  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 50 }} style={{ backgroundColor: C.bg }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 48 }}>🏢</Text>
        <Text style={{ fontSize: 30, fontWeight: '800', color: C.navy }}>City Estate</Text>
        <Text style={{ color: C.grey }}>for buyers & sellers</Text>
      </View>
      {mode === 'register' && <Field label="Name" value={f.name} onChangeText={(v) => set('name', v)} />}
      <Field label="Email" autoCapitalize="none" keyboardType="email-address" value={f.email} onChangeText={(v) => set('email', v)} />
      <Field label="Password" secureTextEntry value={f.password} onChangeText={(v) => set('password', v)} />
      {mode === 'register' && (
        <Row>{['buyer', 'seller', 'agent'].map((r) => <Chip key={r} label={r} active={f.role === r} onPress={() => set('role', r)} />)}</Row>
      )}
      <Btn title={mode === 'login' ? 'Login' : 'Create account'} onPress={submit} />
      <Btn outline title={mode === 'login' ? 'No account? Register' : 'Back to login'} onPress={() => setMode(mode === 'login' ? 'register' : 'login')} />
      {mode === 'login' && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: C.grey, marginBottom: 6 }}>Demo accounts (password 1234):</Text>
          <Row>
            {['buyer', 'seller', 'agent'].map((r) => (
              <Chip key={r} label={r} onPress={() => setF({ ...f, email: r + '@demo.com', password: '1234' })} />
            ))}
          </Row>
        </View>
      )}
    </ScrollView>
  );
}