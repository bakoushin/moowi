import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Button
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { CeloProvider } from '@celo-tools/celo-ethers-wrapper';
import { ethers } from 'ethers';

const provider = new CeloProvider('https://alfajores-forno.celo-testnet.org');

export default TopUp = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(null);
  const [code, setCode] = useState(null);
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    try {
      setScanned(true);
      const key = 'moowi://topup/';
      if (type === 'org.iso.QRCode' && data.startsWith(key)) {
        const scannedCode = data.replace(key, '');
        setCode(scannedCode);

        await provider.ready;
        const abi = [
          'function getCardValue(bytes32 hash) view returns (uint256)'
        ];
        const contractAddress = '0xCF54C73e26Fdd637E63c0E354CD63f7305b4c128';
        const moowiContract = new ethers.Contract(
          contractAddress,
          abi,
          provider
        );

        const hash = ethers.utils.hexlify(ethers.utils.keccak256(scannedCode));
        const cardValue = await moowiContract.getCardValue(hash);

        setAmount(ethers.utils.formatEther(cardValue));
      }
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const handleTopUp = async () => {
    try {
      setLoading(true);

      const savedData = await SecureStore.getItemAsync('account');
      const savedAccount = JSON.parse(savedData);
      const { address } = savedAccount;

      const result = await fetch(
        'https://1oru2iaeu2.execute-api.eu-central-1.amazonaws.com/moowi-redeem-card',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code, receiver: address })
        }
      );

      if (result.ok) {
        console.log('ok, navigating');
        navigation.navigate({
          name: 'HomeScreen',
          params: { refreshBalance: Math.random() },
          merge: true
        });
        console.log('navigation done');
      } else {
        throw new Error(`Top up failed (${result.status})`);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(true);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 17,
            color: '#fff',
            fontWeight: 'bold',
            marginBottom: 20
          }}
        >
          Something went wrong. Please try again.
        </Text>
        <Button
          title="OK"
          onPress={() => {
            setScanned(null);
            setCode(null);
            setAmount(null);
            setError(false);
          }}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (code) {
    if (amount === null) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }

    if (amount === '0.0') {
      return (
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 17,
              color: '#fff',
              fontWeight: 'bold',
              marginBottom: 20
            }}
          >
            This card is already used or does not exist
          </Text>
          <Button
            title="OK"
            onPress={() => {
              setScanned(null);
              setCode(null);
              setAmount(null);
            }}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.value}>
          <Text
            style={{
              fontSize: 85,
              color: '#E5BF30',
              // color: '#bc7bcb',
              fontWeight: 'bold'
            }}
          >
            {amount}
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleTopUp}>
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
                color: '#fff',
                fontSize: 17,
                fontWeight: 'bold',
                alignItems: 'center',
                padding: 10
              }}
            >
              Top up {amount} cUSD
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan QR code from the card</Text>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.qr}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
    color: '#fff'
  },
  qr: {
    flex: 1,
    heigth: '100%',
    width: '100%'
  },
  button: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    backgroundColor: '#13182B',
    borderColor: '#13182B',
    borderWidth: 1,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  value: {
    padding: 20,
    marginBottom: 50,
    borderColor: '#80009d',
    borderWidth: 2,
    borderRadius: 10
  }
});
