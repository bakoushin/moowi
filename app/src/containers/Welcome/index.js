import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers } from 'ethers';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Dialog from 'react-native-dialog';

export default Welcome = ({ checkWallet }) => {
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [mnemonic, setMnemonic] = useState('');

  const createWallet = async () => {
    const newWallet = ethers.Wallet.createRandom();
    const newAccount = {
      address: newWallet.address,
      privateKey: newWallet.privateKey,
      mnemonic: newWallet.mnemonic.phrase
    };

    await SecureStore.setItemAsync('account', JSON.stringify(newAccount));
    checkWallet();
  };

  const restoreWallet = async () => {
    const newWallet = ethers.Wallet.fromMnemonic(mnemonic);
    const newAccount = {
      address: newWallet.address,
      privateKey: newWallet.privateKey,
      mnemonic: newWallet.mnemonic.phrase
    };

    await SecureStore.setItemAsync('account', JSON.stringify(newAccount));
    checkWallet();
  };

  const showDialog = () => {
    setDialogVisible(true);
  };

  const handleCancel = () => {
    setDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ width: '100%' }}
        onPress={() => {
          createWallet();
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
              Create Wallet{' '}
            </Text>
            <Text
              style={{ color: '#8A8D97', fontSize: 12, textAlign: 'center' }}
            >
              {' '}
              Create a new Moowi wallet{' '}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ width: '100%' }}
        onPress={() => {
          showDialog();
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
              Restore Wallet{' '}
            </Text>
            <Text
              style={{ color: '#8A8D97', fontSize: 12, textAlign: 'center' }}
            >
              {' '}
              Restore Moowi wallet from mnemonic phrase{' '}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title>Restore Wallet</Dialog.Title>
        <Dialog.Description>
          Paste your mnemonic to restore your Moowi wallet.
        </Dialog.Description>
        <Dialog.Input onChangeText={setMnemonic} />
        <Dialog.Button label="Restore" onPress={restoreWallet} />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#0A0F24'
  },
  card: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    maxHeight: 200,
    backgroundColor: '#13182B',
    borderColor: '#13182B',
    borderWidth: 0,
    borderRadius: 10,
    width: '90%'
  }
});
