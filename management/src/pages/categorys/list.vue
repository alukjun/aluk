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
							<a-form-item label="分类名字" name="name">
								<a-input v-model:value="formData.name" />
							</a-form-item>
							<a-form-item label="分类排序" name="sort">
								<a-input type="number" v-model:value="formData.sort" />
							</a-form-item>
							<a-form-item label="父菜单" name="parentId">
								<a-tree-select
									v-model:value="formData.parentId"
									:tree-data="data"
									:replaceFields="{
										children: 'childCategory',
										title:'name',
										key:'name', 
										value: 'id'
									}"
									style="width: 100%"
									:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
									placeholder="Please select"
									allow-clear
									tree-default-expand-all
								>
							</a-form-item>
              <a-form-item label="分类图片" name="image">
                <a-upload
									:file-list="fileList"
									list-type="picture-card"
									:remove="handleRemove"
									:before-upload="beforeUpload"
									multiple
								>
									<a-button v-if="fileList.length < 9"> <a-icon type="upload" /> 选择图片 </a-button>
								</a-upload>
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
			childrenColumnName="childCategory"
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
import categoryMgr from '/@/http/category';
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
				sort: null
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
			},
      fileList: [],
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
		// 		...category.del,
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
				...categoryMgr.updateStatus,
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
			let formDatas = new FormData()
			this.fileList.forEach(item=> {
				formDatas.append('image' ,item)//图片
			})
			Object.keys(this.formData).forEach(item=> {
				formDatas.append(item ,this.formData[item])//图片
			})
			let params = {
				...categoryMgr.create,
				data: formDatas
			}
			this.$refs.ruleForm
        .validate()
        .then(() => {
					if (this.title === '新增分类') {
						this.$http(params).then(res=>{
							console.log('新增成功')
							this.visible = false;
							this.fetch()
						}).catch(err=> {
							console.log('新增失败')
						})
					} else if (this.title === '编辑分类') {
						params.data.id = this.curId;
						params.url = categoryMgr.update.url
						params.method = categoryMgr.update.method
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
			this.title='新增分类';
			this.formData = {
				name:"",
				parentId: null,
				sort: null
			}
		},
		updateUser(row) {
			this.visible = true;
			this.title = '编辑分类';
			this.formData = {
				name: row.name,
				parentId: row.parentId,
				sort: row.sort
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
					...categoryMgr.list,
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
		handleRemove(file) {
			const index = this.fileList.indexOf(file);
			const newFileList = this.fileList.slice();
			newFileList.splice(index, 1);
			this.fileList = newFileList;
		},
		beforeUpload(file) {
			this.fileList = [...this.fileList, file];
			return false;
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
