import './App.css';
import Web3Modal from 'web3modal';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const web3Modal = new Web3Modal({
    network: 'goerli', //mainnet
    providerOptions: {}
});

function App() {
    const [contract, setContract] = useState(null);
    const [address, setAddress] = useState('0x0');
    const [balance, setBalance] = useState('0');
    const [ensAddress, setEnsAddress] = useState('0');
    const [message, setMessage] = useState('');
    const [paidMsg, setPaidMsg] = useState('');
    const [inputMsg, setInputMsg] = useState('');

    useEffect(() => {
        async function init() {
            const instance = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            const ensAddress = await provider.lookupAddress(address);

            const contractAddr = '0x8455a1429b3ff0fac040f87547e00bccc9834db3';
            const abi = [
                {
                    inputs: [
                        {
                            internalType: 'string',
                            name: 'str',
                            type: 'string'
                        }
                    ],
                    name: 'store',
                    outputs: [],
                    stateMutability: 'nonpayable',
                    type: 'function'
                },
                {
                    inputs: [
                        {
                            internalType: 'string',
                            name: 'str',
                            type: 'string'
                        }
                    ],
                    name: 'storePaidMsg',
                    outputs: [],
                    stateMutability: 'payable',
                    type: 'function'
                },
                {
                    inputs: [],
                    name: 'message',
                    outputs: [
                        {
                            internalType: 'string',
                            name: '',
                            type: 'string'
                        }
                    ],
                    stateMutability: 'view',
                    type: 'function'
                },
                {
                    inputs: [],
                    name: 'retrievePaidMsg',
                    outputs: [
                        {
                            internalType: 'string',
                            name: '',
                            type: 'string'
                        }
                    ],
                    stateMutability: 'view',
                    type: 'function'
                }
            ];
            const contract = new ethers.Contract(contractAddr, abi, signer);
            // let tx = await contract.store("Free fish!")
            // await tx.wait()

            let msg = await contract.message();
            let paidMsg = await contract.retrievePaidMsg();
            // console.log(msg);

            // let payEtherAmount = ethers.utils.parseEther('0.001');
            // let tx = await contract.storePaidMsg('This is a Fish!', { value: payEtherAmount });
            // let response = await tx.wait();
            // console.log(response);

            console.log(address);
            console.log(ethers.utils.formatEther(balance) + ' ETH'); // this is big number
            console.log(ensAddress); // only available in mainnet

            setAddress(address);
            setBalance(ethers.utils.formatEther(balance));
            setEnsAddress(ensAddress);
            setMessage(msg);
            setPaidMsg(paidMsg);
            setContract(contract);
        }
        init();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <div class="message-box">
                    <h6>
                        Hi {ensAddress} (Your ensAddress),
                        <br />
                        Your address is "{address}"
                        <br />
                        Your balance is "{balance}" ETH
                        <br />
                        Your message is {message} , Your paidMessage is {paidMsg}
                    </h6>
                    <form>
                        <div class="input-box">
                            <input value={inputMsg} onChange={(e) => setInputMsg(e.target.value)}></input>
                            <label>Input message</label>
                        </div>
                        <a
                            onClick={() => {
                                async function storeFunction() {
                                    let tx = await contract.store(inputMsg);
                                    await tx.wait();

                                    let _msg = await contract.message();
                                    setMessage(_msg);
                                }
                                storeFunction();
                            }}
                        >
                            store msg
                        </a>
                        <a
                            onClick={() => {
                                async function storeFunction() {
                                    let tx = await contract.storePaidMsg(inputMsg, {
                                        value: ethers.utils.parseEther('0.001')
                                    });
                                    await tx.wait();

                                    const _paidMsg = await contract.retrievePaidMsg();
                                    setPaidMsg(_paidMsg);
                                }
                                storeFunction();
                            }}
                        >
                            store PaidMsg
                        </a>
                    </form>
                </div>
            </header>
        </div>
    );
}

export default App;
