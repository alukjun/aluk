<template>
	<div>
		<div style="marginBottom: 32px">
			<a-form layout="inline" :model="search" @submit="handleSubmit" v-on:submit.prevent>
				<a-form-item label="name" name="name">
					<a-input v-model:value="search.name" placeholder="name">
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
							<a-form-item label="父菜单" name="parentId">
								<a-tree-select
									v-model:value="formData.parentId"
									:tree-data="data"
									:replaceFields="{
										children: 'childMenus',
										title:'name',
										key:'name', 
										value: 'id'
									}"
									style="width: 100%"
									:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
									placeholder="Please select"
									allow-clear
									tree-default-expand-all
								/>
							</a-form-item>
							<a-form-item label="菜单名字" name="name">
								<a-input v-model:value="formData.name" />
							</a-form-item>
							<a-form-item label="菜单路径" name="menuPath">
								<a-input v-model:value="formData.menuPath" />
							</a-form-item>
							<a-form-item label="菜单排序" name="menuSort">
								<a-input type="number" v-model:value="formData.menuSort" />
							</a-form-item>
							<a-form-item :wrapper-col="{ span: 24, offset: 0 }">
								<a-button type="primary" @click="onSubmit">
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
			childrenColumnName="childMenus"
    	@change="handleTableChange">
				<template #status="{record}">
					<span v-if="record.status" style="color: green">
						正常
					</span>
					<span v-else style="color: red">
						禁用
					</span>
				</template>
				<template #roles="{text}">
					{{text}}
				</template>
				<template #operation="{record}">
          <span class="table-operation">
            <a style="marginRight: 10px" @click="updateUser(record)">编辑</a>
						<a style="marginRight: 10px" @click="updateStatus(record)" v-if="record.status">禁用</a>
						<a style="marginRight: 10px" @click="updateStatus(record)" v-else>启用</a>
						<!-- <a @click="deleteUser(record)">删除</a> -->
          </span>
        </template>
			</a-table>
		</div>
	</div>
</template>

<script>
import { SmileOutlined, DownOutlined, UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import menuMgr from '../../http/menu';
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
			title: '新增用户',
			curId: null,
			visible: false,
			search: {
        name: '',
			},
			formData: {
				name:"",
				parentId: null,
				menuPath: "",
				menuSort: null
			},
			columns: [
				{
					title: "name",
					dataIndex: "name",
					key: "name",
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
				pageSize: 100
			},
			loading: false,
			rules: {
				name: [
          { required: true, message: '请输入菜单名字', trigger: 'blur' },
				],
				menuPath: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' },
				],
				menuSort: [
          { required: true, message: '请输入菜单排序', trigger: 'blur' },
				],
			},
		};
	},
	created() {
		this.fetch();
	},
	methods: {
		handleChange(value) {
      console.log(`selected ${value}`);
    },
		handleSubmit(e) {
			if (this.search.name === '') {
				this.fetch()
			} else {
				this.fetch({...this.search})
			}
		},
		// deleteUser(row) {
		// 	let params = {
		// 		...menuMgr.del,
		// 		data: {
		// 			id: row.id
		// 		}
		// 	}
		// 	this.$http(params).then(res=>{
		// 		console.log('删除成功')
		// 		this.fetch()
		// 	}).catch(err=> {
		// 		console.log('删除失败')
		// 	})
		// },
		updateStatus(row) {
			let params = {
				...menuMgr.updateStatus,
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
			if (!this.formData.parentId) {
				this.formData.parentId = 0
			}
			let params = {
				...menuMgr.create,
				data: this.formData
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
						params.url = menuMgr.update.url
						params.method = menuMgr.update.method
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
				name:"",
				parentId: null,
				menuPath: "",
				menuSort: null
			}
		},
		updateUser(row) {
			this.visible = true;
			this.title = '编辑用户';
			this.formData = {
				name: row.name,
				parentId: row.parentId,
				menuPath: row.menuPath,
				menuSort: row.menuSort
			}
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
					...menuMgr.list,
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
	},
		
};
</script>

<style lang="scss">
	.ant-drawer-content-wrapper {
		width: 420px!important;
		.ant-form-item-control-wrapper {
			width: 70%;
		}
	}
</style>
