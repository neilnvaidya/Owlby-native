import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';

/**
 * A component for testing connectivity to backend services
 */
export default function ConnectionTest() {
  const [vercelStatus, setVercelStatus] = useState<string>('Not tested');
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Not tested');
  const [authStatus, setAuthStatus] = useState<string>('Not tested');
  const [results, setResults] = useState<any>({});

  // Test Vercel API connection
  const testVercelAPI = async () => {
    try {
      setVercelStatus('Testing...');
      
      // Try the test endpoint first
      const testRes = await fetch('https://owlby-native-leh9xvmom-neilnvaidyas-projects.vercel.app/api/test');
      const testData = await testRes.json();
      
      // Then try the bypass-auth endpoint
      const bypassRes = await fetch('https://owlby-native-leh9xvmom-neilnvaidyas-projects.vercel.app/api/bypass-auth');
      const bypassData = await bypassRes.json();
      
      setVercelStatus('Connected');
      setResults({
        ...results,
        vercel: {
          test: testData,
          bypass: bypassData
        }
      });
    } catch (error: any) {
      console.error('Vercel API connection error:', error);
      setVercelStatus(`Error: ${error.message}`);
    }
  };

  // Test Supabase connection
  const testSupabaseConnection = async () => {
    try {
      setSupabaseStatus('Testing...');
      
      // Simple query to check connection
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      
      setSupabaseStatus('Connected');
      setResults({
        ...results,
        supabase: {
          data
        }
      });
    } catch (error: any) {
      console.error('Supabase connection error:', error);
      setSupabaseStatus(`Error: ${error.message}`);
    }
  };

  // Test authentication
  const testAuth = async () => {
    try {
      setAuthStatus('Testing...');
      
      // Check the current session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (data?.session) {
        setAuthStatus('Authenticated');
      } else {
        setAuthStatus('Not authenticated');
      }
      
      setResults({
        ...results,
        auth: {
          session: data?.session ? 'Valid session' : 'No session'
        }
      });
    } catch (error: any) {
      console.error('Auth test error:', error);
      setAuthStatus(`Error: ${error.message}`);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    await testVercelAPI();
    await testSupabaseConnection();
    await testAuth();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Connection Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Vercel API Status:</Text>
        <Text style={[
          styles.status, 
          vercelStatus === 'Connected' ? styles.success : 
          vercelStatus.includes('Error') ? styles.error : 
          styles.pending
        ]}>
          {vercelStatus}
        </Text>
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Supabase Status:</Text>
        <Text style={[
          styles.status, 
          supabaseStatus === 'Connected' ? styles.success : 
          supabaseStatus.includes('Error') ? styles.error : 
          styles.pending
        ]}>
          {supabaseStatus}
        </Text>
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Auth Status:</Text>
        <Text style={[
          styles.status, 
          authStatus === 'Authenticated' ? styles.success : 
          authStatus.includes('Error') ? styles.error : 
          styles.pending
        ]}>
          {authStatus}
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={testVercelAPI}>
          <Text style={styles.buttonText}>Test Vercel API</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testSupabaseConnection}>
          <Text style={styles.buttonText}>Test Supabase</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testAuth}>
          <Text style={styles.buttonText}>Test Auth</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={runAllTests}>
          <Text style={styles.buttonText}>Run All Tests</Text>
        </TouchableOpacity>
      </View>
      
      {Object.keys(results).length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          <Text style={styles.resultsText}>
            {JSON.stringify(results, null, 2)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    width: 120,
  },
  status: {
    fontSize: 16,
    flex: 1,
  },
  success: {
    color: 'green',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  pending: {
    color: '#666',
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#2ecc71',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultsText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
}); 