import { CeloWallet, CeloProvider } from '@celo-tools/celo-ethers-wrapper';
import { ethers } from 'ethers';

const code = ethers.utils.hexlify(ethers.utils.randomBytes(32));
const value = 10;

// Add code hash to smart contract

const hash = ethers.utils.hexlify(ethers.utils.keccak256(code));

const provider = new CeloProvider('https://alfajores-forno.celo-testnet.org');
await provider.ready;
const wallet = new CeloWallet(
  '5b669fef08de320fc45e350d962f568bc12168652997ec478c2d8caa2eb4aa28',
  provider
);

const abi = ['function addCard(bytes32 hash, uint256 value)'];
const address = '0xDe97c78F6F237b9BfF084ED8b8c30e4D17501121';

const cardsContract = new ethers.Contract(address, abi, wallet);
await cardsContract.addCard(hash, ethers.utils.parseEther(String(value)));
