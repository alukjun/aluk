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
										key:'id', 
										value: 'id'
									}"
									style="width: 100%"
									:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
									placeholder="Please select"
									allow-clear
									tree-default-expand-all
								/>
							</a-form-item>
              <a-form-item label="分类图片" name="image">
                <div>
									<a-upload
										:file-list="fileList"
										list-type="picture-card"
										accept=".png,.jpeg,.jpg"
										:remove="handleRemove"
										:before-upload="beforeUpload"
									>
										<a-button v-if="fileList && fileList.length === 0"> 选择图片 </a-button>
									</a-upload>
									
								</div>
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
import categoryMgr from '../../http/category';
import { message } from 'ant-design-vue';
let validateRoles = async (rule, value) => {
	if (value.length === 0) {
		return Promise.reject('请选择角色');
	} else {
		return Promise.resolve();
	}
};
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
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
					title: "sort",
					dataIndex: "sort",
					key: "sort",
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
			flag: false,
			isUpdate: false
		};
	},
	created() {
		this.fetch();
	},
	methods: {
		handleSubmit(e) {
			if (this.search.name === '') {
				this.fetch()
			} else {
				this.fetch({...this.search})
			}
		},
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
			let {fileList} = this;
			if (!this.formData.parentId) {
				this.formData.parentId = 0
			}
			
			this.$refs.ruleForm
        .validate()
        .then(() => {
					if (this.title === '新增分类') {
						if (fileList.length == 0) {
							message.warning('请选择一张图片');
							return fasle;
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
						this.$http(params).then(res=>{
							console.log('新增成功')
							this.visible = false;
							this.fetch()
						}).catch(err=> {
							console.log('新增失败')
						})
					} else if (this.title === '编辑分类') {
						if (fileList.length == 0) {
							message.warning('请选择一张图片');
							return fasle;
						}
						let formDatas = new FormData()
						console.log(this.fileList)
						this.fileList.forEach(item=> {
							formDatas.append('image' ,item)//图片
						})
						formDatas.append('isUpdate' ,this.isUpdate)
						Object.keys(this.formData).forEach(item=> {
							formDatas.append(item ,this.formData[item])
						})
						let params = {
							...categoryMgr.update,
							data: formDatas
						}
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
			this.fileList = [];
			this.flag = false;
			this.formData = {
				name:"",
				parentId: null,
				sort: null
			}
		},
		updateUser(row) {
			this.visible = true;
			this.title = '编辑分类';
			this.flag = false;
			this.formData = {
				name: row.name,
				parentId: row.parentId,
				sort: row.sort,
				id: row.id
			}
			if (row.image) {
				this.fileList = [{
					uid: '-1',
					name: 'image.png',
					status: 'done',
					url: 'http:/' + row.image,
					thumbUrl: 'http:/' + row.image,
				}]
			} else {
				this.fileList = []
			}
			
			this.curId = row.id;
		},
		resetForm() {
			this.visible = false;
      this.$refs.ruleForm.resetFields();
    },
		afterVisibleChange(val) {
      // console.log('visible', val);
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
			// let formDatas = new FormData()
			// formDatas.append('isUpdate' ,true)//图片
			// formDatas.append('id' ,this.formData.id)//图片
			// let updateImageParams = {
			// 	...categoryMgr.updateImage,
			// 	data: formDatas
			// }
			// this.$http(updateImageParams).then(res=>{
			// }).catch(err=> {
			// })
			this.isUpdate = true;
			const index = this.fileList.indexOf(file);
			const newFileList = this.fileList.slice();
			newFileList.splice(index, 1);
			this.fileList = newFileList;
		},
		beforeUpload(file) {
			this.isUpdate = true;
			this.flag = true;
			this.fileList = [...this.fileList, file];
			return false;
		},
		handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
		handleChange({ fileList }) {
      this.fileList = fileList;
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
