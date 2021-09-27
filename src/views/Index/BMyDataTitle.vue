<template>
	<div class="BMyDataTitle">
		<div class="BMyDataTitle">
			<div class="title">My Data</div>
			<div class="pane">
				<div class="des">
					<p>{{ myvolList.accSwapValue || "--" }}</p>
					<p>Total Trade</p>
				</div>
				<div class="des">
					<p>{{ myvolList.accRewardsValue || "--" }}</p>
					<p>Total Revenue (BURGER)</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "BMyDataTitle",
	data() {
		return {
			myvolList: {
				accSwapValue: "",
				accRewardsValue: "",
			},
			address: "",
			timer: null,
		};
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.$swap.accountStatusObservable.subscribe((account) => {
				console.log("home account:", account);
				if (account) {
					this.address = account.toLocaleLowerCase();
					this.getData();
				}
			});
		},
		getData() {
			this.$store.dispatch("home/getRewardsInfo", this.address).then((res) => {
				console.log(res, "home/getRewardsInfo");
				if (
					res &&
					res.data &&
					res.data.playerRewardsEntities &&
					res.data.playerRewardsEntities.length
				) {
					let data1 = res.data.playerRewardsEntities[0];
					this.myvolList = {
						accSwapValue: "$" + this.$number(data1.accSwapValue).toFormat(2, 1),
						accRewardsValue: this.$number(data1.rewardsAmount).toFormat(2, 1),
					};
					clearTimeout(this.timer);
					this.timer = setTimeout(() => {
						this.getData();
					}, 30000);
				}
			});
		},
	},
	destroyed() {
		clearTimeout(this.timer);
	},
};
</script>

<style lang="less" scoped>
.BMyDataTitle {
	position: relative;
	margin-top: 1rem;

	.title {
		color: #ffffff;
		font-family: Inter;
		font-weight: bold;
		font-size: 24px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: left;
		border-left: 8px solid #f0b80b;
		padding-left: 8px;
		margin-bottom: 40px;
	}

	.pane {
		width: 100%;
		min-height: 100px;
		margin-bottom: 30px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.des {
		text-align: center;
		width: 50%;

		p {
			&:nth-of-type(1) {
				font-size: 40px;
				color: #f0b80b;
				font-weight: bold;
			}

			&:nth-of-type(2) {
				font-size: 18px;
				color: #ffffff;
			}
		}
	}

	.line {
		width: 1px;
		height: 40px;
		background-color: #505050;
		margin: auto 2rem;
	}
}

@media (max-width: 768px) {
	.BMyDataTitle {
		padding: 0 10px;

		.des {
			p {
				&:nth-of-type(1) {
					font-size: 22px;
				}
			}
		}
	}
}
</style>
