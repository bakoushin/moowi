import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { CeloWallet, CeloProvider } from '@celo-tools/celo-ethers-wrapper';
import { ethers } from 'ethers';

const provider = new CeloProvider('https://alfajores-forno.celo-testnet.org');

const abi = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)'
];

const tokenAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'; // cUSD

export default Home = ({ navigation, route, checkWallet }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState(null);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    if (!account) {
      return;
    }
    setRefreshing(true);
    getBalance().then(() => setRefreshing(false));
  }, [account]);

  useEffect(() => {
    initWallet();
  }, []);

  useEffect(() => {
    if (!account) {
      return;
    }
    getBalance();
  }, [account]);

  useEffect(() => {
    if (!route.params?.refreshBalance) {
      return;
    }
    getBalance();
  }, [route.params?.refreshBalance]);

  const initWallet = async () => {
    try {
      const savedData = await SecureStore.getItemAsync('account');
      const savedAccount = JSON.parse(savedData);
      if (savedAccount?.privateKey) {
        await provider.ready;
        const newWallet = new CeloWallet(savedAccount.privateKey, provider);
        setAccount(newWallet);
      } else {
        setAccount(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBalance = async () => {
    setBalance(null);

    const stableToken = new ethers.Contract(tokenAddress, abi, account);

    const balance = await stableToken.balanceOf(account.address);
    const decimals = await stableToken.decimals();
    const symbol = await stableToken.symbol();
    const tokenBalance = ethers.utils.formatUnits(balance, decimals);
    setBalance(Number(tokenBalance).toFixed(2));
    setTokenSymbol(symbol);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Image
          style={{
            marginVertical: 50
          }}
          source={require('../../../assets/moowi.png')}
        />
        <Text
          style={{
            fontSize: 18,
            color: '#8A8D97',
            top: 4,
            textAlign: 'center',
            marginBottom: 10
          }}
        >
          {' '}
          Available Balance{' '}
        </Text>
        {balance !== null ? (
          <View style={{ flexDirection: 'row', marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 35,
                color: '#E5BF30',
                fontWeight: 'bold',
                top: 4
              }}
            >
              {balance} {tokenSymbol}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: '#8A8D97',
                position: 'relative',
                left: '35%',
                top: 20
              }}
            ></Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', marginBottom: 40 }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        <View style={styles.accountCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => navigation.navigate('Send')}
            >
              <Text
                style={{
                  fontSize: 17,
                  color: '#fff',
                  fontWeight: '600',
                  top: 4
                }}
              >
                {' '}
                Send{' '}
              </Text>
              <Icon name="send" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.receiveButton}
              onPress={() => navigation.navigate('Receive')}
            >
              <Text
                style={{
                  fontSize: 17,
                  color: '#fff',
                  fontWeight: '600',
                  top: 4
                }}
              >
                {' '}
                Receive{' '}
              </Text>
              <Icon name="wallet" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={{ width: '100%', marginBottom: 50 }}
          onPress={() => navigation.navigate('TopUp')}
        >
          <View style={styles.card}>
            <View
              style={{
                marginHorizontal: 20,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Text
                style={{
                  marginRight: 20,
                  color: '#fff',
                  fontSize: 17,
                  fontWeight: 'bold'
                }}
              >
                Top up with gift card
              </Text>
              <Icon name="qrcode" size={38} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#0A0F24'
  },
  card: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    maxHeight: 80,
    backgroundColor: '#13182B',
    borderColor: '#13182B',
    borderWidth: 0,
    borderRadius: 10,
    width: '90%'
  },
  accountCard: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    maxHeight: 120,
    backgroundColor: '#0A0F24',
    borderColor: '#0A0F24',
    borderWidth: 0,
    borderRadius: 10,
    width: '90%',
    flexDirection: 'column'
  },
  instructions: {
    color: '#fff'
  },
  sendButton: {
    borderRadius: 40,
    backgroundColor: '#13182B',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 15,
    width: '42%',
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    flexDirection: 'row',
    alignContent: 'center'
  },
  receiveButton: {
    borderRadius: 40,
    backgroundColor: '#13182B',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 15,
    width: '42%',
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    flexDirection: 'row',
    alignContent: 'center'
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
