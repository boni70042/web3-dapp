import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';

const web3Modal = new Web3Modal({
    network: 'goerli',
    providerOptions: {}
});

const Home = () => {
    const [connect, setContract] = useState(null);
    const [address, setAddress] = useState('0x0');
    const [balance, setBalance] = useState('0');
    const [ensAddress, setEnsAddress] = useState('0');
    const [contractBalance, setContractBalance] = useState('0');
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

            const contractAddr = '0xf5c9284880DC752D3b280BA0258F600fC2Ebc330';
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

            const contractBalance = await contract.provider.getBalance(contractAddr);

            let msg = await contract.message();
            let paidMsg = await contract.retrievePaidMsg();

            setContract(contract);
            setAddress(address);
            setEnsAddress(ensAddress);
            setBalance(ethers.utils.formatEther(balance));
            setContractBalance(ethers.utils.formatEther(contractBalance));
            setContract(contract);
            setMessage(msg);
            setPaidMsg(paidMsg);
        }
        init();
    }, []);
    return (
        <div className="Home">
            <header className="Home-herder">
                My First DApp
                <div className="InputBox">
                    <input placeholder="Enter Some Message..."></input>
                    <div>
                        <button
                        // onClick={() => {
                        //     async function storeFunction() {
                        //         let tx = await contract.store(inputMsg);
                        //         await tx.wait();

                        //         let _msg = await contract.message();
                        //         setMessage(_msg);
                        //     }
                        //     storeFunction();
                        // }}
                        >
                            Store Message
                        </button>
                        <button
                        // onClick={() => {
                        //     async function storeFunction() {
                        //         let tx = await contract.storePaidMsg(inputMsg, {
                        //             value: ethers.utils.parseEther('0.000001')
                        //         });
                        //         await tx.wait();

                        //         const _paidMsg = await contract.retrievePaidMsg();
                        //         setPaidMsg(_paidMsg);
                        //     }
                        //     storeFunction();
                        // }}
                        >
                            Store Paid Message
                        </button>
                    </div>
                </div>
                <p className="Home-content">
                    Hi "{ensAddress}" ! <br />
                    Your balance is "{balance}" ETH. <br />
                    Your address is "{address}". <br />
                    This contract balance is "{contractBalance}".
                </p>
                <div className="PaidMessageItem">
                    <div className="MessageTitle">Store Paid Message</div>
                    <div className="MessageText">{paidMsg}</div>
                </div>
                <div className="MessageItem">
                    <div className="MessageTitle">Store Message</div>
                    <div className="MessageText">{message}</div>
                    <button className="MessageItemRemove">Remove</button>
                </div>
            </header>
        </div>
    );
};

export default Home;
