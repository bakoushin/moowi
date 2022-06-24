import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import QRCode from 'react-native-qrcode-svg';

export default Receive = () => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    initWallet();
  }, []);

  const initWallet = async () => {
    try {
      const savedData = await SecureStore.getItemAsync('account');
      const savedAccount = JSON.parse(savedData);
      if (savedAccount) {
        setAccount(savedAccount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const qrcode = (
    <QRCode
      size={200}
      color="#fff"
      backgroundColor="#0A0F24"
      value={account?.address}
    />
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#0A0F24',
        flex: 1,
        alignContent: 'center',
        alignItems: 'center'
      }}
    >
      <View style={{ marginTop: 200 }}>
        {account ? qrcode : <ActivityIndicator size="large" color="#fff" />}
      </View>
    </SafeAreaView>
  );
};
