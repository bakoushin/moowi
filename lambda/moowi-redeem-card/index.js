import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { CeloWallet, CeloProvider } from '@celo-tools/celo-ethers-wrapper';
import { ethers } from 'ethers';

const dynamo = new DynamoDBClient({ region: 'eu-central-1' });

export async function handler(event) {
  try {
    console.log(JSON.stringify(event));

    const { code, receiver } = JSON.parse(event.body);
    const hash = ethers.utils.hexlify(ethers.utils.keccak256(code));

    console.log({ code, receiver });

    // Send card value to specified address

    const provider = new CeloProvider(
      'https://alfajores-forno.celo-testnet.org'
    );
    await provider.ready;
    const wallet = new CeloWallet(process.env.SPENDER_PRIVATE_KEY, provider);

    const abi = ['function redeemCard(bytes32 hash, address receiver)'];
    const address = process.env.CONTRACT_ADDRESS;

    const cardsContract = new ethers.Contract(address, abi, wallet);
    await cardsContract.redeemCard(hash, receiver);

    // Update code in the database

    const timestamp = new Date().toISOString();

    const params = {
      TableName: 'moowi-cards',
      Key: {
        code: {
          S: code
        }
      },
      UpdateExpression: `set redeemed = :redeemed,
                         receiver = :receiver,
                         updatedAt = :updatedAt`,
      ExpressionAttributeValues: {
        ':redeemed': { BOOL: true },
        ':receiver': { S: receiver },
        ':updatedAt': { S: timestamp }
      }
    };

    await dynamo.send(new UpdateItemCommand(params));

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
