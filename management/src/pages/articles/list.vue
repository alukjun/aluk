<template>
	<div>
		<div style="marginBottom: 32px">
			<a-form layout="inline" :model="search" @submit="handleSubmit" @submit.native.prevent>
				<a-form-item label="title" name="title">
					<a-input v-model:value="search.title" placeholder="title">
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
						<a-form :model="formData" layout="vertical" ref="ruleForm" :rules="rules">
							<a-form-item label="文章标题" name="title">
								<a-input v-model:value="formData.title" />
							</a-form-item>
              <a-form-item label="文章描述" name="description">
								<a-input v-model:value="formData.description" />
							</a-form-item>
							<a-form-item label="图片标签" name="imageName" v-if="title === '新增文章'">
								<a-input v-model:value="formData.imageName" />
							</a-form-item>
							<a-form-item label="图片" name="images">
								<div v-if="title === '新增文章'">
									<a-upload
										:file-list="fileList"
										list-type="picture-card"
										accept=".png,.jpeg,.jpg"
										:remove="handleRemove"
										:before-upload="beforeUpload"
									>
										<a-button v-if="fileList && fileList.length < 9"> 选择图片 </a-button>
									</a-upload>
									
								</div>
                
								<div class="clearfix" v-if="title === '编辑文章'">
									<a-upload
										action="https://api.1pinliangwei.com/introduce/admin/updateIntroduceImageById.do"
										list-type="picture-card"
										accept=".png,.jpeg,.jpg"
										method="put"
										name="images"
										:file-list="fileList"
										:remove="handleRemove"
										@preview="handlePreview"
										@change="handleChange"
										:data="{'id': formData.id}"
									>
									<a-button v-if="fileList && fileList.length < 9"> 选择图片 </a-button>
									</a-upload>
									<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
										<img alt="example" style="width: 100%" :src="previewImage" />
									</a-modal>
								</div>
							</a-form-item>
							<a-form-item :wrapper-col="{ span: 24, offset: 0 }">
								<a-button type="primary" @click.native="handleUpload">
									确定
								</a-button>
								<a-button style="margin-left: 10px;" @click.native="resetForm">
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
				<template #detailDescriptions="{record}">
					{{record?.detailDescriptions.length > 0 ? record.detailDescriptions : ''}}
				</template>
				
				<template #roles="{text}">
					{{text}}
				</template>
				<template #operation="{record}">
          <span class="table-operation">
            <a style="marginRight: 10px" @click="updateUser(record)">编辑</a>
						<!-- <a style="marginRight: 10px" @click="updateImage(record)">编辑</a> -->
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
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { message } from 'ant-design-vue';
import articleMgr from '../../http/article';
import categoryMgr from '../../http/category';
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
		UserOutlined,
    LockOutlined,
	},
	data() {
		return {
			data: [],
			cateList: [],
			previewVisible: false,
			fileList: [],
			title: '新增文章',
			curId: null,
			visible: false,
			search: {
        title: '',
			},
			formData: {
				description:"",
				title:"",
				imageName: ''
			},
			columns: [
        {
					title: "title",
					dataIndex: "title",
					key: "title",
				},
				{
					title: "id",
					dataIndex: "id",
					key: "id",
				},
				{
					title: "description",
					dataIndex: "description",
					key: "description",
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
					width: 140
				},
			],
			pagination: {
				current: 1,
				pageSize: 10
			},
			loading: false,
			rules: {
        description: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
				],
				title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
				],
      },
		};
	},
	created() {
		this.fetch()
		// this.fetchCategory()
	},
	methods: {
		onChange(checked) {
		},
		handleSubmit(e) {
			if (this.search.title === '') {
				this.fetch()
			} else {
				this.fetch({...this.search})
			}
		},
		updateStatus(row) {
			let params = {
				...articleMgr.updateStatus,
				data: {
					id: row.id,
					status: !row.status
				}
			}
			this.$http(params).then(res=>{
				this.fetch()
			}).catch(err=> {
			})
		},
		handleUpload() {
			let {fileList} = this;
			this.$refs.ruleForm
        .validate()
        .then(() => {
					if (this.title === '新增文章') {
						if (fileList.length == 0) {
							message.warning('请选择一张图片');
							return fasle;
						}
						let formDatas = new FormData()
						fileList.forEach(item=> {
							formDatas.append('images' ,item)//图片
						})
						Object.keys(this.formData).forEach(item=> {
							formDatas.append(item ,this.formData[item])//图片
						})
						let params = {
							...articleMgr.create,
							data: formDatas
						}
						this.$http(params).then(res=>{
							this.visible = false;
							this.fetch()
						}).catch(err=> {
						})
					} else if (this.title === '编辑文章') {
						let formDatas = new FormData()
						let imageId = [];
						fileList.forEach(item=> {
							imageId.push(item.id)//图片
						})
						this.formData.detailDescription = JSON.stringify(this.formData.detailDescriptions)
						let params = {
							...articleMgr.update,
							data: {...this.formData,imageIds: imageId}
						}
						params.data.id = this.curId;
						this.$http(params).then(res=>{
							this.visible = false;
							this.fetch()
						}).catch(err=> {
						})
					}
        }).catch(error => {
				});
		},
		// base64 转 blob
		dataURItoBlob(dataURI) {
			// convert base64/URLEncoded data component to raw binary data held in a string
			let byteString;
			if (dataURI.split(',')[0].indexOf('base64') >= 0) {
				byteString = atob(dataURI.split(',')[1]);
			} else byteString = unescape(dataURI.split(',')[1]);
		
			// separate out the mime component
			const mimeString = dataURI
				.split(',')[0]
				.split(':')[1]
				.split(';')[0];
		
			// write the bytes of the string to a typed array
			const ia = new Uint8Array(byteString.length);
			for (let i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			return new Blob([ia], { type: mimeString });
		},
		showModel() {
			this.visible = true; 
			this.title='新增文章';
			this.fileList = [];
			this.formData = {
				description:"",
				title:"",
				imageName: ''
			}
		},
		updateUser(row) {
			this.visible = true;
			this.title = '编辑文章';
			this.formData = {
				...row
			};
			if (row.imageVoList && row.imageVoList.length > 0) {
				this.fileList = row.imageVoList.map(item=>{
					return {
						uid: item.id,
						id: item.id,
						name: item.name,
						url: 'https://api.1pinliangwei.com' + item.imageUrl,
						thumbUrl: 'https://api.1pinliangwei.com' + item.imageUrl,
						status: 'done',
					}
				})
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
				...articleMgr.list,
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
					if (item.detailDescription) {
						let detailDescriptions = []
						if (JSON.parse(item.detailDescription) instanceof Array) {
							detailDescriptions = JSON.parse(item.detailDescription)
						} else {
							detailDescriptions.push(JSON.parse(item.detailDescription))
						}
						return {
							...item,
							detailDescriptions,
							key
						}
					} else {
						return {
							...item,
							detailDescriptions:[],
							key
						}
					}
					
				});
        this.pagination = pagination;
      });
		},
		fetchCategory(params = {}) {
			let param = {
					...categoryMgr.list,
					data: {
						pageNum: 1,
						pageSize: 20,
						...params
					}
				}
      this.$http(param).then(data => {
        this.cateList = data.items.map((item, key)=>{
					return {
						...item,
						key
					}
				});
      });
		},
		handleRemove(file) {
			if (this.title === '编辑文章') {
				let formDatas = new FormData()
				let imageId = [];
				imageId.push(file.id)//图片
				formDatas.append('imageIds' ,imageId.join('&'))//图片
				formDatas.append('id' ,this.formData.id)//图片
				let updateImageParams = {
					...articleMgr.updateImage,
					data: formDatas
				}
				this.$http(updateImageParams).then(res=>{
				}).catch(err=> {
				})
			}
			const index = this.fileList.indexOf(file);
			const newFileList = this.fileList.slice();
			newFileList.splice(index, 1);
			this.fileList = newFileList;
		},
		beforeUpload(file) {
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
			width: 80%;
		}
	}
	.detailDescriptions {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 10px;
		.ant-input {
			
		}
	}
</style>
