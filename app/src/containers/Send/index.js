import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Icon from '@expo/vector-icons/Feather';
import Dialog from 'react-native-dialog';
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

export default Send = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [receiver, setReceiver] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState(null);

  useEffect(() => {
    initWallet();
  }, []);

  useEffect(() => {
    if (!account) {
      return;
    }
    getBalance();
  }, [account]);

  const initWallet = async () => {
    try {
      const savedData = await SecureStore.getItemAsync('account');
      const savedAccount = JSON.parse(savedData);
      if (savedAccount) {
        await provider.ready;
        const newWallet = new CeloWallet(savedAccount.privateKey, provider);
        setAccount(newWallet);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBalance = async () => {
    try {
      setBalance(null);

      const stableToken = new ethers.Contract(tokenAddress, abi, account);

      const balance = await stableToken.balanceOf(account.address);
      const decimals = await stableToken.decimals();
      const symbol = await stableToken.symbol();
      const tokenBalance = ethers.utils.formatUnits(balance, decimals);
      setBalance(Number(tokenBalance).toFixed(2));
      setTokenSymbol(symbol);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransfer = async () => {
    try {
      setDialogVisible(false);
      setLoading(true);

      // Address validation
      if (
        receiver === undefined ||
        receiver.length !== 42 ||
        !ethers.utils.isAddress(receiver)
      ) {
        alert('Address you entered is not valid!');
        setReceiver(undefined);
        setLoading(false);
        return;
      }

      const stableToken = new ethers.Contract(tokenAddress, abi, account);
      const tx = await stableToken.populateTransaction.transfer(
        receiver,
        ethers.utils.parseEther(amount)
      );
      const gasPrice = await account.getGasPrice(tokenAddress);
      const gasLimit = await account.estimateGas(tx);

      // Gas estimation doesn't currently work properly for non-CELO currencies
      // The gas limit must be padded to increase tx success rate
      // TODO: Investigate more efficient ways to handle this case
      const adjustedGasLimit = gasLimit.mul(10);

      const txResponse = await account.sendTransaction({
        ...tx,
        gasPrice,
        gasLimit: adjustedGasLimit,
        feeCurrency: tokenAddress
      });

      await txResponse.wait();

      Alert.alert('Sent successfully!', '', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate({
              name: 'HomeScreen',
              params: { refreshBalance: Math.random() },
              merge: true
            });
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Something went wrong', '', [
        { text: 'OK', onPress: () => console.log(error) }
      ]);
    }
  };

  const showDialog = () => {
    if (receiver === undefined) {
      setDialogVisible(true);
    } else {
      handleTransfer();
    }
  };

  const handleCancel = () => {
    setDialogVisible(false);
  };

  const updateAmount = (value) => {
    setAmount(amount + value);
  };

  const deleteLastChar = () => {
    setAmount(amount.substring(0, amount.length - 1));
  };

  const putPoint = () => {
    if (!amount.includes('.')) {
      setAmount(amount + '.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          textAlign: 'center',
          color: '#E5BF30',
          fontSize: 20,
          position: 'absolute',
          top: '10%'
        }}
      >
        Available Balance: {balance} {tokenSymbol}
      </Text>

      <Text
        style={{
          textAlign: 'center',
          color: '#fff',
          fontSize: 35,
          fontWeight: 'bold',
          position: 'absolute',
          top: '20%'
        }}
      >
        {amount.length ? amount : '0.00'} {tokenSymbol}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          color: '#fff',
          fontSize: 20,
          position: 'absolute',
          top: '27%'
        }}
      ></Text>

      <View style={{ width: '100%', position: 'absolute', bottom: 50 }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingHorizontal: '12%'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              updateAmount('1');
            }}
            style={{ width: '34%', marginHorizontal: 10, marginVertical: 15 }}
          >
            <Text style={{ color: '#fff', fontSize: 35, fontWeight: '400' }}>
              {' '}
              1{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              updateAmount('2');
            }}
            style={{ width: '32%', marginHorizontal: 10, marginVertical: 15 }}
          >
            <Text style={{ color: '#fff', fontSize: 35, fontWeight: '400' }}>
              {' '}
              2{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              updateAmount('3');
            }}
            style={{ width: '34%', marginHorizontal: 10, marginVertical: 15 }}
          >
            <Text style={{ color: '#fff', fontSize: 35, fontWeight: '400' }}>
              {' '}
              3{' '}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingHorizontal: '12%'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              updateAmount('4');
            }}
            style={{ width: '34%', marginHorizontal: 10, marginVertical: 15 }}
          >
            <Text style={{ color: '#fff', fontSize: 35, fontWeight: '400' }}>
              {' '}
              4{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              updateAmount('5');
            }}
            style={{ width: '32%', marginHorizontal: 10, marginVertical: 15 }}
          >
            <Text style={{ color: '#fff', fontSize: 35, fontWeight: '400' }}>
              {' '}
              5{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              updateAmount('6');
            }}
            style={{ width: '34%', marginHorizontal: 10, marginVertical: 15 }}
          >
            <Text style={{ color: '#fff', fontSize: 35, fontWeight: '400' }}>
              {' '}
              6{' '}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingHorizontal: '12%'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              updateAmount('7');
            }}
            style={{ width: '34%', marginHorizontal: 10, marginVertical: 15 }}
          >
            <Text style={{ color: '#fff', fontSize: 35, fontWeight: '400' }}>
              {' '}
              7{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              updateAmount('8');
            }}
            style={{ width: '32%', marginHorizontal: 10, marginVertical: 15 }}
          >
            <Text style={{ color: '#fff', fontSize: 35, fontWeight: '400' }}>
              {' '}
              8{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              updateAmount('9');
            }}
            style={{ width: '34%', marginHorizontal: 10, marginVertical: 15 }}
          >
            <Text style={{ color: '#fff', fontSize: 35, fontWeight: '400' }}>
              {' '}
              9{' '}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingHorizontal: '12%'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              putPoint();
            }}
            style={{ width: '34%', marginHorizontal: 10, marginVertical: 15 }}
          >
            <Text style={{ color: '#fff', fontSize: 35, fontWeight: '400' }}>
              {' '}
              .{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              updateAmount('0');
            }}
            style={{ width: '32%', marginHorizontal: 10, marginVertical: 15 }}
          >
            <Text style={{ color: '#fff', fontSize: 35, fontWeight: '400' }}>
              {' '}
              0{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deleteLastChar}
            style={{ width: '34%', marginHorizontal: 10, marginVertical: 15 }}
          >
            <Icon
              style={{ fontSize: 30, position: 'relative', top: 10 }}
              name="delete"
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={showDialog}
          style={{
            width: '90%',
            borderRadius: 10,
            backgroundColor: '#13182B',
            padding: 16,
            alignSelf: 'center',
            marginTop: 10
          }}
        >
          <Text
            style={{
              color: '#E5BF30',
              textAlign: 'center',
              fontWeight: '400',
              fontSize: 20
            }}
          >
            {' '}
            Send {tokenSymbol}{' '}
          </Text>
        </TouchableOpacity>
      </View>

      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title> Send {tokenSymbol} </Dialog.Title>
        <Dialog.Description>
          Enter the recipient's address below.
        </Dialog.Description>
        <Dialog.Input onChangeText={(receiver) => setReceiver(receiver)} />
        <Dialog.Button label="Send" onPress={handleTransfer} />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
      </Dialog.Container>

      <Dialog.Container visible={isLoading}>
        <Dialog.Title> Sending </Dialog.Title>
        <Dialog.Description>
          <ActivityIndicator />
        </Dialog.Description>
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#0A0F24'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  },
  text: {
    color: '#8A8D97'
  }
});
