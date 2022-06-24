import React, { useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Clipboard from 'expo-clipboard';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppContext from '../../../AppContext';

export default Settings = ({ navigation }) => {
  const { setSignedIn } = useContext(AppContext);

  const copyToClipboard = async () => {
    try {
      const account = await SecureStore.getItemAsync('account');
      const { mnemonic } = JSON.parse(account);
      await Clipboard.setStringAsync(mnemonic);
      alert('Your mnemonic phrase is copied to the clipboard');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteWallet = async () => {
    try {
      await SecureStore.deleteItemAsync('account');
      navigation.navigate('HomeScreen');
      setSignedIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ width: '100%', alignSelf: 'center' }}
        onPress={() => {
          copyToClipboard();
        }}
      >
        <View style={styles.card}>
          <View style={{ paddingVertical: 20 }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            >
              {' '}
              Backup Wallet{' '}
            </Text>
            <Text
              style={{ color: '#8A8D97', fontSize: 12, textAlign: 'center' }}
            >
              {' '}
              Get your mnemonic phrase{' '}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ width: '100%', alignSelf: 'center' }}
        onPress={() => {
          deleteWallet();
        }}
      >
        <View style={styles.card}>
          <View style={{ paddingVertical: 20 }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            >
              {' '}
              Delete Wallet{' '}
            </Text>
            <Text
              style={{ color: '#8A8D97', fontSize: 12, textAlign: 'center' }}
            >
              {' '}
              Caution! Your wallet will be permanently deleted{' '}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#0A0F24'
  },
  card: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    maxHeight: 100,
    backgroundColor: '#13182B',
    borderColor: '#13182B',
    borderWidth: 0,
    borderRadius: 10,
    width: '90%'
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  }
});
