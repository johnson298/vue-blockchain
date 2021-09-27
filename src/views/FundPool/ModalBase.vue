<template>
	<el-dialog
		class="dialog-madel"
		:close-on-click-modal="false"
		:visible="open"
		:before-close="close"
	>
		<header class="dialog-title">
			<template v-if="$slots.header">
				<slot name="header"></slot>
			</template>
			<template v-else>
				{{ title }}
			</template>
		</header>
		<main>
			<div class="dialog-body">
				<el-form :model="form" :rules="rule" ref="ruleForm"  @submit.native.prevent>
					<el-form-item prop="amount">
						<el-input
							:placeholder="$t('Form.PlaceAmount')"
							v-model="amount"
							autocomplete="off"
						>
							<span class="append-box" slot="suffix">
								<div class="up" v-show="append">{{ append }}</div>
								<a-max @click.stop="all" />
							</span>
						</el-input>
					</el-form-item>
				</el-form>
				<slot></slot>
			</div>
		</main>
		<footer class="dialog-footer">
			<el-button class="public-button-dark button-200" @click="close">
				{{ $t("Button.SignOut") }}
			</el-button>
			<el-button
				:loading="submitLoading"
				class="public-button-dark button-200"
				type="primary"
                :disabled="!amount || amount<= 0"
				@click="submitForm('ruleForm')"
				>{{ $t("Button.Ok") }}
			</el-button>
		</footer>
	</el-dialog>
</template>

<script>
export default {
	name: "ModalBase",
	model: {
		prop: "value",
		event: "change",
	},
	props: {
		value: "",
		title: {
			type: String,
			default: "",
		},
		append: {
			type: String,
			default: "",
		},
		open: {
			type: Boolean,
			default: true,
		},
		maxLimit: "",
		type: "",
	},
	computed: {
		amount: {
			get() {
				return this.form.amount;
			},
			set(val) {
				this.form.amount = val;
				this.$emit("change", val);
			},
		},
	},
	watch: {
		value: {
			handler(val) {
				if (val !== this.form.amount) {
					this.form.amount = val;
				}
			},
			immediate: true,
		},
	},
	data() {
		const checkedSize = (rule, value, callback) => {
			if (!value) {
				return callback(new Error(this.$t("Form.PlaceAmount")));
			}
			if (this.type === "repayment" || this.type === "withdraw") {
				callback();
				return;
			}
			if (this.maxLimit) {
				const val = this.$number(value);
				if (val.isGreaterThan(this.maxLimit)) {
					// callback(new Error(this.$t('Public.RemainSupplyError')));
					callback(new Error(this.$t("Form.HaveExceeded")));
				} else {
					callback();
				}
			} else {
				callback();
			}
		};

		return {
			form: {
				//弹框表单
				amount: "",
			},
			rule: {
				//弹框表单校验
				amount: [{ validator: checkedSize, trigger: "blur" }],
			},
			submitLoading: false,

			typeList: {
				mortgage: this.$t("Button.Mortgage"),
				loan: this.$t("Button.Loan"),
				repayment: this.$t("Button.Repayment"),
				withdraw: this.$t("Button.Extract"),
				investment: this.$t("Button.ReInvestment"),
				deposit: this.$t("Button.Deposit"),
				receive: this.$t("Button.Receive"),
			},
		};
	},
	methods: {
		close() {
			this.$emit("update:open", false);
		},
		submitForm() {
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					this.submitLoading = true;
					this.$emit("submit", {
						value: this.form.amount,
						next: () => (this.submitLoading = false),
						reset: () => this.$refs.ruleForm.resetFields(),
					});
				} else {
					return false;
				}
			});
		},
		all() {
			this.form.amount = this.maxLimit.toString();
            console.log('this.maxLimit', this.maxLimit.toString())

            if (this.type === "withdraw" || this.type === "repayment") {
				this.$emit("allClick");
			}
		},
	},
};
</script>

<style scoped>
</style>
