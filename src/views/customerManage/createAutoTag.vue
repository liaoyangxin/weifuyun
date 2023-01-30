<template>
  <div class="rightContentBox">
    <NotShowPage :title="groupId ? '编辑' : '新建自动标签'">
      <div class="page-content" slot="pageContent">
        <el-form
          :rules="rules"
          :model="{ ...tagGroupInfo, tagInputValue }"
          class="name-box"
          label-width="103px"
        >
          <el-form-item label="设置标签"> 触发后会自动打以下标签 </el-form-item>
          <el-form-item label="规则组名称" prop="ruleName">
            <el-input
              class="el-input-change input-size"
              v-model="tagGroupInfo.ruleName"
              placeholder="请输入"
              maxlength="15"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="标签"
            prop="tagInputValue"
            :class="{ 'hidden-tag-error': !showTagInput }"
          >
            <div class="tags-btn">
              <el-button
                :class="{
                  'handle-button-default': true,
                  'high-light-button': curTagIndex == tagidx,
                }"
                v-for="(tagItem, tagidx) in tagGroupInfo.tagList"
                :key="tagidx"
                @click="chooseTag(tagidx)"
              >
                {{ tagItem.tagName }}
                <i
                  class="el-icon-more"
                  @click="showTagEditDel = !showTagEditDel"
                >
                </i>
                <div
                  class="tag-handle-box"
                  v-if="showTagEditDel && curTagIndex == tagidx"
                >
                  <div @click="deleteTag(tagidx, tagItem)">删除</div>
                </div>
              </el-button>
              <div></div>
            </div>
            <div class="input-addBtn">
              <i class="el-icon-plus" @click="showModelFn('selectLabel')"
                >添加</i
              >
            </div>
          </el-form-item>
        </el-form>
        <section class="tag-rules">
          <div class="rule-title">
            "{{
              curTagIndex > -1
                ? this.tagGroupInfo.tagList[this.curTagIndex].name ||
                  this.tagGroupInfo.tagList[this.curTagIndex].tagName
                : ""
            }}"标签规则
          </div>
          <div class="rule-content">
            <!-- 行为 -->
            <div class="selec-des">客户行为 / 特征</div>
            <diV class="behavior">
              <div class="behavior-select">
                <el-select
                  v-if="curTagIndex > -1"
                  v-model="tagGroupInfo.tagList[curTagIndex].customerAction"
                  class="tag-select el-select-change"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(behaviorItem, idx) in behavior"
                    :key="idx"
                    :label="behaviorItem.label"
                    :value="behaviorItem.value"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-else
                  value="请选择"
                  :disabled="true"
                  class="tag-select el-select-change"
                  placeholder="请选择"
                >
                  <el-option label="xxx" :value="1"> </el-option>
                </el-select>
              </div>
              <div
                class="choose-material"
                v-if="
                  tagGroupInfo.tagList[curTagIndex] &&
                  tagGroupInfo.tagList[curTagIndex].customerAction == 2
                "
              >
                <el-button
                  class="choose-select-btn"
                  @click="dialogMaterial = true"
                  plain
                  >{{
                    tagGroupInfo.tagList[curTagIndex].materialId
                      ? tagGroupInfo.tagList[curTagIndex].materialInfo
                      : "选择素材"
                  }}
                  <i class="el-icon-arrow-right"></i>
                </el-button>
                <ChooseMaterial
                  v-if="dialogMaterial"
                  :dialogMaterial.sync="dialogMaterial"
                  :type="[0, 2, 3, 7]"
                  :show-checkbox="true"
                  :materialDetailList="getMaterial()"
                  @chooseMaterial="chooseMaterial"
                  @judgeIsExist="judgeIsExist"
                />
                <span class="no-material" v-if="!materialExist"
                  >所选素材已被删除，请重新选择</span
                >
              </div>
            </diV>
            <div class="selec-des" v-if="curTagIndex > -1">
              满足以下条件 / 设置
              <span
                >（同时满足以下条件）
                <span style="font-size: 12px; color: red"
                  >仅限视频素材获取时长</span
                >
              </span>
            </div>
            <div class="condition-box" v-if="curTagIndex > -1">
              <div
                class="condition"
                v-for="(typeRecordItem, idx) in conTypeRecord"
                :key="idx"
              >
                <template>
                  <div class="icon-remove" @click="removeCondition(idx)"></div>
                  <!-- 条件类型 -->
                  <diV class="first-con">
                    <el-select
                      class="tag-select el-select-change"
                      :ref="'type' + idx"
                      v-model="
                        tagGroupInfo.tagList[curTagIndex].tagRuleList[idx]
                          .conditionType
                      "
                      @change="handleType(idx)"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="typeItem of conType"
                        :key="typeItem.value"
                        v-show="typeItem.show"
                        :label="typeItem.label"
                        :value="typeItem.value"
                      >
                      </el-option>
                    </el-select>
                  </diV>
                  <!-- 条件 -->
                  <diV
                    class="second-con"
                    v-if="
                      tagGroupInfo.tagList[curTagIndex].tagRuleList[idx]
                        .conditionType
                    "
                  >
                    <!-- 选择了浏览时间不显示大于小于 -->
                    <el-select
                      class="tag-select el-select-change"
                      v-if="
                        tagGroupInfo.tagList[curTagIndex].tagRuleList[idx]
                          .conditionType != 2
                      "
                      placeholder="请选择"
                      v-model="
                        tagGroupInfo.tagList[curTagIndex].tagRuleList[idx]
                          .conditionExpression
                      "
                    >
                      <el-option
                        v-for="(compItem, compIdx) in compareCons"
                        :key="compIdx"
                        :label="compItem.label"
                        :value="compItem.value"
                      >
                      </el-option>
                    </el-select>
                    <div class="number-box">
                      <span
                        class="close-txt"
                        v-if="
                          tagGroupInfo.tagList[curTagIndex].tagRuleList[idx]
                            .conditionType == 2
                        "
                        >近</span
                      >
                      <el-input-number
                        v-model="
                          tagGroupInfo.tagList[curTagIndex].tagRuleList[idx]
                            .conditionValue
                        "
                        class="tag-select min-input"
                        controls-position="right"
                        :min="1"
                        :max="
                          convalidateRecord[
                            tagGroupInfo.tagList[curTagIndex].tagRuleList[idx]
                              .conditionType - 1
                          ]
                        "
                      />
                      <span>{{
                        unit[
                          tagGroupInfo.tagList[curTagIndex].tagRuleList[idx]
                            .conditionType - 1
                        ]
                      }}</span>
                    </div>
                  </diV>
                </template>
              </div>
              <div
                @click="addCondition"
                v-if="conTypeRecord.length <= 2"
                class="icon-plus-box"
              >
                <div class="icon-plus"></div>
                <span>添加条件</span>
              </div>
            </div>
          </div>
        </section>
        <el-button
          class="create-btn handle-button-primary"
          @click="hanleTagGroup"
          >{{ groupId ? "完成" : "新建" }}</el-button
        >
      </div>
    </NotShowPage>

    <el-dialog
      :visible.sync="showSelectLabel"
      title="企业标签"
      width="50%"
      @close="showSelectLabel = false"
    >
      <SelectLabel
        v-if="showSelectLabel"
        :defaultSelect="defaultSelectLabel"
        @getSelectLabel="getSelectLabel"
        ref="selectLabel"
      ></SelectLabel>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="showSelectLabel = false"
          v-loading="loadingSelectLableButton"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="modelOk"
          v-loading="loadingSelectLableButton"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/api/autoTag/createAutoTag";
import queryTGInfo from "./mixin";
import ChooseMaterial from "@/components/ChooseMaterial";
import NotShowPage from "@/components/NotShowPage.vue";
import SelectLabel from "@/views/customerManage/groupPostMoments/SelectLabel";

export default {
  name: "CreateAutoTag",
  components: { ChooseMaterial, NotShowPage, SelectLabel },
  data() {
    return {
      showSelectLabel: false,
      loadingSelectLableButton: false,
      defaultSelectLabel: [],
      // 标签组信息
      tagGroupInfo: {
        id: "",
        ruleName: "",
        tagList: [
          // {
          //   "customerAction": 0,
          //   "id": 0,
          //   "materialId": 0,
          //   "tagId": "",
          //   "tagName": ""
          //   "tagRuleList": [
          //     {
          //       "conditionExpression": 0,
          //       "conditionType": 0,
          //       "conditionUnit": "",
          //       "conditionValue": 0,
          //       "id": 0
          //     }
          //   ]
          // }
        ],
      },
      curTagIndex: -1,
      // 1：浏览任意素材，2：浏览指定素材
      behavior: [
        {
          label: "浏览任意素材",
          value: 1,
        },
        {
          label: "浏览指定素材",
          value: 2,
        },
      ],
      // 记录条件类型
      // 1：浏览次数，2：浏览时间，3：每次浏览时长
      conType: [
        {
          value: 1,
          label: "浏览次数",
          show: true,
        },
        {
          value: 2,
          label: "浏览时间",
          show: true,
        },
        {
          value: 3,
          label: "每次浏览时长",
          show: true,
        },
        // {
        //   1: {
        //     label: "浏览次数",
        //     show: true,
        //   },
        //   2: {
        //     label: "浏览时间",
        //     show: true,
        //   },
        //   3: {
        //     label: "每次浏览时长",
        //     show: true,
        //   },
        // },
      ],
      // 记录一个标签选择了那些条件类型
      conTypeRecord: [],
      // 1：大于，2：小于，3：等于，4：大于等于，5：小于等于
      compareCons: [
        {
          label: "大于等于",
          value: 4,
        },
      ],
      // 标签名输入框值
      tagInputValue: "",
      // 是否显示标签名输入框
      showTagInput: false,
      // 是否显示标签的编辑和删除
      showTagEditDel: false,
      // 是否切换了标签
      isChangeTag: false,
      // 是否是在对已经存在的标签修改标签名
      isChangeTagName: false,
      // 单位
      unit: ["次", "天", "秒"],
      // 查询的标签组id
      groupId: this.$route.query.id || "",
      // 条件的数值时间校验记录
      convalidateRecord: [10000, 720, 3600],
      // 表单校验
      rules: {
        ruleName: [
          { required: true, message: "请输入标签组名称", trigger: "blur" },
        ],
        tagInputValue: [
          { required: true, message: "请输入标签名称", trigger: "blur" },
        ],
      },
      // 是否显示素材选择弹出框
      dialogMaterial: false,
      // 编辑标签组时，标识之前选择的素材是否被删除
      materialExist: true,
    };
  },
  mixins: [queryTGInfo],
  created() {
    if (this.groupId) {
      // this.queryTagGroupInfo("edit");
      this.getDitail();
    }
    this.conTypeRecord = this.computeTagCon();
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  watch: {
    // 操作条件后重新计算conType
    conTypeRecord(newvalue, oldvalue) {
      this.conType.map((item) => {
        item.show = true;
        if (newvalue.some((v) => v === item.value)) {
          item.show = false;
        }
        return item;
      });
    },
  },
  methods: {
    getDitail() {
      api.queryById({ id: this.$route.query.id }).then(({ data }) => {
        this.defaultSelectLabel = [];
        if (data.tagList && data.tagList.length > 0) {
          data.tagList = data.tagList.map((item) => {
            if (item.ruleMaterial) {
              item.materialId = item.ruleMaterial.materialId;
              item.materialList = [item.ruleMaterial];
              item.materialInfo = `${item.ruleMaterial.mediaTypeName || ""} "${
                item.ruleMaterial.materialName || ""
              }"`;
            }
            const obj = {
              tagId: item.tagId,
              tagName: item.tagName,
              name: item.tagName,
            };
            this.defaultSelectLabel.push(obj);
            return item;
          });
        }
        this.tagGroupInfo = data;
        this.chooseTag(0);
      });
    },
    addCondition() {
      this.conTypeRecord.push("");
      let conItem = {
        conditionExpression: "",
        conditionType: "",
        conditionUnit: "",
        conditionValue: "",
      };
      this.tagGroupInfo.tagList[this.curTagIndex].tagRuleList.push(conItem);
    },
    removeCondition(idx) {
      this.conTypeRecord.splice(idx, 1);
      this.tagGroupInfo.tagList[this.curTagIndex].tagRuleList.splice(idx, 1);
    },
    handleType(typeIdx) {
      let newType =
        this.tagGroupInfo.tagList[this.curTagIndex].tagRuleList[typeIdx]
          .conditionType;
      this.conTypeRecord.splice(typeIdx, 1, newType);
      let num = [1, 30, 60];
      this.tagGroupInfo.tagList[this.curTagIndex].tagRuleList[
        typeIdx
      ].conditionValue = num[newType - 1];
      this.tagGroupInfo.tagList[this.curTagIndex].tagRuleList[
        typeIdx
      ].conditionExpression = 4;
    },
    chooseTag(tagidx) {
      this.curTagIndex = tagidx;
      this.isChangeTag = true;
      this.conTypeRecord = this.computeTagCon();
      this.getMaterial();
    },
    hanleTagGroup() {
      if (!this.tagGroupInfo.ruleName)
        return this.msgError("规则组名称不能为空");
      if (!this.tagGroupInfo.tagList.length)
        return this.msgError("请至少添加一个标签");

      for (let i = 0; i < this.tagGroupInfo.tagList.length; i++) {
        const tag = this.tagGroupInfo.tagList[i];
        if (!tag.customerAction)
          return this.msgError(`第 ${i + 1} 个标签请选择客户行为 / 特征`);
        if (!tag.tagRuleList.length)
          return this.msgError(`第 ${i + 1} 个标签的标签规则不能为空`);
        if (tag.customerAction == 2 && !tag.materialId)
          return this.msgError(
            `第 ${
              i + 1
            } 个标签当选择了客户行为/特征为浏览指定素材时，必须指定具体的素材`
          );
        tag.tagRuleList.forEach((rule) => {
          rule.conditionUnit = this.unit[rule.conditionType - 1];
          if (rule.conditionType == 2) rule.conditionExpression = 5;
        });
      }
      let params = this.tagGroupInfo;
      api.createTagGroup(params).then((res) => {
        if (res.code == 200) {
          this.msgSuccess(`${this.groupId ? "修改" : "添加"}标签组成功`);
          this.$router.push({ path: "automaticTag" });
        } else {
          this.msgError(`${this.groupId ? "修改" : "添加"}标签组失败`);
        }
      });
    },
    // 计算当前选择的标签的条件
    computeTagCon() {
      let ary = [];
      if (!this.tagGroupInfo.tagList.length) ary = [""];
      else {
        this.tagGroupInfo.tagList[this.curTagIndex].tagRuleList.forEach((t) => {
          ary.push(t.conditionType);
        });
      }
      return ary;
    },
    chooseMaterial(material) {
      this.materialExist = true;
      this.tagGroupInfo.tagList[this.curTagIndex].materialList = [
        {
          id: material.id,
          materialName: material.materialName,
          categoryId: material.categoryId,
          mediaType: material.mediaType,
          parentId: material.parentId,
        },
      ];
      this.tagGroupInfo.tagList[this.curTagIndex].materialId = material.id;
      this.tagGroupInfo.tagList[this.curTagIndex].materialInfo = `${
        material.mediaTypeTxt || ""
      } "${material.materialName || ""}"`;
    },
    judgeIsExist(materialExist) {
      if (this.groupId) this.materialExist = materialExist;
    },
    getMaterial() {
      if (this.groupId) {
        // 编辑状态且指定了素材
        if (this.tagGroupInfo.tagList[this.curTagIndex].customerAction == 2) {
          if (!this.tagGroupInfo.tagList[this.curTagIndex].materialList)
            this.tagGroupInfo.tagList[this.curTagIndex].materialList = [
              { id: this.tagGroupInfo.tagList[this.curTagIndex].materialId },
            ];
          return this.tagGroupInfo.tagList[this.curTagIndex].materialList;
        } else [];
      } else {
        return this.tagGroupInfo.tagList[this.curTagIndex].materialList;
      }
    },
    showModelFn() {
      this.showSelectLabel = true;
    },
    getSelectLabel(getArr) {
      this.defaultSelectLabel = JSON.parse(JSON.stringify(getArr));
      let arr = JSON.parse(JSON.stringify(getArr));
      if (arr.length > 0) {
        this.tagGroupInfo.tagList = arr.map((item) => {
          let obj = {
            customerAction: '',
            id: "",
            materialId: '',
            tagId: item.tagId,
            tagName: item.name,
            tagRuleList: [
              {
                conditionExpression: '',
                conditionType: "",
                conditionUnit: '',
                conditionValue: '',
                id: "",
              },
            ],
          };
          let index = this.tagGroupInfo.tagList.findIndex(v => v.tagId === obj.tagId)
          if (index > -1) {
            obj = this.tagGroupInfo.tagList[index]
          }
          return obj
        });
      } else {
        this.tagGroupInfo.tagList = []
      }
      this.chooseTag(0)
      this.showSelectLabel = false;
    },
    modelOk() {
      this.$refs.selectLabel.submit();
    },
    deleteTag(tagIdx, obj) {
      this.showTagEditDel = false;
      // this.confirmChange({
      //   typeMsg: "警示",
      //   msg: "删除后，按此标签规则为客户所打的标签将不受影响，确定要删除吗？",
      //   confirmMsg: "删除成功",
      //   cancelMsg: "已取消删除",
      //   iconfont: "icon_tishi-03",
      //   successFun1: () => {
      //   },
      // });
      this.tagGroupInfo.tagList.splice(tagIdx, 1);
      this.defaultSelectLabel.splice(
        this.defaultSelectLabel.findIndex((v) => v.tagId === obj.tagId),
        1
      );
      this.curTagIndex = this.tagGroupInfo.tagList.length ? 0 : -1;
      this.isChangeTag = true;
      this.conTypeRecord = this.computeTagCon();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/tag-manage.scss";
.hidden-tag-error {
  /deep/.el-form-item__error {
    display: none;
  }
}
.page-content {
  padding: 20px;
  flex: auto;
  overflow-y: scroll;
  .name-box {
    /deep/.el-form-item {
      .el-form-item__content {
        min-height: 40px;
        .tags-btn {
          .el-button {
            position: relative;
            margin: 0 10px 10px 0;
            color: #222;
            padding-right: 40px;
            .tag-handle-box {
              width: 94px;
              height: 30px;
              position: absolute;
              top: -35px;
              right: 0px;
              background: #ffffff;
              box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.1);
              border-radius: 4px;
              border: 1px solid #e6e6e6;
              div {
                width: 100%;
                height: 100%;
                color: #222222;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
            .el-icon-more {
              position: absolute;
              right: 12px;
              top: 50%;
              transform: translateY(-50%) rotate(90deg);
              color: #666;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
        .input-addBtn {
          height: 40px;
          display: flex;
          align-items: center;
          .tag-name-input {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            margin-right: 10px;
          }
          .el-icon-plus {
            cursor: pointer;
            color: #2075f5;
            display: block;
            width: 60px;
            flex-shrink: 0;
            &::before {
              margin-right: 4px;
            }
          }
        }
      }
    }

    .input-size {
      width: 350px;
    }
    .input-btns {
      margin-left: 10px;
    }
  }
  .tag-rules {
    padding: 0 20px 20px;
    background: #f5f5f5;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    .rule-title {
      height: 64px;
      border-bottom: 1px solid #e6e6e6;
      display: flex;
      align-items: center;
    }
    .rule-content {
      .selec-des {
        margin-top: 20px;
        span {
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          color: #666666;
        }
      }
      .condition-box {
        .condition {
          display: flex;
          align-items: center;
          margin-top: 10px;
          .second-con {
            display: flex;
            .tag-select {
              margin-left: 10px;
            }
          }
          .number-box {
            .close-txt {
              margin-left: 10px;
            }
          }
        }
        .icon-plus,
        .icon-remove {
          cursor: pointer;
          margin-right: 10px;
          width: 24px;
          height: 24px;
          background: url("../../assets/fontImg/icon_jian.png");
          background-size: 100%;
        }
        .icon-plus {
          background: url("../../assets/fontImg/icon_jia.png");
          background-size: 100%;
        }
        .icon-plus-box {
          color: #2075f5;
          display: flex;
          width: 100px;
          height: 40px;
          align-items: center;
          margin-top: 10px;
          span {
            line-height: 24px;
          }
        }
      }
      .behavior {
        display: flex;
        margin-top: 10px;
        .behavior-select {
          margin-right: 10px;
        }
        .choose-material {
          display: flex;
          align-items: center;
          .no-material {
            margin-left: 10px;
            color: rgb(205, 5, 5);
            font-size: 12px;
          }
        }
      }
      .min-input {
        width: 101px;
        margin-right: 10px;
        /deep/.el-input {
          width: 101px;
        }
        /deep/span {
          background-color: #f5f5f5 !important;
        }
      }
    }
  }
}
.create-btn {
  margin-top: 30px;
}
.high-light-button {
  border: 1px solid #06a17e !important;
}
.show_label {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  border: 1px solid #dcdfe6ed;
  border-radius: 4px;
  width: 260px;
  padding: 0 5px;
  .labelFont {
    font-size: 14px;
    color: #2075f5;
    line-height: 22px;
    padding: 5px 12px;
    background-color: #e6f4ff;
    border-radius: 4px;
    margin-right: 10px;
  }
  i {
    line-height: 40px;
  }
}
</style>
