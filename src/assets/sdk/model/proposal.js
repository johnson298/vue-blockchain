/*
    address: 投票地址
    token: 投票的token, 只有type 是2和3才有
    subject: 标题
    content: 内容
    createTime: 创建时间
    end: 是否结束
    YES: 赞成票数
    NO:  反对票数
    totalReward: 投票总奖励
    voted: 是否投票
    voteIndex: 投了什么 1赞成 2反对
    minted 是否领奖
    weight 投过的票数
    type:  投票类型
    audited: 是否执行过
    value: 投票的值
    key: 投票的key
 */

class Proposal {
    constructor(address, token, type, subject, content, createTime, end, YES, NO, totalReward, voted, voteIndex, minted, weight, audited) {
        this.address = address;
        this.subject = subject;
        this.content = content;
        this.createTime = createTime;
        this.end = end;
        this.YES = YES;
        this.NO = NO;
        this.totalReward = totalReward;
        this.voted = voted;
        this.voteIndex = voteIndex;
        this.minted = minted;
        this.weight = weight;
        this.token = token;
        this.type = type;
        this.audited = audited;
    }

    setValue(value) {
        this.value = value;
    }
}

export default Proposal