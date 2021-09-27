const CHAIN_RPC = {
    1: 'https://mainnet.infura.io/v3/0e47785118b2494092b1a9a9b576c2bd',
    42: 'https://kovan.infura.io/v3/0e47785118b2494092b1a9a9b576c2bd',
    56: 'https://bsc-dataseed.binance.org',
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    128: 'https://http-mainnet.hecochain.com',
    256: 'https://http-testnet.hecochain.com'
};

const CHAIN_BROWSER = {
    1: "https://etherscan.io",
    42: "https://kovan.etherscan.io",
    56: "https://bscscan.com",
    97: "https://testnet.bscscan.com",
    128: "https://hecoinfo.com",
    256: "https://testnet.hecoinfo.com"
}

const CHAIN_NAME = {
    1: "Ethereum Chain Mainnet",
    42: "Ethereum Chain Kovan",
    56: "Binance Smart Chain Mainnet",
    97: "Binance Smart Chain Testnet",
    128: "HECO Chain Mainnet",
    256: "HECO Chain Testnet"
}

const IPFS_URL = 'https://ipfs.io/ipfs'
const IPFS_IFO = {
    56: 'k2k4r8oeuufgtw5e2piqe0i0yfds97imkqumrjaupsagxyekz72t5jy1',
    97: 'k2k4r8nec9xa2o2x29dag11p54nbj6bugxe6c9hflkuv722omq184bz2',
}

const ContractsAddr = {
    56: {
        AAAAToken: '0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f',
        AAAAConfig: '0xF66AaEd32D6A8b9D0bb1A050019bfB36e47194E4',
        AAAAPlatform: '0xeD49c8f41d8B5eb2A29720955a39212cfb9a2748',
        AAAAFactory: '0x59B52C6F7769D5BAedA35455506C2B93cF8C1399',
        AAAAGovernance: '0x16463CD818FC4ae1E354e8af2Cc4A570aC80eAED',
        AAAAMint: '0x2AeF4A024099FE9eF1eFd1D075A904Fdc20fe95B',
        AAAAShare: '0xa0855a1B515Aa6d50Af1e9c41D8Db846FBBC47ed',
        AAAAReward: '0x2618997cdb340F98E731916950F8ED09B1A5143D',
        AAAAQuery: '0xE8d93853f064361E732044E72b5cF8CDE7262896',
        AAAAQuery2: '0x464ADcC1BdE46B176c90c4f950f8d9c800BD324D',
        AAAAQuery3: '',
        AAAADeploy: '0x6CDa5CaE869277C6368B8D1301EC134450668f61',
        ThirdTokenPair: '',
        ThirdTokenBurgerPair: '',
        ThirdBurgerUsdPair: '0x034772cdcd90f5baabb2da325a879d6aa6840f6e',
        ThirdCokeUsdPair: '',
        DemaxFactory: '0x8a1E9d3aEbBBd5bA2A64d3355A48dD5E9b511256',
        IFOFactory: '0x6d3507bd96227b95135c936b3427f54A02EaD0d2',
        IFOQuery: '0x136Efc39B6ba21143E408fe318efe0F872Ffbae4',
        IFOFactory2: '0x95AB8FDc6aFa48dC3Ce27dF6d975A2B587D6a1E2',
        IFOQuery2: '0xe2CC0E9d1c54533ed498f8e479d9D54bd538085D',
        IFOBaseToken: '0x55d398326f99059fF775485246999027B3197955',
        DemaxProjectDeploy: '0x5Bb57735352165cEaBCB50dc9b11DB5341E5C7b5',
        DemaxProjectQuery: '0x1a64489D69FB4C6638eae6Cb5D898296F8Db19cE',
        SwapFactoryForShack: '0x3CD1C46068dAEa5Ebb0d3f55F6915B10648062B8',
        DemaxShackChef: '0x07dE034A0Fc0DA7a0bf703F6DcA7025bcD61BA3e',
        DemaxShackFarm: '0x744Db744da07e3adE5Ba99d1C80fa11DC5ee247D',
        DemaxShackChefQuery: '0xc25D2f4E808a8FA5d69729A60bc65e9a8DEd8de2',
        DemaxPricePredictionQuery: '',
        DemaxClaim: '0x54D5a9e5680f729C6A020A3B891e64a711181368',
    },
    97: {
        AAAAToken: '0x06bF890dfF5b422c35c9683f47d2d7663f6E1c24',
        AAAAConfig: '0xC3F043e7d0D9EbADc0A9B31242701E4843D68e04',
        AAAAPlatform: '0x2B9a93365dD39FCbdaa5cd8045Fa2970879d4DBE',
        AAAAFactory: '0x7221ac7E9Afb86d93C92F27c9Ae54D2f068e7C7C',
        AAAAGovernance: '0x778a88D58BCa4072f97f3441B525e30B27E31Adf',
        AAAAMint: '0x9709F6e06adB84739e59c868a1E07A76171F77C8',
        AAAAShare: '0x7591A53f333b07afD1792c62BFAdBBb897f6Ce96',
        AAAAReward: '0xB49A4c751372D6d29F2dA7413D78577fbd062875',
        AAAAQuery: '0x35bCc47Bd99a364932Dc50573F1eA70754A6F629',
        AAAAQuery2: '0x6678b0Cc1Ef18B7eAA4B58958906a7AD4E881cF1',
        AAAAQuery3: '0xF6E8C571acf2afF716489969DBA6735C41636F6d',
        AAAADeploy: '0xb7616883b9f02b0676233093A943021c04c43AAF',
        ThirdTokenPair: '',
        ThirdTokenBurgerPair: '',
        ThirdBurgerUsdPair: '0x46A9A54912Bb69e2ECDC3B07B5B9841E24b2f1e1',
        ThirdCokeUsdPair: '',
        DemaxFactory: '0xb43Bf0457563f54d104fc2711094DFF7AAC1Abe4',
        IFOFactory: '0x785c71Fd7c5A6960462E706C25CCaF439F90FEa6',
        IFOQuery: '0x319bFA57e452815184880EFf71eFD1FF729C3f82',
        IFOFactory2: '0x8f911a82569B5adcae621210b8989BadE01918F0',
        IFOQuery2: '0x088632B08F11A299022d9d6E3cc937C3F64b6968',
        IFOBaseToken: '0xF2ED382e6A3439Be124813842200cf6702fD6ecA',
        DemaxProjectDeploy: '0xB2632a763d7E32FC895f1852D5B039199071ED60',
        DemaxProjectQuery: '0xF63cF3523c03617Dffa993c2b9d5422e1c0042d9',
        SwapFactoryForShack: '0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7',
        DemaxShackChef: '0xbDA939488fe0ea657f6ACAAe8dED9e260989F9F0',
        DemaxShackFarm: '0x21f8846b668435B0Ffa9C90bB69A070B15E84138',
        DemaxShackChefQuery: '0x266DF039054f8A3D175AbbF1d133969211E5C226',
        DemaxPricePredictionQuery: '0x58383d7e73bF714d3df8eAF08c0d60fD6c46f4C5',
        DemaxClaim: '0x9f444FFE53610b5fcb779a9521f36135d3EAE042',
    },
}

const Tokens = {
    5: {
        AAAA: '0x8cB59096adfFEAD46032acb86401882DEf921B49',
        BURGER: '0xb4483E20B0F3802Cf29AF3C704c0898506404e77',
        USDT: '0x3a3B3912Dc36CabFDB4fA991BBc8AdD5a0D97fF9',
        WETH: '0xEA83cBcce4F78a5fB3448f60940d3140BBA76821',
        USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        XBurger: '0xb4483E20B0F3802Cf29AF3C704c0898506404e77',
        XBurger_USDT: '',
        XBurger_BURGER: '0x25d09281680ACF2437B4A8567A3baE5C05F4A1C9',
        MDX_USDT: '',
        HMDX_USDT: '',
        WBNB_USDT: '',
        BTCB_USDT: '',
        ETH_USDT: '',
    },
    56: {
        AAAA: '0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f',
        BURGER: '0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f',
        USDT: '0x55d398326f99059fF775485246999027B3197955',
        WETH: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        XBurger: '0xAFE24E29Da7E9b3e8a25c9478376B6AD6AD788dD',
        XBurger_USDT: '',
        XBurger_BURGER: '0x25d09281680ACF2437B4A8567A3baE5C05F4A1C9',
        MDX_USDT: '',
        HMDX_USDT: '',
        WBNB_USDT: '',
        BTCB_USDT: '',
        ETH_USDT: '',
    },
    97: {
        AAAA: '0x06bF890dfF5b422c35c9683f47d2d7663f6E1c24',
        BURGER: '0x06bF890dfF5b422c35c9683f47d2d7663f6E1c24',
        USDT: '0xF2ED382e6A3439Be124813842200cf6702fD6ecA',
        WETH: '0x7FcCaDD3e6A3F80e194CaDf13FeDF36B9BBbe98F',
        USDC: '0xE1106e7396dEA8c298Af67C1cdd732e0f3F32361',
        BUSD: '',
        MDX: '',
        XBurger: '0xd1f461C7Ced3Bb1810B9393dB9BD2De1819fd4e5',
        XBurger_USDT: '0xf641d2b37dbcd9aeccd416027e45b1b43f2e4c11',
        XBurger_BURGER: '0x8Cb6f3717e0915c3EF1c8884f4e7edFe26009a41',
        MDX_USDT: '',
    },
}

const ShackPools = {
    56: [
        {
            name: "BNB",
            address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            pid: 2,
            tokenSymbol: "BNB",
            rewardSymbol: "xBURGER",
        },
        {
            name: "BTCB",
            address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
            pid: 3,
            tokenSymbol: "BTCB",
            rewardSymbol: "xBURGER",
        },
        {
            name: "ETH",
            address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
            pid: 4,
            tokenSymbol: "ETH",
            rewardSymbol: "xBURGER",
        },
        {
            name: "BUSD",
            address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
            pid: 6,
            tokenSymbol: "BUSD",
            rewardSymbol: "xBURGER",
        },
        {
            name: "USDT",
            address: "0x55d398326f99059fF775485246999027B3197955",
            pid: 7,
            tokenSymbol: "USDT",
            rewardSymbol: "XBurger",
        },
        {
            name: "MDX",
            address: "0x9C65AB58d8d978DB963e63f2bfB7121627e3a739",
            pid: 0,
            tokenSymbol: "MDX",
            rewardSymbol: "XBurger",
        },
        {
            name: "HMDX",
            address: "0xAEE4164c1ee46ed0bbC34790f1a3d1Fc87796668",
            pid: 1,
            tokenSymbol: "HMDX",
            rewardSymbol: "xBURGER",
        },
    ],
    97: [
        {
            name: "BURGER",
            address: "0x06bF890dfF5b422c35c9683f47d2d7663f6E1c24",
            pid: 0,
            tokenSymbol: "BURGER",
            rewardSymbol: "XBurger",
        },
        {
            name: "USDT",
            address: "0xF2ED382e6A3439Be124813842200cf6702fD6ecA",
            pid: 1,
            tokenSymbol: "USDT",
            rewardSymbol: "XBurger",
        }
    ],
}

const ShackFarmPools = {
    56: [
        {
            name: "xBURGER/BURGER",
            address: "0xe981bCeeD806C719073435829f5b3468AfC576b8",
            pid: 2,
            tokenSymbol: "xBURGER-BURGER",
            rewardSymbol: "XBurger",
            reward2Symbol: "BURGER",
            tokenType: 2,
            isReward2: true,
        },
        {
            name: "xBURGER/USDT",
            address: "0xA3975222e994b0400AedE3067bfc3bbE41d2E3cD",
            pid: 3,
            tokenSymbol: "xBURGER-USDT",
            rewardSymbol: "XBurger",
            tokenType: 2,
            isReward2: false,
        },
        {
            name: "xBURGER/BNB",
            address: "0x6E99f62beb8c2CD67D812FA749C4Cf0D12eef6E0",
            pid: 4,
            tokenSymbol: "xBURGER-BNB",
            rewardSymbol: "XBurger",
            tokenType: 2,
            isReward2: false,
        },
        {
            name: "xBURGER",
            address: "0xAFE24E29Da7E9b3e8a25c9478376B6AD6AD788dD",
            pid: 0,
            tokenSymbol: "xBURGER",
            rewardSymbol: "XBurger",
            tokenType: 1,
            isReward2: false,
        },
        {
            name: "BURGER",
            address: "0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f",
            pid: 1,
            tokenSymbol: "BURGER",
            rewardSymbol: "XBurger",
            tokenType: 1,
            isReward2: false,
        },
        {
            name: "Helmet",
            address: "0x948d2a81086A075b3130BAc19e4c6DEe1D2E3fE8",
            pid: 5,
            tokenSymbol: "Helmet",
            rewardSymbol: "XBurger",
            tokenType: 1,
            isReward2: false,
        },
        {
            name: "ROCKS",
            address: "0xA01000C52b234a92563BA61e5649b7C76E1ba0f3",
            pid: 6,
            tokenSymbol: "ROCKS",
            rewardSymbol: "XBurger",
            tokenType: 1,
            isReward2: false,
        },
    ],
    97: [
        {
            name: "xBURGER/BURGER",
            address: "0x0bABe5Ede1BdC62520658289000661587F011f2A",
            pid: 2,
            tokenSymbol: "xBURGER-BURGER",
            rewardSymbol: "XBurger",
            reward2Symbol: "BURGER",
            tokenType: 2,
            isReward2: true,
        },
        {
            name: "xBURGER/USDT",
            address: "0x84296a9028AC2956048A2415bb66AE82DeCB8CA0",
            pid: 3,
            tokenSymbol: "xBURGER-USDT",
            rewardSymbol: "XBurger",
            tokenType: 2,
            isReward2: false,
        },
        {
            name: "xBURGER/BNB",
            address: "0xC2c8033382bbcc5ae89E7a75DD6652eaeE7B5096",
            pid: 4,
            tokenSymbol: "xBURGER-BNB",
            rewardSymbol: "XBurger",
            tokenType: 2,
            isReward2: false,
        },
        {
            name: "xBURGER",
            address: "0xd1f461C7Ced3Bb1810B9393dB9BD2De1819fd4e5",
            pid: 0,
            tokenSymbol: "xBURGER",
            rewardSymbol: "XBurger",
            tokenType: 1,
            isReward2: false,
        },
        {
            name: "BURGER",
            address: "0x06bF890dfF5b422c35c9683f47d2d7663f6E1c24",
            pid: 1,
            tokenSymbol: "BURGER",
            rewardSymbol: "XBurger",
            tokenType: 1,
            isReward2: false,
        },
    ],
}

const ChainSymbol = {
    WToken: {
        1: "WETH",
        42: "WETH",
        56: "WBNB",
        97: "WBNB",
        128: "WHT",
        256: "WHT"
    },
    ZeroToken: {
        1: "ETH",
        42: "ETH",
        56: "BNB",
        97: "BNB",
        128: "HT",
        256: "HT"
    }
}

const BALLOT_BYTECODE = ""


export {CHAIN_RPC, CHAIN_BROWSER, CHAIN_NAME, Tokens, ShackPools, ShackFarmPools, ContractsAddr, ChainSymbol, BALLOT_BYTECODE, IPFS_URL, IPFS_IFO};
