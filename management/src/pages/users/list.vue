<template>
	<div>
		<div style="marginBottom: 32px">
			<a-form layout="inline" :model="search" @submit="handleSubmit" v-on:submit.prevent>
				<a-form-item label="account" name="name">
					<a-input v-model:value="search.account" placeholder="account">
					</a-input>
				</a-form-item>
				<a-form-item>
					<a-button
						type="primary"
						style="marginRight: 16px"
						@click="showModel"
					>
						新增
					</a-button>
					<a-drawer
						:title="title"
						placement="right"
						:closable="true"
						v-model:visible="visible"
						:after-visible-change="afterVisibleChange"
					>
						<a-form :model="formData" ref="ruleForm" :rules="rules">
							<a-form-item label="账户" name="account" v-if="title === '新增用户'">
								<a-input v-model:value="formData.account" />
							</a-form-item>
							<a-form-item label="用户名" name="name">
								<a-input v-model:value="formData.name" />
							</a-form-item>
							<a-form-item label="角色" name="roleIds">
								<a-select
									mode="multiple"
									v-model:value="formData.roleIds"
									style="width: 100%"
									placeholder="Please select"
									@change="handleChange"
								>
									<a-select-option v-for="i in roleList" :key="i.id">
										{{i.name}}
									</a-select-option>
								</a-select>
							</a-form-item>
							<a-form-item label="密码" name="password" v-if="title === '新增用户'">
								<a-input v-model:value="formData.password" />
							</a-form-item>
							<a-form-item :wrapper-col="{ span: 24, offset: 0 }">
								<a-button type="primary" @click.native="onSubmit">
									确定
								</a-button>
								<a-button style="margin-left: 10px;" @click="resetForm">
									取消
								</a-button>
							</a-form-item>
						</a-form>
					</a-drawer>
					<a-button
						type="primary"
						html-type="submit"
					>
						搜索
					</a-button>
				</a-form-item>
			</a-form>
		</div>
		<div>
			<a-table 
			:columns="columns" 
			:data-source="data" 
			:pagination="pagination" 
			:loading="loading"
			:row-key="(record) => record.id"
    	@change="handleTableChange">
				<template #status="{record}">
					<span v-if="record.status" style="color: green">
						正常
					</span>
					<span v-else style="color: red">
						禁用
					</span>
				</template>
				<template #roles="{record}">
					<span v-for="(item, index) in record.roles">
						{{item.name + ' '}}
					</span>
				</template>
				<template #operation="{record}">
          <span class="table-operation">
            <a style="marginRight: 10px" @click="updateUser(record)">编辑</a>
						<a style="marginRight: 10px" @click="updateStatus(record)" v-if="record.status">禁用</a>
						<a style="marginRight: 10px" @click="updateStatus(record)" v-else>启用</a>
						<a @click="deleteUser(record)">删除</a>
          </span>
        </template>
			</a-table>
		</div>
	</div>
</template>

<script>
import { SmileOutlined, DownOutlined, UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import userMgr from '/@/http/user';
import roleMgr from '/@/http/role';
let validateRoles = async (rule, value) => {
	if (value.length === 0) {
		return Promise.reject('请选择角色');
	} else {
		return Promise.resolve();
	}
};
export default {
	components: {
		SmileOutlined,
		DownOutlined,
		UserOutlined,
    LockOutlined,
	},
	data() {
		return {
			data: [],
			roleList: [],
			title: '新增用户',
			curId: null,
			visible: false,
			search: {
        account: '',
			},
			roleIds: [],
			formData: {
				account:"",
				name:"",
				roleIds: [],
				password:""
			},
			columns: [
				{
					title: "account",
					dataIndex: "account",
					key: "account",
				},
				{
					title: "name",
					dataIndex: "name",
					key: "name",
				},
				{
					title: "roles",
					key: "roles",
					dataIndex: "roles",
					slots: { customRender: "roles" },
				},
				{
					title: "status",
					key: "status",
					slots: { customRender: "status" },
				},
				{
					title: "createTime",
					dataIndex: "createTime",
					key: "createTime",
					slots: { customRender: "createTime" },
				},
				{
					title: "updateTime",
					dataIndex: "updateTime",
					key: "createTime",
					slots: { customRender: "createTime" },
				},
				{
					title: 'Action',
					dataIndex: 'operation',
					key: 'operation',
					slots: { customRender: 'operation' },
				},
			],
			pagination: {
				current: 1,
				pageSize: 10
			},
			loading: false,
			rules: {
        account: [
          { required: true, message: '请输入账户', trigger: 'blur' },
				],
				name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
				],
				password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
				],
				roleIds: [
          { required: true, validator: validateRoles, message: '请选择角色', trigger: 'change' },
				],
				// roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }],
      },
		};
	},
	created() {
		this.fetch();
		this.fetchRole();
	},
	methods: {
		handleChange(value) {
			console.log(value)
			// this.formData.roleIds 
    },
		handleSubmit(e) {
			if (this.search.account === '') {
				this.fetch()
			} else {
				this.fetch({...this.search})
			}
		},
		deleteUser(row) {
			let params = {
				...userMgr.del,
				data: {
					id: row.id
				}
			}
			this.$http(params).then(res=>{
				console.log('删除成功')
				this.fetch()
			}).catch(err=> {
				console.log('删除失败')
			})
		},
		updateStatus(row) {
			let params = {
				...userMgr.updateStatus,
				data: {
					id: row.id,
					status: !row.status
				}
			}
			this.$http(params).then(res=>{
				console.log('修改状态成功')
				this.fetch()
			}).catch(err=> {
				console.log('修改状态失败')
			})
		},
		onSubmit() {
			let password = "";
			if (this.formData.password) {
				password = this.$md5(this.formData.password);
			}
			let params = {
				...userMgr.create,
				data: {
					account:this.formData.account,
					name:this.formData.name,
					roleIds: this.formData.roleIds,
					password
				}
			}
			this.$refs.ruleForm
        .validate()
        .then(() => {
					if (this.title === '新增用户') {
						this.$http(params).then(res=>{
							console.log('新增成功')
							this.visible = false;
							this.fetch()
						}).catch(err=> {
							console.log('新增失败')
						})
					} else if (this.title === '编辑用户') {
						params.data.id = this.curId;
						params.url = userMgr.update.url
						params.method = userMgr.update.method
						Reflect.deleteProperty(params.data, "password");
						this.$http(params).then(res=>{
							console.log('编辑成功')
							this.visible = false;
							this.fetch()
						}).catch(err=> {
							console.log('编辑失败')
						})
					}
        }).catch(error => {
          console.log('error', error);
				});
		},
		showModel() {
			this.visible = true; 
			this.title='新增用户';
			this.formData = {
				account:"",
				name:"",
				roleIds: [],
				password:""
			}
		},
		updateUser(row) {
			this.visible = true;
			this.title = '编辑用户';
			this.formData = {
				...row,
				roleIds: row.roles.map(item=>{
					return item.id
				})
			};
			this.curId = row.id;
		},
		resetForm() {
			this.visible = false;
      this.$refs.ruleForm.resetFields();
    },
		afterVisibleChange(val) {
      console.log('visible', val);
    },
		handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },
    fetch(params = {},pageNum= 1, pageSize=10) {
			let data = {
					...userMgr.list,
					data: {
						pageNum,
						pageSize,
						...params
					}
				}
			this.loading = true;
      this.$http(data).then(data => {
        const pagination = { ...this.pagination };
        pagination.total = data._meta.totalCount;
        this.loading = false;
        this.data = data.items.map((item, key)=>{
					return {
						...item,
						key
					}
				});
        this.pagination = pagination;
      });
    },
		fetchRole(params = {}) {
			let data = {
					...roleMgr.list,
					data: {
						pageNum: 1,
						pageSize: 20,
						...params
					}
				}
      this.$http(data).then(data => {
        this.loading = false;
        this.roleList = data.items.map((item, key)=>{
					return {
						...item,
						key
					}
				});
      });
    },
	},
		
};
</script>

<style lang="scss">
	.ant-drawer-content-wrapper {
		width: 420px!important;
		.ant-form-item-control-wrapper {
			width: 80%;
		}
	}
</style>
