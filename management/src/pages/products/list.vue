<template>
	<div>
		<div style="marginBottom: 32px">
			<a-form layout="inline" :model="search" @submit="handleSubmit" @submit.native.prevent>
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
						<a-form :model="formData" layout="vertical" ref="ruleForm" :rules="rules">
							<a-form-item label="商品名称" name="name">
								<a-input v-model:value="formData.name" />
							</a-form-item>
              <a-form-item label="商品描述" name="description">
								<a-input v-model:value="formData.description" />
							</a-form-item>
							<a-form-item label="商品文章" name="articles">
								<div v-if="title === '新增商品'">
									<a-input v-model:value="formData.articles" />
								</div>
								<div v-if="title === '编辑商品'">
									<a-input v-model:value="formData.articles.content" />
								</div>
							</a-form-item>
							<a-form-item label="商品价格" name="price">
								<a-input v-model:value="formData.price"/>
							</a-form-item>
							<a-form-item label="是否新品" name="type">
								<a-switch v-model:checked="formData.type" @change="onChange" />
							</a-form-item>
							<a-form-item label="商品规格" name="detailDescriptions">
								<div v-if="formData.detailDescriptions && formData.detailDescriptions.length > 0">
									<div class="detailDescriptions" v-for="(item, index) in formData.detailDescriptions" :key="index">
										<span>key:</span>&nbsp;<a-input size="small" v-model:value="item.key" />&nbsp;&nbsp;
										<span>value:</span>&nbsp;<a-input size="small" v-model:value="item.value" />&nbsp;&nbsp;
										<a-button type="primary" size="small" @click="addDescription">添加</a-button>&nbsp;
										<a-button type="primary" size="small" @click="delDescription(index)">删除</a-button>
									</div>
								</div>
								<div v-else>
									<a-button type="primary" size="small" @click="addDescription">添加</a-button>&nbsp;
								</div>
							</a-form-item>
							<a-form-item label="分类" name="categoryId">
								<a-tree-select
									v-model:value="formData.categoryId"
									:tree-data="cateList"
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
							<a-form-item label="图片" name="images">
								<div v-if="title === '新增商品'">
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
                
								<div class="clearfix" v-if="title === '编辑商品'">
									<a-upload
										action="https://api.1pinliangwei.com/product/admin/updateProductImageById.do"
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
				<template #articles="{record}">
					{{record?.articles.length > 0 ? record.articles[0].content : ''}}
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
import productMgr from '../../http/product';
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
			title: '新增商品',
			curId: null,
			visible: false,
			search: {
        name: '',
			},
			formData: {
				description:"",
				name:"",
				articles: "",
				categoryId: '',
				type: 1,
				detailDescriptions: [{
					key: '',
					value: ''
				}],
				price: 0,
				images: [],
			},
			columns: [
        {
					title: "name",
					dataIndex: "name",
					key: "name",
				},
				// {
				// 	title: "description",
				// 	dataIndex: "description",
				// 	key: "description",
				// },
				{
					title: "articles",
					slots: { customRender: "articles" },
					key: "articles",
				},
				{
					title: "categoryId",
					dataIndex: "categoryId",
					key: "categoryId",
				},
				{
					title: "status",
					key: "status",
					slots: { customRender: "status" },
				},
				{
					title: "detailDescriptions",
					key: "detailDescriptions",
					slots: { customRender: "detailDescriptions" },
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
          { required: true, message: '请输入描述', trigger: 'blur' },
				],
				name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
				],
      },
		};
	},
	created() {
		this.fetch()
		this.fetchCategory()
	},
	methods: {
		onChange(checked) {
		},
		addDescription() {
			this.formData.detailDescriptions.push({
				key: '',
				value: ''
			})
		},
		delDescription(index) {
			this.formData.detailDescriptions.splice(index,1)
		},
		handleSubmit(e) {
			if (this.search.name === '') {
				this.fetch()
			} else {
				this.fetch({...this.search})
			}
		},
		updateStatus(row) {
			let params = {
				...productMgr.updateStatus,
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
					if (this.title === '新增商品') {
						if (fileList.length == 0) {
							message.warning('请选择一张图片');
							return fasle;
						}
						let formDatas = new FormData()
						fileList.forEach(item=> {
							formDatas.append('images' ,item)//图片
						})
						this.formData.type = this.formData.type ? 1 : 0
						this.formData.detailDescription = JSON.stringify(this.formData.detailDescriptions)
						Object.keys(this.formData).forEach(item=> {
							formDatas.append(item ,this.formData[item])//图片
						})
						let params = {
							...productMgr.create,
							data: formDatas
						}
						// for(let i = 1; i <=10; i++) {
							this.$http(params).then(res=>{
								this.visible = false;
								this.fetch()
							}).catch(err=> {
							})
						// }
						
					} else if (this.title === '编辑商品') {
						let formDatas = new FormData()
						let imageId = [];
						fileList.forEach(item=> {
							imageId.push(item.id)//图片
						})
						this.formData.price = +this.formData.price;
						this.formData.articles = {
							id: this.formData.articles.id,
							content: this.formData.articles.content
						}
						this.formData.type = this.formData.type ? 1 : 0
						this.formData.detailDescription = JSON.stringify(this.formData.detailDescriptions)
						// this.formData.detailDescription = JSON.parse(JSON.stringify(this.formData.detailDescriptions))
						let params = {
							...productMgr.update,
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
			this.title='新增商品';
			this.fileList = [];
			this.formData = {
				description:"",
				name:"",
				articles: "",
				categoryId: '',
				type: 1,
				detailDescriptions: [{
					key: '',
					value: ''
				}],
				price: 0,
			}
		},
		updateUser(row) {
			this.visible = true;
			this.title = '编辑商品';
			this.formData = {
				...row,
				articles: row?.articles.length > 0 ? row.articles[0] : {}
			};
			if (row.images && row.images.length > 0) {
				this.fileList = row.images.map(item=>{
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
				...productMgr.list,
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
			let formDatas = new FormData()
			let imageId = [];
			imageId.push(file.id)//图片
			formDatas.append('imageId' ,imageId.join('&'))//图片
			formDatas.append('id' ,this.formData.id)//图片
			let updateImageParams = {
				...productMgr.updateImage,
				data: formDatas
			}
			this.$http(updateImageParams).then(res=>{
			}).catch(err=> {
			})
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
