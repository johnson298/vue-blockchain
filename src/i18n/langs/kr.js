import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import {ProjectCoin, ChainCoin} from '@/assets/js/coin';

const zh = {
    Nav: {
        Pool: '풀',
        My: '내 자산',
        Liquidation: '청산',
        Government: '거버넌스',
        Mobility: '유동성 채굴'
    },
    Base: {
        SwitchChain: 'BSC 체인으로 전환하세요',
        SwitchChainTip: '다음 단계로 진행하기 전에 BSC 체인으로 전환하십시오.',
        Btoken: 'BSC 네트워크의 불안정성 때문에, 크로스체인 거래를 식별할 수 없어 지연될 수 있습니다. 하지만 자산은 안전하며 버거스왑 팀원의 검수 후 월렛에 성공적으로 전송되도록 할 것입니다.',
        BtokenTip: '사용 위험은 스스로 부담합니다。',
    },
    Solo:{
        Title: '버거 쉑',
        Tip: '단일 자산 이중 채굴 애그리게이터',
        TotalLock: '총 잠긴 가치',
        UserIncome: '총 생성된 사용자',
        Symbol: '토큰',
        Placeholder: '수량을 입력하세요',
        Annualized: '총 APY',
        Use: '남은',
        Balance: '잔고',
        ExtractableUse: '유효한',
        Income: '총 획득',
        Receive: '획득',
        Approve: '권한 부여',
        Deposit: '보증금',
        Withdrawal: '인출하다',
        Extraction: '수확',
        ShackTip: "*버거 쉑의 단일 토큰 애그리게이터는 Solo에 의해 전략적으로 제공됩니다. 사용자는 집계하는 동안 mdex에 들어오고 나가는 자금을 포함해 어떤 잠재적인 위험이 발생할 수 있음을 인지해야 합니다.",
        ApyTip: '인출되지 않은 수입은 매 10 분마다 계약에 의해 재투자됩니다..' ,
        ApyTips: '공지: 복리 이자는 시간이 지남에 따라 크게 증가하며, 자주 청구할 경우 영향을 받을 수 있습니다.',
        TotalApy: '총 APY',
        FarmApy: 'Farm APY',
        FarmApr: 'Farm APR',
        AddApr: 'APY 추가',
        XburgerApr: 'XBURGER APR',
        Lock: '총 보증금',
        Times: 'xBURGER 채굴 카운트다운',
        Hour: '시간',
        Minutes: '분',
        Seconds: '초',
    },
    Account: {
        Title: '계정 정보',
        DepositText: '예금',
        Pledge: '담보',
        MiningRevenue: '채굴 수익',
        AccountBalance: '계정 잔액',
        ToCollected: '미수령 수익',
        Total: '총자산：',
        TotalAssets: '계정 총자산',
        FundPool: '투자풀',
        AmountDeposits: '예금 수량',
        AmountLoan: '대출 수량',
        ProportionPool: '풀 비율',
        NetAssetValue: '순자산',
        AssetProfile: '자산 내용',
        TransactionHistory: '거래 내역',
        LiquidationHistory: '청산 내역'
    },
    Main: {
        Account: '내 계정',
        Liquidation: '청산',
        Mobility: '유동성 채굴',
        FAQ: '거래',
        Medium: '미디움',
        ComingSoon: '많은 기대 바랍니다',
        WalletNotConnected: '지갑을 연결하지 않았습니다',
        ConnectWallet: '지갑 연결',
        LogOut: '로그아웃',
        Zh: '중국어',
        En: '영어',
        NotInstalled: 'METAMASK 지갑을 설치하지 않았습니다. 다운로드 후 다시 시도하세요',
        Download: '다운로드 하기',
        Connect: '연결'
    },
    FundPool: {
        LockUp: 'TVL',
        Table: {
            Asset: '자산 담보',
            MarketSize: '시장 규모',
            TotalBorrowings: '총 대출액',
            TotalCollateral: '총 담보 가치',
            AnnualDeposit: '예금 연간 화',
            AnnuaLisationLoans: '대출 연간 화',
            UtilizationRate: '사용률'
        },
        Charging: '저금',
        Lend: '대출',
        Loan: '대출',
        Switch: '전환',
        AmountDeposit: '토큰 수량',
        BorrowedQuantity: '대출 수량',
        TransactionRecords: '거래 내용',
        TradingHours: '거래 시간',
        Active: '이벤트',
        Hash: '해시값',
        Survey: '풀 현황',
        TotalPledgeQuantity: '총 담보 수량',
        TotalSupply: '총 지급 수량',
        Output: '수확한 토큰',
        AnnualisationCurrency: 'APR',
        AnnualizedDeposit: 'APY',
        MaximumLoan: '최대 차입비율',
        Representative: '대출과 예금 가치의 비율은 특정 담보의 최대 대출능력입니다',
        LiquidationRatio: '청산 비율',
        CurrentLoanDepositRatio: '현재 차입비율이 청산 비율을 초과할 경우 해당 자산은 청산됩니다',
        AnnualMining: '채굴 연간 이율',
        PlatformCurrency: '플랫폼 토큰 채굴 연간 이율',
        WalletBalance: '지갑 잔액',
        MyRepayable: '상환 금액',
        Deposited: '저금 완료',
        LoanAmount: '대출 금액',
        LoanInterest: '대출 이자',
        Collateral: '상환 시 담보물 등비율로 반환',
        AcceptableQuantity: '인출 가능 수량',
        RemainSupply: '풀 잔액',
        AcceptableAmount: '인출 가능 수량은 원금 및 이자 포함',
        GainRevenue: '예금 이자',
        LiquidationApportionment: '청산 할당',
        OfLiquidation: '청산 시 담보물은 예금자에게  할당 가능',
        Desirable: '인출 가능',
        CanBorrow: '대출 가능',
        ComprehensiveApy: '예금 종합 수익',
        ApyMining: '채굴 연간 이율',
        ComprehensiveApyTips: '예금 종합 수익= 채굴 연간 이율+ 예금 연간 이율',
        DepositInterestRate: '예금이율',
        LoanInterestRate: '대출이율',
        FloatingRateLoan: '변동이율 대출',
        Past30DAvg: 'Past 30D Avg.',
        PercentageTotal: '총 수의 퍼센트율',
        TheFluctuation: '이율 변동의 영향을 받으므로 수량은 실제 기준을 참고하세요',
        GainRevenueInterest: '수 익획득',
        APY: '예금 연간 이율',
        APR: '대출 연간 이율',
        canLoan: '대출 가능',
        DepositTips: '*   상환 시 담보물 및 LP 채굴 수익을 등비율로 반환'
    },

    Staking: {
        Title: '7UP 담보 및 수수료 풀 리워드 받기',
        AwardsAllocated: '리워드 분배 완료',
        MortgageQuantity: '총 담보 수량',
        Available: '획득 가능',
        Mortgaged: '담보 완료',
        DepositAmount: '저금 가능',
        Extractable: '인출 가능',
        AvailableAsset: '사용 가능',
        WithdrawalPledge: '담보 인출'
    },
    Parameter: {
        Title: '공공 인자',
        ParameterName: '인자 명칭',
        ParameterValue: '인자 수치',
        CommonParameters: '공공 인자',
        Name: '명칭',
        BaseRate: '기초 이율',
        MarketHeat: '마켓 히트',
        PledgeRate: '담보율',
        OutStockRate: '강제 청산율'
    },
    Government: {
        Title: '거버넌스',
        CreateProposal: '제안 설립',
        SelectProposal: '제안을 선택하세요',
        SelectPool: '풀을 선택하세요',
        CurrentAmount: '현재 액수',
        FollowingRange: '현재 제안은 범위 내의 숫자를 입력할 수 있습니다',
        NumberYouWant: '원하시는 글자 수를 입력하세요',
        EnterDetails: '상세한 내용을 입력하세요',
        YourBallot: '리워드',
        leftPrompt: '',
        OnGoing: '진행 중',
        Finished: '완료',
        Creater: '설립자',
        Creat: '설립',
        TotalBallot: '총 리워드',
        VoteBonus: '투표 리워드',
        YourBonus: '리워드',
        Collect: '수령',
        Effection: 'Effection',
        YouVote: '내 투표',
        Balance: '잔액',
        BalanceTips: '',
        parametersGovernance: '거버넌스 인자',
        View: '보기',
        TotalGovernance: '거버넌스 총 담보 수',
        Pending: '보류 중',
        Success: '성공',
        Error: '에러',
    },
    GovernmentJson: {
        PROPOSAL_VOTE_DURATION: '투표시간 제안',
        PROPOSAL_EXECUTE_DURATION: '투표 종료 후 실행 가능한 시간 제안',
        PROPOSAL_CREATE_COST: '제안 시작 비용',
        STAKE_LOCK_TIME: 'staking 시간',
        MINT_AMOUNT_PER_BLOCK: '개당 블록 토큰 생산 수량',
        INTEREST_PLATFORM_SHARE: '이자 수입 팀 물량',
        INTEREST_BUYBACK_SHARE: '이자 수입 바이백 물량',
        CHANGE_PRICE_DURATION: '가격 간격 변경 최소 시간 수정',
        CHANGE_PRICE_PERCENT: '최대 가격 퍼센트율 수정',
        POOL_BASE_INTERESTS: '풀 기초 이율',
        POOL_MARKET_FRENZY: '풀 마켓 히트',
        POOL_PLEDGE_RATE: '풀 담보율',
        POOL_LIQUIDATION_RATE: '풀 청산율',
        POOL_MINT_BORROW_PERCENT: '대출 채굴 리워드 퍼센트율',
        POOL_MINT_POWER: '채굴 파워'
    },
    Button: {
        Obtain: '획득',
        Earn: '획득',
        Authorization: '권한 부여',
        Mortgage: '담보',
        Release: '담보 해제',
        Extract: '인출',
        All: '전부',
        SignOut: '탈퇴',
        Ok: '확인',
        TakeOut: '인출',
        Loan: '대출',
        Repayment: '상환',
        Deposit: '저금',
        ReInvestment: '재투입',
        Back: '이전 페이지로 가기',
        Redeem: '환매',
        Implement: '집행',
        Receive: '수령',
        Return: '되돌아가기',
        Vote: '투표',
        GovernanceAwards: '거버넌스 어워즈',
        InitiateAProposal: '제안 개시',
        Add: '추가',
        Provide: '추가',
        Cancel: '취소'
    },
    Form: {
        PlaceAmount: '수량을 입력하세요',
        HaveExceeded: '제한을 초과했습니다',
        TheRange: '제한 내의 숫자를 입력하세요',
        All: '전부',
        Completed: '완성',
        HaveInHand: '진행 중',
        Fail: '실패',
        ProposalType: '제안 유형을 선택하세요',
        Filter: '필터'
    },
    LiquidationPage: {
        ClearInformation: '청산 정보',
        AssetText: '자산',
        AmountReturned: '상환 수량',
        QuantityPledge: '담보물 수량',
        CurrentLoanDeposit: '현재 차입금 비율',
        LiquidationRatio: '청산 비율',
        Operation: '작업',
        LoadMore: '더 많이 보기',
        LiquidationRecords: '청산 기록',
        LiquidationTime: '청산 시간',
        LiquidationQuantity: '청산 수량',
        QuantityCollateral: '담보물 수량'
    },
    Public: {
        OperationSuccess: '실행 성공',
        Liquidation: '청산',
        NotData: '데이터가 없습니다',
        ProposedQuantity: '인출 수량은 비워둘 수 없습니다',
        OperationFailed: '실행 실패',
        SuccessfulInvestment: '재투입 성공',
        ExtractionSucceeded: '인출 성공',
        RemainSupplyError: '현재 풀은 인출할 수 있는 액수가 부족합니다',
        MintLender: '예금 채굴',
        MintBorrower: '대출 채굴'
    },
    Mobility: {
        MiningTitle: `${ProjectCoin} 를 담보하여 ${ProjectCoin}를 받아가세요`,
        BecomeLiquidity: `유동성 제공자가 되여 ${ProjectCoin}를 획득하세요`,
        AddCoins: `지정 토큰 BEP-20를 추가하고 ${ProjectCoin}  를 받아가세요`,
        NextReward: '다음 리워드',
        Add: '추가',
        Earn: '받아가기',
        Receive: '수령'
    },

    setting: {
        settingTitle: '거래 설정',
        toleranceTitle: '슬리피지 상한',
        deadlineTitle: '거래 시간',
        minute: '분',
        LanguageSet: '언어 설정',
        msg: {
            '0': '거래가 실패할 수 있습니다.',
            '1': '거래가 우선 처리됩니다.',
            '2': '잘못된 슬리피지 설정입니다.'
        },
        proTxts: {
            '0': '가격 슬리피지가 본인의 설정보다 높을 경우 거래는 취소됩니다.',
            '1': '대기 시간이 본인의 설정보다 길어질 경우 거래는 취소됩니다.'
        }
    },
    MyData: {
        MyData: '내 데이터',
        TotalTrade: '총 거래',
        TotalRevenue: '총 수익',
        Trade: '거래',
        Revenue: '수익',
        week: '주',
        month: '달'
    },
    MyDataTrade: {
        Governance: '거버넌스',
        'ParticipationVote ': '참여 투표',
        'VoteRevenue ': '투표 수익',
        Bridge: '브릿지',
        CosschainAssets: '크로스체인 자산',
        CrosschainValue: '크로스체인 자산 가치'
    },
    MainView: {
        Swap: '스왑',
        Pool: '풀',
        Lending: '대출',
        Governance: '거버넌스',
        Transit: '크로스 체인',
        vol: `24H Total Volume (${ChainCoin})`,
        liq: `Total Liquidity (${ChainCoin})`,
        Ifo: 'IFO',
        NextPage: '다음 IFO',
        PastPage: '이전 IFO',
        Bridge: '자산 크로스 체인',
        BurgerBridge: '버거 브릿지',
        BinanceBridge: '바이낸스 브릿지',
        Info: '정보',
        Analytics: '데이터 통계',
        My: '내 데이터',
        OpenApi: '오픈API',
        Trade: '거래',
        LaunchPad: '런치패드',
        FarmingPools: '런치풀',
        Farms: '농장',
        Doc: '문서',
        XBurgerShack: 'xBurger 풀',
        Prediction: '예측'
    },
    swapControl: {
        ErrorPair: '유동성 부족',
        all1_btn: '전부',
        PriceText: '환율',
        per: 'per',
        chooseTokenText: '토큰 선택',
        PriceImpact: '가격 영향',
        Fee: '수수료',
        Router: '라우터',
        proTxts: {
            '0': '환율에 의의가 있을 시 확인전 거래를 취소할 수 있습니다.',
            '1': '이번 거래가 유동성 풀에 미치는 영향.',
            '2': '매건 0.3 % 의 수수료는 유동성 공급자에게 리워드 됩니다.',
            '3': '자동으로 가성비가 제일 높은 교환 경로를 계산합니다.'
        },
        balanceTitle: '잔액: ',
        balanceTitle0: '잔액: ',
        From: '지불',
        To: '획득',
        textSuffix: ' (예측)',
        Swap: '스왑',
        ConnectWallet: '지갑 연결',
        Minimumreceived: '획득(최소)',
        Maximumsold: '지불(최대)',
        receive: '획득(최소)',
        sell: '지불(최대)',
        Insufficient: '잔액 부족',
        Approve: '권한 부여',
        Approvingfor: '권한을 부여받다'
    },
    poolControl: {
        Collecting: `유동성 기여에 대한 리워드 ${ProjectCoin}를 받고 있습니다`,
        Connect_btn: '유동성 추가',
        Your: '내 유동성',
        Connect: '유동성 체크 전 지갑을 연결하세요',
        see: '스왑이 부족합니까? 추가하기',
        Importit: '추가. ',
        proTxt1:
            `유동성을 추가할 경우 ${ProjectCoin}리워드를 받을 수 있습니다. 유동성 스왑을 찾지 못하면 아래 링크를 클릭하여 추가할 수 있습니다.`
    },
    governanceControl: {
        All: '전부',
        feeSumtitle: '수수료 총 수입: ',
        stakeSumtitle: '거버넌스 총 담보: ',
        Totalsupplytitle: '총 생산량: ',
        totalstaked: '총 담보',
        feesum: '총 수수료 내역',
        Currentbonuspool: '현재 풀',
        Staking: '담보중',
        Redeeming: '환매중',
        Approve: `${ProjectCoin}권한을 부여하였습니다...`,
        Approvingfor: `${ProjectCoin}로 부터 권한을 부여받았습니다`,
        Insufficient: `${ProjectCoin} 잔액 부족`,
        rejected: '거래가 기각되었습니다.',
        balancetext: ` (담보) ${ProjectCoin}`,
        Balance: '잔액:',
        totalDgastitle: '현재 제안 풀: ',
        totalBurned: '총 소각:',
        stake_btn: '담보',
        redeem_btn: '환매',
        voteTitle: '제안',
        FilterBtn: '선별      ',
        NewVoteBtn: '제안 설립',
        bellottitle: '내 표수:',
        connectBtn: '지갑 연결 ',
        proTxts: {
            '0': `${ProjectCoin}를 담보하고 거버넌스에 참여할 시 일정 기간 뒤 환매할 수 있습니다.`,
            '1': `본인의 표수로 투표를 진행하고 이에 상응되는 ${ProjectCoin}리워드를 받아 가세요.`
        },
        stakeTitle: `내 ${ProjectCoin} 담보`,
        redeemTitle: `내 ${ProjectCoin} 환매`,
        stake: '담보 가능: ',
        redeem: '환매 가능: ',
        stakeBtn: '담보',
        processType1: '통과',
        processType2: '진행 중',
        processType3: '미통과',
        maxBtn: '전부',
        hrs: ' 시간(예측) 뒤 환매가 가능합니다',
        networkLink: '지갑 네트워크 바꾸기'
    },
    AccountInfoUI: {
        Account: '계정',
        Connected: 'MetaMask 연결',
        copy_btn: '카피',
        copySuccess: '카피 성공',
        view_btn: 'BscScan에서 문의',
        Recent: '최근 거래',
        clear_btn: '삭제 기록'
    },
    AddLiquidityUI: {
        LpAmount: 'LP 수량',
        Supply: '저금',
        Insufficient: '잔액 부족',
        Approve: '권한 부여',
        Approvingfor: '권한을 부여받다',
        add_btn: '추가',
        remove_btn: '인출',
        mintReward_btn: '수령',
        feeReward_btn: '수령',
        Pooled: '충전 ',
        tokens: `${ProjectCoin} 토큰:`,
        Liquidity_mining: '유동성 마이닝 수익',
        Liquidity_total_mining: '총 수익',
        share: '스왑 유동성 퍼센트율:',
        Pool_fees: '수수료 수익:',
        Add: '유동성 추가',
        all1_btn: '전부',
        all2_btn: '전부',
        pricesTitle: '가격과 풀 기여 비율',
        Choose: '토큰 선택',
        p_title1: '입력',
        p_title2: '입력',
        g2_txt3: '풀 비율',
        Your: '유동성 스왑 추가',
        balancetitle: '잔액:',
        balancetitle1: '잔액:',
        proTxt1:
            `유동성 추가 시 ${ProjectCoin}리워드를 받을 수 있습니다. ${ProjectCoin}는 시간이 지날수록 차지하는 비율에 따라 증가할 예정이며 수시로 리워드를 저당할 수 있습니다.`
    },
    pool_import: {
        title: '새 유동성 스왑 추가',
        coin2_title: '토큰 선택',
        proTxt1: '이 도구를 이용해 나타나지 않은 스왑을 찾으세요',
        Connect: '유동성 체크전 지갑을 연결하세요'
    },
    coinSelectView: {
        selectTitle: '토큰 선택',
        coin_title: '토큰 네임',
        Having: '원하시는 토큰이 없나요？',
        proTxts: '토큰 네임 혹은 주소를 붙여 검색하세요',
        Search: '토큰 네임 혹은 웹 주소를 입력하세요',
        searchInput: '토큰 네임 혹은 웹 주소를 입력하세요'
    },
    VoteBooleanDetail: {
        ValuechangeTitle: '제안 영향: ',
        blocksleft: ' 블록 잔여',
        proposaleraddressTitle: '제안자: ',
        Proposalerbonus: '(제안 리워드)',
        TotalBallotTitle: '총 표수: ',
        finishedtitle: '완료: ',
        Vot: '투표',
        Vote: '투표 리워드: ',
        Detail: '상세정보',
        btnExecute: '실행',
        Execute: '실행 가능',
        Executed: '실행 완료',
        Collected: '수입 완료',
        Collect: '수입',
        You: '내 투표수 ',
        Your: '투표 가능',
        affirmative: '찬성표 투표',
        dissenting: '반대표 투표',
        Creat: '설립: ',
        BonusText: '내 리워드: ',
        BonusText1: '내 리워드',
        processType1: '통과',
        processType2: '진행중',
        processType3: '미통과',
        Collectvote: '투표 리워드 받기',
        Executeproposal: '제안 실행'
    },
    RemoLiquidity: {
        title: '유동성 인출',
        amountT: '수량',
        Btn_100: '전부',
        Prices: '환율',
        Your: '인출한 유동성 스왑',
        enter: '수량 입력',
        Approve: '권한 부여',
        Approvingfor: '권한을 부여받다',
        RemoveFirePairTip:
            `${ChainCoin} —FRIES에서 유동성을 제거하면 W${ChainCoin} 및 FRISE가 제공됩니다.`,
        Remove: '인출',
        Removing: '인출 중',
        and: '및',
        proTxt1:
            '유동성 제거 시 제거 수량 몫의 유동성이 차지하는 비율만큼 줄어듭니다.'
    },
    comfirmSwapView: {
        Swapping: '스왑 중',
        for: '교환',
        PriceImpact: '가격 영향',
        Fee: '수수료',
        title: '확인',
        Price: '환율',
        submitBtn: '확인',
        proTxts: {

            '1': '이번 거래가 유동성 풀에 미치는 영향.',
            '2': '매건 0.3%의 수수료는 유동성 공급자에게 리워드 됩니다.',
        },
        Output: '스왑 된 토큰은 예측에 불과합니다',
        or: ' 스왑 실패 시 롤백 합니다.',
        rejected: '거래가 기각 되었습니다.'
    },
    confirmSupplyView: {
        rejected: '거래가 기각 되었습니다.',
        Supplying: '저금 중',
        and: '및',
        Rates: '비율',
        You: `${ProjectCoin}를 획득할 수 있습니다`,
        Share: '스왑 유동성 기여 :',
        Desposite: '저금',
        submitBtn: '저금 확인',
        Once: `유동성에 저금 즉시 ${ProjectCoin}가 지급됩니다.`,
        msg:
            '가격이 설정된 슬리피지보다 높을 경우 거래는 롤백 되어 사용자이 이익을 보장합니다.'
    },
    nowVote: {
        txTitle: '제안 설립',
        TokenAddress: '토큰 주소',
        addressInput: '주소 붙이기',
        txSelectItem: '선택 ...',
        txVoteBonus: '투표 리워드(예측): ',
        txItemDescrible: `${ProjectCoin}(미 담보)를 통해 제안을 설립하세요`,
        btnSubmit: '제출',
        rangeText: '현제 제안은 아래 범위 내의 수만큼 입력이 가능합니다   ',
        amount_input: '원하는 숫자를 입력하세요',
        content_input: '상세한 내용을 입력하세요',
        PayDGAS: `지불${ProjectCoin}`,
        txVoteBonas: '지불',
        txSelectItem1: '지불을 원합니다',
        txItemDescrible1: '로딩 중...',
        btnApporve: '권한 부여',
        btnNewToken: '토큰 상장',
        Confirm: '확인',
        Address: '주소:',
        Fee: '비용:',
        You: '지불할 예정입니다 ',
        token: ` 토큰 상장 필요 ${ProjectCoin} `,
        updateconfig: ` 설정 업데이트 필요 ${ProjectCoin} `,
        btnConfirm: '확인',
        Pay: '지불 ',
        Next: '다음',
        Submit: '제출',
        SubmitVote: '제안 제출',
        Currentvalue: '현재 액수 ',
        Goodjob: '√',
        notenough: '잔액이 부족합니다.',
        rejected: '거래가 기각 되었습니다.'
    },
    submit: {
        error: '에러',
        close_btn2: '확인',
        View: '블록체인 웹 사이트에서 검색',
        closeBtn: '확인',
        transaction1: '거래를 제출하였습니다',
        waiting: '확인중',
        confirm: '지갑에서 이번 실행을 확인하세요'
    },
    linkView: {
        About: '우리에 대하여',
        Code: '코드',
        Contract: '계약',
        telegraph: '텔레그램',
        analytics: '분석',
        doc: 'OpenApi',
        cross: '크로스 체인 브릿지'
    },
    'Event': {
        'FOR': {
            'Home': '홈 페이지',
            'Name': 'FOR 유동성 풀',
            'DateTitle': '이벤트 기간：',
            'Date': '9월 16일 23시~ 9월 22일 23시 (한국시간)',
            'RewardsTitle': '리워드：',
            'Rewards': '45,000 BURGER 및 100,000 FOR 6일 기한 총 리워드',
            'RulesTitle': '이벤트 룰：',
            'Rules': 'BurgerSwap 유동성 제공자에게 리워드 풀을 제공할 예정입니다. FOR유동성 제공자는 FOR/BNB와 FOR/BURGER 두 스왑의 평균 유동성 순서로 1～100위의 유동성 제공자는 에어드랍을 받을 수 있습니다. fortube는 for/bnb에게, for/Burger 스왑은 일일당 10만for 리워드를 제공하고 유동성 차지비율만큼 분배되고 이벤트 종료 후 공식 소셜 미디어에 수상 주소를 발표 할 예정입니다.',

            'BonusTitle': '리워드 설정：',
            'No1': 'No1：',
            'No1Amount': '2500 BURGER',
            'No2': 'No2：',
            'No2Amount': '1000 BURGER',
            'No3': 'No3：',
            'No3Amount': '500 BURGER',
            'No4': 'No4-No10：',
            'No4Amount': '인당 100 BURGER',
            'No5': 'No11-No100：',
            'No5Amount': '잔여 리워드 차등 지급'
        }
    },
    'Update': {
        'Des': '거버넌스 블록 V2 업그레이드 중, 많은 기대 바랍니다',
    },
    'Transit': {
        'Tip': {
            '0': '',
            '1': 'Bep 20부터 Erc 20는 현재 “bToken” 크로스 체인 전이만 지지합니다. “bToken”는 Erc20토큰이 BurgerSwap을 통해 설립한 크로스 체인 자산입니다.',
            '2': '크로스 체인 서비스 수수료는 BSC 체인에서 크로스 체인 자산을 접수 시 받을 예정입니다. 총 수수료는 0.05 BNB 서비스 비용 및 체인에서 거래 시 발생하는 Gas 비용을 포함합니다',
            '3': 'Bep 20부터 Erc 20는 현재 “bToken” 크로스 체인 전이만 지지합니다. “bToken”는 Erc20토큰이 BurgerSwap을 통해 설립한 크로스 체인 자산입니다. 크로스 체인 전이는 0.05BNB 서비스 비용을 포함합니다.',
            '4': '주의사항, 크로스 체인을 통해 전이된 BSC 자산(bTokens)은 bToken/BNB와 bToken/BURGER 스왑에서 유동성을 제공한 후 거래가 가능합니다.'
        },

        'ListTitle': '크로스 체인 기록',
        'Recieve': '접수',
        'Receiving': '접수 중',
        'Copy': '클릭하여 계약 주소 복사',
        'TransitBtn': '크로스 체인 자산 설립',
        'RedeemBtn': '크로스 체인 자산 교환',
        'ETHTip': '지갑 네트워크를 BSC 네트워크로 전환하여 크로스 체인 자산을 교환하세요',
        'BSCTip': '크로스 체인 자산을 설립하려면 지갑을 ETH 네트워크로 체인지 하세요',
        'BSCClose': '사용자 자산 보안을 위해 ERC20 to BEP20 cross-chain bridge 사용을 중단하고 이 기능을 긴급 유지하기로 했다.',
        'Note': {
            '0': '주의사항, 크로스 체인을 통해 전이된 BSC 자산(bTokens)은 bToken/BNB와 bToken/BURGER 스왑에서 유동성을 제공한 후 거래가 가능합니다.',

            '1': 'bToken이 BurgerSwap에서 거래를 하지 않았다면 유동성을 제공하여 거래를 실행하세요',

            '2': 'SWAP 페이지 리스트에서 bToken이 BurgerSwap에서 거래가 가능한지 확인하세요',

            '3': 'BNB， USDT， BUSD， LINK， DOT 등 토큰 거래를 원하신다면 아래 두 가지 방법을 통해 ERC20(ETH) 및 BEP2(BIANANCE)를 BEP20(BSC)로 교환 가능합니다：',

            '4': '1.<a style="color: #3B8CFF;cursor: pointer;" href="https://Binance.com">https://Binance.com</a>를 통해 인출',

            '5': '2.Binance Chain Chrome를 통해 프로그램 확장',

            '6': '상세한 내용은 가이드 참고 바랍니다. Medium <a style="color: #3B8CFF;cursor: pointer;" href="https://medium.com/@bnburgerking">https://medium.com/@bnburgerking</a>에서 가이드를 찾아보실 수 있습니다.',

            '7': '다시 보지 않기'
        },
        'MaxRange': '스왑 한계 초과',
        'Convert': '스왑',
        'ConvertSuccess': '스왑 성공',
        'ConvertDesc': '스왑한 BNB는 본인 BSC주소로 발송됩니다.',
        'ConvertTip': 'BSC에서 스마트 계약을 상호 실행할 시 BSC의 원생 BNB로 Gas 비용을 지불해야 하고 BSC 주소에 BNB가 없을 경우 이곳에서 BNB 교한이 가능하고 소득은 바로 BSC 주소로 발송됩니다.',

        'ConvertRecord': '{amountIn} {token}로 {amountOut} BNB 스왑',
        'Processing': '처리 중',
        'Completed': '완성',
        'ConvertTitle': '거래 기록',
        'Close': '닫기',
        'Station': 'BNB 충전소',
        'hashTipEth': '이더리움 트랜잭션 해시를 입력하십시오.',
        'hashTipBsc': 'BSC 트랜잭션 해시를 입력하십시오.',
        'hashTipSubmit': '제출',
        'hashTipSuccess1': '완료',
        'hashTipSuccess2': '성공적으로 업데이트됨',
        'hashTipError': '잘못된 데이터',
        placeAccount: '{account} 주소 작업으로 전환하십시오.'
    },
    Ifo: {
        title: 'IFO: 최초 채굴 발행',
        subTitle: 'IFO는 프로젝트가 일종의 탈 중심화 방식을 통해 자신의 프로젝트 코인을 발행할 수 있도록 돕습니다',
        onGoing: '진행 중',
        end: '완료',
        comingSoon: '커밍순',
        comingTitle: '이벤트 시작 전<span>{d}알 {h}时시{m}분 {s}초</span>',
        openTime: '이벤트 종료 전<span>{d}알 {h}时시{m}분 {s}초</span>',
        partakeToken: '참여 토큰:',
        all: '전부',
        contribute: '재충전',
        approve: '권한 부여',
        committed: 'LP Token 충전 완료',
        claimable: '인출 가능',
        claimAll: '모든 토큰 인출',
        startTime: '시작 시간',
        ifoAmount: 'Token 수량',
        raiseAmountUSD: '자금 모집(USD)',
        burnAmountUSD: 'Burger 소각(USD)',
        percentage: '총 모집 (모집 목표 퍼센트율)',
        pricePer: 'Price per {token}',
        projectInfo: '프로젝트 소개',
        website: '프로젝트 홈 페이지 ->',
        noData: '데이터가 없습니다...',
        balance: '잔액:',
        useCommitted: '투자 완료:',
        details: '상세정보 보기',
        hide: '숨기기',
        rule1: '참가 방식',
        rule2: '판매 전:',
        rule3: 'BURGER 및 USDT 토큰 <br> *을 구매하고 BURGER 와 USDT 유동성을 증가시켜 BURGER-USDT BLP를 얻을 수 있습니다',
        rule4: 'Get Burger',
        rule5: 'Get BLP tokens',
        rule6: '판매 기간:',
        rule7: '* 판매 과정 중 BURGER-USDT BLP 토큰을 제출하여 IFO 토큰을 구매하세요.',
        rule8: '판매 후:',
        rule9: '* 구매한 토큰 및 사용하지 않은 자금을 수령하세요.',
        rule10: 'Burgerswap에 나의 프로젝트를 발행할 방법은?？',
        rule11: 'Burgerswap에서 본인의 프로젝트를 발행하세요. Burgerswap은 BSC의 첫 번째 AMM 탈 중심화 거래소입니다. 저희와 연락을 통해 BSC에서 가장 활동적이고 빠르게 성장하는 커뮤니티에 본인의 토큰을 발행하세요.',
        comTitle: 'Coming Soon ...',
        comSubTitle: '초기 이니셜 오퍼링을 재정의 할 수있는 옵션',
        webTxt: 'NFT 시장과 함께 계속 번영하는 평행 세계를 구축하기 위해 노력하고 있으며, FUN Protocol을 통해 DeFi의 가치를 포착하고 있습니다. 평행 세계에는 독점 순환 토큰 시스템, 끊임없이 NFT 생성을 자극하는 네트워크, 그리고 NFT로 대표되는 거버넌스 생태계가 있습니다. 한마디로, FUN은 전 NFT 세계에서 흥미롭고 중요한 역할을 하고 있습니다.',

        farmTitle: '농장',
        farmSubTitle: '버거스왑 유동성 풀 토큰을 스테이킹하고 버거 또는 다른 토큰을 얻으세요.',
        inProgress: '진행 중',
        completed: '완료된',
        farmPool: '농사 풀',
        tag1: '농사',
        tag2: '완료된',
        totalRewards: '총 보상:',
        farmingPeriod: '시작 블록',
        day: '일',
        comTimeTxt: '농사가 끝날 때까지의 시간:',
        endTimeTxt: '세션 종료일',
        apr: 'APR:',
        earned: '{token} 획득',
        harvest: '수확',
        staked: '스테이킹',
        stake: '스테이킹',
        unStake: '언스테이킹',
        deposit: '보증금:',
        totalLiquidity: '총 유동성:',
        modalTitle: '{name} LP 토큰',
        isWhite: '참여 자격 없음'
    },
    xBurger: {
        title: 'xBurger 풀',
        subTitle: '스테이킹 토큰 ，xBurger 채굴',
        tvl: 'TVL'
    },
    prediction: {
        statusTag1: '만료됨',
        statusTag2: '实时',
        statusTag3: '다음',
        statusTag4: '나중에',
        closedPrice: '마감 가격',
        lastPrice: '최종 가격',
        lockedPrice: '고정 가격',
        pricePool: '가격 풀',
        payout: '지불금',
        openTxt: '정산 진행중',
        entryStarts: '입력 시작',
        setPosition: '위치 설정',
        commit: 'Commit',
        max: '최대',
        balance: '잔고',
        approve: '권한 부여',
        ok: '확인',
        tips: '입력 후 위치를 삭제하거나 변경할 수 없습니다.',
        minAmount: '최소금액 {amount}',
        pausedTxt1: '시장 일시 중지됨',
        pausedTxt2: '이 페이지의 기록 탭을 통해 기존 위치에 입력된 모든 자금을 회수할 수 있습니다.',
        footerChart: "차트",
        footerHistory: "기록",
        footerCollectAll: "모두 수집",
        footerRound: "Round",
        footerResuit: "결과",
        footerCollect: "수집",
        footerNoData: "기록이 없습니다.",
        footerGold: "보상수집",
        footerCollecting: "수집",
        footerDirection: "방향",
        footerUP: "위",
        footerDOWN: "아래",
        footerPosition: "방향",
        footerCLOSED: "마감 가격",
        footerPayout: "지불금",
        footerAll: '모두',
        footerCollected: '수집됨',
        footerUncollected: '미수집'
    },
    ...zhLocale
};
export default zh;
