import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { CeloWallet, CeloProvider } from '@celo-tools/celo-ethers-wrapper';
import { ethers } from 'ethers';

const dynamo = new DynamoDBClient({ region: 'eu-central-1' });

export async function handler(event) {
  try {
    const code = ethers.utils.hexlify(ethers.utils.randomBytes(32));
    const value = '0.1';

    // Add code hash to the smart contract

    const hash = ethers.utils.hexlify(ethers.utils.keccak256(code));

    const provider = new CeloProvider(
      'https://alfajores-forno.celo-testnet.org'
    );
    await provider.ready;
    const wallet = new CeloWallet(process.env.OWNER_PRIVATE_KEY, provider);

    const abi = ['function addCard(bytes32 hash, uint256 value)'];
    const address = process.env.CONTRACT_ADDRESS;

    const cardsContract = new ethers.Contract(address, abi, wallet);
    await cardsContract.addCard(hash, ethers.utils.parseEther(value));

    // Add code to the database

    const timestamp = new Date().toISOString();

    const params = {
      TableName: 'moowi-cards',
      Item: {
        code: { S: code },
        value: { S: value },
        createdAt: { S: timestamp },
        updatedAt: { S: timestamp }
      }
    };

    await dynamo.send(new PutItemCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ code })
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error })
    };
  }
}
