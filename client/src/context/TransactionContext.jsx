import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from './constants';

export const TransactionContext = React.createContext()

const { ethereum } = window

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)

    return transactionContract
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('')
    const [formData, setformData] = useState({ addressTo: '', amount: '', keyword: '', message: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))

    const handleChange = (e, name) => {
        setformData((prevState) => ({...prevState, [name]: e.target.value}))
    }

    const checkIfWalletIsConnected = async() => {
        try {
            if(!ethereum) return alert("Please install metamask")

            const accounts = await ethereum.request({ method: 'eth_accounts' })

            if(accounts.length) {
                setCurrentAccount(accounts[0])

                //getAllTransactions()
            } else {
                console.log("No Accounts found")
            }
        } catch (error) {
            console.log(err)

            throw new Error("No ethereum object.")
        }
    }

    const connectWallet = async() => {
        try {
            if(!ethereum) return alert("Please install metamask")

            const accounts = await ethereum.request({ method: 'eth_requestAccounts'})

            setCurrentAccount(accounts[0])
        } catch (err) {
            console.log(err)

            throw new Error("No ethereum object.")
        }
    }

    const sendTransaction = async() => {
        try {
            if(!ethereum) return alert("Please install metamask")
            
            //get data from the form
            const transactionContract = getEthereumContract()
            const { addressTo, amount, keyword, message } = formData
            const parsedAmount = etheres.utils.parseEther(amount)

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //2100 GWEI
                    value: parsedAmount._hex,
                }]
            })

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)

            setIsLoading(true)
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait()
            setIsLoading(false)
            console.log(`Success - ${transactionHash.hash}`)

            const transactionCount = await transactionContract.getTrsansactionCount()

            setTransactionCount(transactionCount.toNumber())

        } catch (error) {
            
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setformData, handleChange, sendTransaction }}>
            {children} 
        </TransactionContext.Provider>
    )
} 